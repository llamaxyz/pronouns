import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import Account from 'components/Account'
import Button from 'components/Button'
import Noun from 'components/Noun'
import Paragraph from 'components/Paragraph'
import Tag from 'components/Tag'
import Title from 'components/Title'
import Skeleton from 'components/Skeleton'
import { AuctionState, Status, NounSeed } from 'utils/types'
import { formatDate } from 'utils/index'

type PanelProps = {
  seed?: NounSeed
  id?: number
  status: Status
  setId: React.Dispatch<React.SetStateAction<number | undefined>>
  latestId?: number
  startTime: number
  auctionState: AuctionState
  ownerAddress: string
}

const auctionStateToTag: Record<AuctionState, string> = {
  settled: 'Settled',
  live: 'Auction Live',
  unsettled: 'Pending',
}

const Panel = ({ status, id, setId, latestId, startTime, auctionState, ownerAddress, seed }: PanelProps) => (
  <>
    <div className="flex items-center xs:flex-nowrap flex-wrap gap-4 overflow-hidden">
      <div className="flex gap-2">
        <Button
          ariaLabel="Previous Noun"
          isBold
          onClick={() => id !== undefined && setId(id => (id !== undefined ? id - 1 : undefined))}
          disabled={id === 0}
          type="secondary"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>
        <Button
          ariaLabel="Next Noun"
          isBold
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
              <Account address={ownerAddress} />
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
    <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
      <Title level={5}>Current Rarity</Title>
    </div>
  </>
)

export default Panel
