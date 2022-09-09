import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import Account from 'components/Account'
import Button from 'components/Button'
import Metric from 'components/Metric'
import Noun from 'components/Noun'
import Paragraph from 'components/Paragraph'
import Tag from 'components/Tag'
import Title from 'components/Title'
import Skeleton from 'components/Skeleton'
import diamond from 'public/icons/diamond.svg'
import crosshair from 'public/icons/crosshair.svg'
import stars from 'public/icons/stars.svg'
import fraction from 'public/icons/fraction.svg'
import { AuctionState, Status, NounSeed } from 'utils/types'
import { NOUNDERS_ENS } from 'utils/constants'
import { formatDate } from 'utils/index'

const metrics = [
  { stat: 'Ξ 69.69', description: 'Book Value', bgColor: 'bg-ui-green/5', icon: diamond },
  { stat: 'Ξ 89.83', description: '14 Day EMA', bgColor: 'bg-ui-blue/5', icon: crosshair },
  { stat: '12', description: 'Weight', bgColor: 'bg-ui-purple/5', icon: stars },
  { stat: '-25.56%', description: 'Bid vs. Floor', bgColor: 'bg-ui-sulphur/5', icon: fraction },
]

type PanelProps = {
  seed?: NounSeed
  id?: number
  status: Status
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
  latestId?: number
  startTime: number
  auctionState: AuctionState
  ownerAddress: string
  isNounder: boolean
}

const auctionStateToTag: Record<AuctionState, string> = {
  settled: 'Settled',
  live: 'Auction Live',
  unsettled: 'Pending',
}

const Panel = ({ status, id, setId, latestId, startTime, auctionState, ownerAddress, seed, isNounder }: PanelProps) => (
  <>
    <div className="flex items-center xs:flex-nowrap flex-wrap gap-4 overflow-hidden">
      <div className="flex gap-2">
        <Button
          ariaLabel="Previous Noun"
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
            <div className="h-5 w-[124px] mb-1 bg-white/20 rounded col-span-2" />
            <div className="h-8 bg-white/20 rounded col-span-2" />
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
          <div className="w-[108px] overflow-hidden animate-pulse mt-auto h-8 text-white/20 bg-white/20 py-1.5 px-3 tracking-wider text-xs xxs:text-sm rounded-full">
            {'           '}
          </div>
        }
      >
        {auctionState === 'settled' ? (
          <div className="xs:border-l xs:pl-4 xs:border-white/10">
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
    <Noun id={id} status={status} seed={seed} />
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, id) => (
        <div key={id} className="xxs:col-auto col-span-full">
          <Metric bgColor={metric.bgColor} stat={metric.stat} status="success" description={metric.description} icon={metric.icon} />
        </div>
      ))}
    </div>
    <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
      <Title level={5} weight="normal">
        Current Rarity
      </Title>
    </div>
  </>
)

export default Panel
