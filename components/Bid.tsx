import React from 'react'
import { ChainId, getContractAddressesForChainOrThrow, NounsAuctionHouseABI } from '@nouns/sdk'
import { utils, BigNumber as EthersBN } from 'ethers'
import BigNumber from 'bignumber.js'
import { usePrepareContractWrite, useContractWrite, useAccount, useBalance } from 'wagmi'
import Button from 'components/Button'
import Input from 'components/Input'
import Paragraph from 'components/Paragraph'

const { nounsAuctionHouseProxy } = getContractAddressesForChainOrThrow(ChainId.Mainnet)

type BidProps = {
  minAmount: string
  id: number
}

const computeMinimumNextBid = (currentBid: BigNumber): BigNumber => {
  return currentBid.times(new BigNumber(0.02).div(100).plus(1)).decimalPlaces(0, BigNumber.ROUND_UP)
}

const minBidEth = (minBid: BigNumber): string => {
  if (minBid.isZero()) {
    return '0.01'
  }

  const eth = utils.formatEther(EthersBN.from(minBid.toString()))
  return new BigNumber(eth).toFixed(2, BigNumber.ROUND_CEIL)
}

const Bid = ({ minAmount, id }: BidProps) => {
  const [amount, setAmount] = React.useState('0')
  const { isConnected, address } = useAccount()
  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)
  const minBid = computeMinimumNextBid(new BigNumber(minAmount))
  const { data } = useBalance({
    addressOrName: address,
    formatUnits: 'ether',
    watch: true,
  })

  const { config } = usePrepareContractWrite({
    addressOrName: nounsAuctionHouseProxy,
    contractInterface: NounsAuctionHouseABI,
    enabled: isConnected && Boolean(minBid),
    functionName: 'createBid',
    args: [id],
    overrides: {
      value: amount && utils.parseEther(amount),
    },
  })

  const { write: createBid } = useContractWrite(config)

  const { config: minBidConfig } = usePrepareContractWrite({
    addressOrName: nounsAuctionHouseProxy,
    contractInterface: NounsAuctionHouseABI,
    enabled: isConnected && Boolean(minBid),
    functionName: 'createBid',
    args: [id],
    overrides: {
      value: minBidEth(minBid),
    },
  })

  const { write: createMinBid } = useContractWrite(minBidConfig)

  const onClick = (isMinBid: boolean) => () => {
    if (isConnected) {
      isMinBid ? createMinBid?.() : createBid?.()
    }
  }

  return (
    <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
      <div className="flex justify-between">
        <Paragraph>Bid controls</Paragraph>
        {isConnected && <span className="text-white/40">Ξ {(+(data?.formatted || 0)).toFixed(2)} available</span>}
      </div>
      <Input onChange={changeAmount} placeholder={`Ξ ${minBidEth(minBid)} or more`} />
      <div className="flex flex-col gap-y-2">
        <Button onClick={onClick(false)} type="action">
          Place Bid
        </Button>
        <Button onClick={onClick(true)} type="action-secondary">
          Min Bid
        </Button>
      </div>
    </div>
  )
}

export default Bid
