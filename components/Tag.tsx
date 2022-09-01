import { AuctionState } from 'utils/types'

type TagProps = {
  children: React.ReactNode
  className?: string
  state: AuctionState
}

const stateToColor: Record<AuctionState, string> = {
  settled: 'text-ui-sulphur bg-ui-sulphur/10',
  live: 'text-ui-malachite-green bg-ui-malachite-green/10',
  unsettled: 'text-ui-sulphur bg-ui-sulphur/10',
}

const Tag = ({ className, children, state }: TagProps) => {
  return (
    <div
      className={`${stateToColor[state]} py-1.5 px-3 tracking-wider text-xs xxs:text-sm rounded-full${className ? ' ' + className : ''}`}
    >
      {children}
    </div>
  )
}

export default Tag
