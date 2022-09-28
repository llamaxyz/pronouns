import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import Auction from 'components/Auction'
import Account from 'components/Account'
import Button from 'components/Button'
import Noun from 'components/Noun'
import PanelMetrics from 'components/PanelMetrics'
import Paragraph from 'components/Paragraph'
import Table from 'components/Table'
import Tag from 'components/Tag'
import Title from 'components/Title'
import Skeleton from 'components/Skeleton'
import { AuctionState, Status, NounType } from 'utils/types'
import { NOUNDERS_ENS } from 'utils/constants'
import { formatDate } from 'utils/index'

type PanelProps = {
  noun: NounType
  id?: number
  status: Status
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
  latestId?: number
  startTime: number
  auctionState: AuctionState
  ownerAddress: string
  isNounder: boolean
  time: number
  pct: string
  pctLoading: boolean
}

const auctionStateToTag: Record<AuctionState, string> = {
  settled: 'Settled',
  live: 'Auction Live',
  unsettled: 'Pending',
}

const Panel = ({
  status,
  id,
  setId,
  latestId,
  startTime,
  auctionState,
  ownerAddress,
  noun,
  isNounder,
  pctLoading,
  pct,
  time,
}: PanelProps) => (
  <div className="lg:h-[calc(100vh_-_143px)] min-h-[26rem] flex">
    <div className="lg:overflow-y-auto w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center xs:flex-nowrap flex-wrap gap-4 lg:static sticky top-0 z-20 bg-ui-black py-4 lg:py-0 shadow-lg">
          <div className="flex gap-2 ml-0.5">
            <Button
              ariaLabel="Previous Noun"
              className=""
              weight="bold"
              onClick={() => id !== undefined && setId(id => (id !== undefined ? id - 1 : undefined))}
              disabled={id === 0}
              type="secondary"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button
              ariaLabel="Next Noun"
              weight="bold"
              onClick={() => id !== undefined && setId(id => (id !== undefined ? id + 1 : undefined))}
              disabled={id === latestId}
              type="secondary"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>
          <Skeleton
            className="px-1 whitespace-nowrap"
            hasParentElement
            loading={status === 'loading'}
            loadingElement={
              <>
                <div className="animate-pulse h-5 w-[124px] mb-1 bg-white/20 rounded col-span-2" />
                <div className="animate-pulse h-8 bg-white/20 rounded col-span-2" />
              </>
            }
          >
            <Paragraph className="text-ui-silver">{formatDate(startTime * 1000)}</Paragraph>
            <Title weight="bold" level={4}>
              Noun {id}
            </Title>
          </Skeleton>
          <Skeleton
            loading={status === 'loading'}
            loadingElement={
              <div className="animate-pulse w-[108px] overflow-hidden animate-pulse mt-auto h-8 text-white/20 bg-white/20 py-1.5 px-3 tracking-wider text-xs xxs:text-sm rounded-full">
                {'           '}
              </div>
            }
          >
            {auctionState === 'settled' ? (
              <div className="xs:border-l xs:pl-4 xs:border-white/10 overflow-x-auto">
                <Paragraph className="text-ui-silver">Held By</Paragraph>
                <Title weight="bold" level={4}>
                  <Account address={isNounder ? NOUNDERS_ENS : ownerAddress} isEns={isNounder} />
                </Title>
              </div>
            ) : (
              <Tag state={auctionState} className="mt-auto hidden xxxs:block truncate">
                {auctionStateToTag[auctionState]}
              </Tag>
            )}
          </Skeleton>
        </div>
        <Noun id={id} status={status} seed={noun?.noun?.seed} />
        <Auction
          className="lg:hidden"
          noun={noun}
          status={status}
          auctionState={auctionState}
          isPercentChangeLoading={pctLoading}
          isNounder={isNounder}
          percentChange={pct}
          timeRemaining={time}
          id={id}
          latestId={latestId}
        />
        <PanelMetrics seed={noun?.noun?.seed} amount={noun?.amount} id={id} latestId={latestId} isNounder={isNounder} />
        <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
          <Title level={5} weight="normal">
            Current Rarity
          </Title>
          <div className="overflow-x-auto">
            <Table id={id} seed={noun?.noun?.seed} status={status} latestId={latestId} />
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Panel
