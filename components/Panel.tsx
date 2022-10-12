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
  <div className="flex min-h-[26rem] lg:h-[calc(100vh_-_143px)]">
    <div className="w-full lg:overflow-y-auto">
      <div className="flex flex-col gap-4">
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-4 bg-ui-black py-4 shadow-lg lg:static lg:py-0 xs:flex-nowrap">
          <div className="ml-0.5 flex gap-2">
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
            className="whitespace-nowrap px-1"
            hasParentElement
            loading={status === 'loading'}
            loadingElement={
              <>
                <div className="col-span-2 mb-1 h-5 w-[124px] animate-pulse rounded bg-white/20" />
                <div className="col-span-2 h-8 animate-pulse rounded bg-white/20" />
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
              <div className="mt-auto h-8 w-[108px] animate-pulse animate-pulse overflow-hidden rounded-full bg-white/20 py-1.5 px-3 text-xs tracking-wider text-white/20 xxs:text-sm">
                {'           '}
              </div>
            }
          >
            {auctionState === 'settled' ? (
              <div className="overflow-x-auto xs:border-l xs:border-white/10 xs:pl-4">
                <Paragraph className="text-ui-silver">Held By</Paragraph>
                <Title weight="bold" level={4}>
                  <Account address={ownerAddress} />
                </Title>
              </div>
            ) : (
              <Tag state={auctionState} className="mt-auto hidden truncate xxxs:block">
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
        <div className="flex flex-col gap-y-4 rounded-xl border border-white/10 p-4">
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
