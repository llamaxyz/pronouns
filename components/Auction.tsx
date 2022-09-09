import React from 'react'
import BigNumber from 'bignumber.js'
import { utils, BigNumber as EthersBN } from 'ethers'
import { Address } from 'components/Address'
import Account from 'components/Account'
import Statistic from 'components/Statistic'
import { getBidCount } from 'utils/index'
import { NOUNDERS_ENS } from 'utils/constants'
import { AuctionState, Status, Bid, Bidder } from 'utils/types'

type Noun = {
  amount: string
  endTime: string
  bidder: Bidder
  settled: boolean
  bids: Bid[]
}

type AuctionProps = {
  id?: number | undefined
  latestId?: number
  auctionState: AuctionState
  percentChange: string
  timeRemaining: number
  isNounder: boolean
  isPercentChangeLoading: boolean
  status: Status
  noun: Noun
}

const Auction = ({
  status,
  id,
  latestId,
  auctionState,
  percentChange,
  timeRemaining,
  isNounder,
  isPercentChangeLoading,
  noun,
}: AuctionProps) => {
  const isAuctionLive = id === latestId && auctionState === 'live'
  const renderTopBid = () =>
    isNounder
      ? 'N/A'
      : `Ξ ${new BigNumber(utils.formatEther(EthersBN.from((noun?.amount || 0).toString()))).toFixed(2, BigNumber.ROUND_CEIL)}`
  const renderAuctionStatus = () => {
    if (id === latestId && !isNounder && Date.now() < Number(noun?.endTime) * 1000) {
      const hours = Math.floor(((Number(noun?.endTime) * 1000 - timeRemaining) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor(((Number(noun?.endTime) * 1000 - timeRemaining) % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor(((Number(noun?.endTime) * 1000 - timeRemaining) % (1000 * 60)) / 1000)
      return (
        <>
          {hours < 10 ? `0${hours}` : hours}
          <span className="px-0.5 opacity-60 relative bottom-0.5">:</span>
          {minutes < 10 ? `0${minutes}` : minutes}
          <span className="px-0.5 opacity-60 relative bottom-0.5">:</span>
          {seconds < 10 ? `0${seconds}` : seconds}
        </>
      )
    }

    return <Account address={isNounder ? NOUNDERS_ENS : noun?.bidder?.id} isEns={isNounder} />
  }
  return (
    <div
      className={`border border-white/10 rounded-xl min-h-[26rem] lg:h-[calc(100vh_-_139.5px)] p-4 flex flex-col ${
        isNounder ? '' : 'gap-y-4'
      }`}
    >
      <div className="grid grid-cols-2 gap-2 sticky">
        <Statistic
          status={status}
          titleClass="text-ui-black"
          contentClass="text-ui-black tabular-nums animate-fade-in-1 opacity-0 ease-in-out truncate"
          className={`${isAuctionLive ? 'bg-ui-sulphur' : 'bg-ui-green'} w-full ${id === latestId ? 'col-span-1' : 'col-span-full'}`}
          title={isAuctionLive ? 'Time Left' : 'Winner'}
          content={renderAuctionStatus()}
        />
        <Statistic
          status={status}
          contentClass="animate-fade-in-2 opacity-0 ease-in-out"
          className="bg-ui-space col-span-1 w-full"
          title={isAuctionLive ? 'Top Bid' : 'Winning Bid'}
          content={<span className="tabular-nums">{renderTopBid()}</span>}
        />
        {id !== latestId && (
          <Statistic
            status={isPercentChangeLoading ? 'loading' : status}
            className="bg-ui-space col-span-1 w-full"
            title="% Change"
            content={
              isNounder ? (
                'N/A'
              ) : (
                <div
                  className={`tabular-nums ${
                    percentChange[0] === '0' || id === 1 ? 'text-white' : percentChange[0] === '-' ? 'text-red-400' : 'text-ui-green'
                  }`}
                >
                  {percentChange === '-NaN%' ? 'N/A' : percentChange}
                </div>
              )
            }
          />
        )}
      </div>
      <div className="overflow-scroll">
        {!noun?.settled && !isNounder && status === 'success' && (
          <Address.Header bidCount={getBidCount(noun?.bids, noun?.bidder?.id)} address={noun?.bidder?.id} txHash={noun?.bids?.[0]?.id} />
        )}
        {!isNounder && <Address.List items={noun?.bids} />}
      </div>
    </div>
  )
}

export default Auction
