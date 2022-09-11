import BigNumber from 'bignumber.js'
import Skeleton from 'components/Skeleton'
import { Status } from 'utils/types'

type Rarity = 'Common' | 'Medium' | 'Rare'

type ProgressProps = {
  total?: number
  pct?: number
  status?: Status
  rarity: Rarity
}

const rarityToClsName: Record<Rarity, string> = {
  Common: 'bg-white/40',
  Medium: 'bg-ui-sulphur',
  Rare: 'bg-ui-green',
}

const Progress = ({ total = 36, pct, status, rarity }: ProgressProps) => {
  const filled = Number(new BigNumber(pct || 0).div(100).times(new BigNumber(total)).toFixed(0, BigNumber.ROUND_CEIL).toString())
  return (
    <div className="flex gap-x-0.5">
      {[...Array(total)].map((_, i) => (
        <Skeleton
          key={i}
          hasParentElement
          loading={status !== 'success'}
          loadingElement={<div className="animate-pulse h-3 w-0.5 rounded-full bg-white/30" />}
        >
          <div className="h-3 w-0.5 rounded-full bg-white/10">
            <div className={`h-3 rounded-full ${i + 1 <= filled ? rarityToClsName[rarity] : 'bg-transparent'}`} />
          </div>
        </Skeleton>
      ))}
    </div>
  )
}

export default Progress
