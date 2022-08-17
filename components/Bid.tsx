import React from 'react'
import { XCircleIcon } from '@heroicons/react/solid'
import { ChainId, getContractAddressesForChainOrThrow, NounsAuctionHouseABI } from '@nouns/sdk'
import { utils, BigNumber as EthersBN, BigNumberish } from 'ethers'
import BigNumber from 'bignumber.js'
import { usePrepareContractWrite, useContractWrite, useAccount, useBalance } from 'wagmi'
import Button from 'components/Button'
import Input from 'components/Input'
import Paragraph from 'components/Paragraph'
import Toast from 'components/Toast'

const { nounsAuctionHouseProxy } = getContractAddressesForChainOrThrow(ChainId.Mainnet)

const pctBidAmounts = [5, 10, 15, 20]

type BidProps = {
  minAmount: string
  id: number
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
  const { isConnected, address } = useAccount()
  const changeAmount = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.slice(0, 10))
  }, [])
  const [openToast, setOpenToast] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const minBid = computeMinimumNextBid(new BigNumber(minAmount))
  const { data } = useBalance({
    addressOrName: address,
    formatUnits: 'ether',
    watch: true,
  })

  const triggerToast = (message: string) => {
    setMessage(message)
    setOpenToast(true)
    const timeout = setTimeout(() => {
      setOpenToast(false)
    }, 4000)

    return () => clearTimeout(timeout)
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

  const { write: createBid } = useContractWrite(config)

  const { config: minBidConfig, isError: minError } = usePrepareContractWrite({
    addressOrName: nounsAuctionHouseProxy,
    contractInterface: NounsAuctionHouseABI,
    enabled: isConnected && Boolean(minBid),
    functionName: 'createBid',
    args: [id],
    overrides: {
      value: EthersBN.from(utils.parseEther(minBidEth(minBid))),
    },
  })

  const { write: createMinBid } = useContractWrite(minBidConfig)

  const onClick = (isMinBid: boolean) => () => {
    if (isConnected) {
      if (isMinBid) {
        setAmount(minBidEth(minBid))
        return minError ? triggerToast('Insufficient Balance') : createMinBid?.()
      }

      if (!amount) {
        return triggerToast('Bid amount is empty')
      }

      if (EthersBN.from(utils.parseEther(amount)).lt(EthersBN.from(minAmount))) {
        return triggerToast('Bid amount is below reserve amount')
      }

      return bidError ? triggerToast('Insufficient Balance') : createBid?.()
    } else {
      triggerToast('Wallet not connected')
    }
  }

  return (
    <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
      <div className="flex justify-between">
        <Paragraph>Bid controls</Paragraph>
        {isConnected && (
          <Button type="link" onClick={() => setAmount((+(data?.formatted || 0)).toFixed(3).toString())}>
            Ξ {(+(data?.formatted || 0)).toFixed(2)} available
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
        {pctBidAmounts.map(pct => (
          <Button key={pct} onClick={() => setAmount(increaseBidByPercentage(new BigNumber(minAmount), pct / 100))} type="outline">
            {`+${pct}%`}
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-y-2">
        <Toast message={message} open={openToast} setOpen={setOpenToast}>
          <Button onClick={onClick(false)} type="action">
            Place Bid
          </Button>
        </Toast>
        <Button onClick={onClick(true)} type="action-secondary">
          Min Bid
        </Button>
      </div>
    </div>
  )
}

export default React.memo(Bid)
