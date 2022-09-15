import React from 'react'
import { XCircleIcon } from '@heroicons/react/solid'
import { ChainId, getContractAddressesForChainOrThrow, NounsAuctionHouseABI } from '@nouns/sdk'
import { getDefaultProvider, utils, BigNumber as EthersBN } from 'ethers'
import BigNumber from 'bignumber.js'
import { usePrepareContractWrite, useContractWrite, useAccount, useBalance, useWaitForTransaction } from 'wagmi'
import Button from 'components/Button'
import Input from 'components/Input'
import Paragraph from 'components/Paragraph'
import Toast from 'components/Toast'
import { Status, ToastData } from 'utils/types'

const { nounsAuctionHouseProxy } = getContractAddressesForChainOrThrow(ChainId.Mainnet)

const pctBidAmounts = [5, 10, 20]

type BidProps = {
  minAmount: string
  id: number
}

const statusToMessage: Record<Status, string> = {
  success: 'Bid Confirmed',
  loading: 'Bid Pending',
  error: 'Bid Failed',
  idle: 'Bid Pending',
}

const computeMinimumNextBid = (currentBid: BigNumber): BigNumber =>
  currentBid.times(new BigNumber(0.02).plus(1)).decimalPlaces(0, BigNumber.ROUND_UP)

const minBidEth = (minBid: BigNumber): string => {
  if (minBid.isZero()) {
    return '0.01'
  }

  const eth = utils.formatEther(EthersBN.from(minBid.toString()))
  return new BigNumber(eth).toFixed(2, BigNumber.ROUND_CEIL)
}

const increaseBidByPercentage = (bid: BigNumber, percentage: number): string => {
  const newBid = bid.times(new BigNumber(percentage).plus(1)).decimalPlaces(0, BigNumber.ROUND_UP)
  const eth = utils.formatEther(EthersBN.from(newBid.toString()))
  return new BigNumber(eth).toFixed(2, BigNumber.ROUND_CEIL)
}

const Bid = ({ minAmount, id }: BidProps) => {
  const [amount, setAmount] = React.useState<string>('')
  const [gasAmount, setGasAmount] = React.useState<string>('')
  const { isConnected, address } = useAccount()
  const changeAmount = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.slice(0, 10))
  }, [])
  const [toast, setToast] = React.useState<ToastData>({ open: false, message: '', type: 'error' })
  const [txHash, setTxHash] = React.useState('')
  const minBid = computeMinimumNextBid(new BigNumber(minAmount))
  const { data } = useBalance({
    addressOrName: address,
    formatUnits: 'ether',
    watch: true,
  })

  const triggerErrorToast = (message: string) => {
    setToast({ message, open: true, type: 'error' })
    const timeout = setTimeout(() => {
      setToast(toast => ({ ...toast, open: false }))
    }, 4000)

    return () => clearTimeout(timeout)
  }

  const triggerDataToast = (status: Status, hash?: string) => {
    hash && setTxHash(hash)
    setToast({ message: statusToMessage[status], open: true, type: status })
    if (status === 'success') {
      const timeout = setTimeout(() => {
        setToast(toast => ({ ...toast, open: false }))
      }, 4000)

      return () => clearTimeout(timeout)
    }
  }

  const { config, isError: bidError } = usePrepareContractWrite({
    addressOrName: nounsAuctionHouseProxy,
    contractInterface: NounsAuctionHouseABI,
    enabled: isConnected && Boolean(minBid),
    functionName: 'createBid',
    args: [id],
    overrides: {
      value: EthersBN.from(utils.parseEther(amount || '0')),
    },
  })

  const { write: createBid, data: bidTxData } = useContractWrite(config)
  const { status: bidStatus } = useWaitForTransaction({
    hash: bidTxData?.hash,
  })

  React.useEffect(() => {
    const getGas = async () => {
      const gasPrice = await getDefaultProvider('homestead', { alchemy: process.env.ALCHEMY_API_KEY }).getGasPrice()
      const totalGas = new BigNumber(utils.formatEther(gasPrice))
        .times(new BigNumber(config?.request?.gasLimit?.toString() || 0))
        .toString()
      setGasAmount(totalGas)
    }
    getGas()
  }, [config?.request])

  React.useEffect(() => {
    if (bidStatus !== 'idle') {
      triggerDataToast(bidStatus, bidTxData?.hash)
    }
  }, [bidStatus])

  const submitBid = () => {
    if (isConnected) {
      if (!amount) {
        return triggerErrorToast('Bid amount is empty')
      }

      if (EthersBN.from(utils.parseEther(amount)).lt(EthersBN.from(minAmount))) {
        return triggerErrorToast('Bid amount is below reserve amount')
      }

      return bidError ? triggerErrorToast('Insufficient Balance') : createBid?.()
    } else {
      triggerErrorToast('Wallet not connected')
    }
  }
  const availableEther = new BigNumber(data?.formatted.toString() || 0).minus(gasAmount).toFixed(2, BigNumber.ROUND_DOWN).toString()
  return (
    <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
      <div className="flex justify-between">
        <Paragraph>Bid controls</Paragraph>
        {isConnected && (
          <Button type="link" onClick={() => setAmount(availableEther)}>
            Ξ {availableEther} available
          </Button>
        )}
      </div>
      <Input
        prefix={<span className="text-white/60">Ξ</span>}
        prefixPadding="pl-8"
        value={amount}
        min="0"
        type="number"
        onChange={changeAmount}
        placeholder={`${minBidEth(minBid)} or more`}
        hasClickableSuffix
        suffix={
          amount?.length ? (
            <Button type="link" onClick={() => setAmount('')}>
              <XCircleIcon className="w-5 h-5 transition ease-in-out hover:text-white/40 text-white/60" />
            </Button>
          ) : undefined
        }
      />
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={() => setAmount(minBidEth(minBid))} weight="normal" type="outline">
          Min
        </Button>
        {pctBidAmounts.map(pct => (
          <Button
            weight="normal"
            key={pct}
            onClick={() => setAmount(increaseBidByPercentage(new BigNumber(minAmount), pct / 100))}
            type="outline"
          >
            {`+${pct}%`}
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-y-2">
        <Toast data={toast} setData={setToast} txHash={txHash}>
          <Button onClick={submitBid} type="action">
            Place Bid
          </Button>
        </Toast>
      </div>
    </div>
  )
}

export default React.memo(Bid)
