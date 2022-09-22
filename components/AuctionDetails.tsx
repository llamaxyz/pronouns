import React from 'react'
import Button from 'components/Button'
import Metric from 'components/Metric'
import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import { formatDate } from 'utils/index'
import { AuctionState, Status } from 'utils/types'
import crosshair from 'public/icons/crosshair.svg'

type AuctionDetailsProps = {
  status: Status
  isNounder: boolean
  auctionState: AuctionState
  startTime: number
  bids?: number
}

const AuctionDetails = ({ status, isNounder, auctionState, startTime, bids }: AuctionDetailsProps) => (
  <Skeleton
    hasParentElement
    loading={status === 'loading'}
    loadingElement={
      <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-2">
        <div className="animate-pulse h-5 mb-1 bg-white/20 rounded col-span-2" />
        <div className="animate-pulse h-8 bg-white/20 rounded col-span-2" />
        <div className="animate-pulse h-8 bg-white/20 rounded col-span-2" />
      </div>
    }
  >
    <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
      <Paragraph isLarge>
        {isNounder
          ? 'All Noun auction proceeds are sent to the Nouns DAO. For this reason, the projectʼs founders (‘Nounders’) have chosen to compensate themselves with Nouns. Every 10th Noun for the first 5 years of the project will be sent to their multisig (5/10), where it will be vested and distributed to individual Nounders.'
          : `This auction ended ${formatDate(startTime * 1000, true)}`}
      </Paragraph>
      {auctionState === 'unsettled' && (
        <Button
          href="https://fomonouns.wtf/"
          className="w-full text-ui-black bg-ui-sulphur hover:bg-ui-sulphur/90 text-center"
          type="action-secondary"
        >
          Vote on the next Noun
        </Button>
      )}
      {auctionState === 'settled' && !isNounder && (
        <div className="border-t border-white/10">
          <Metric statClass="tabular-nums" bgColor="transparent" stat={bids} status={status} description="Total Bids" icon={crosshair} />
        </div>
      )}
    </div>
  </Skeleton>
)

export default AuctionDetails
