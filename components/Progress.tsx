import BigNumber from 'bignumber.js'
import Skeleton from 'components/Skeleton'
import { Status, Rarity } from 'utils/types'

type ProgressProps = {
  total?: number
  pct?: number
  status?: Status
  rarity: Rarity
}

const rarityToClsName: Record<Rarity, string> = {
  'Very Common': 'bg-white/20',
  Common: 'bg-white/40',
  Medium: 'bg-ui-sulphur',
  Rare: 'bg-ui-darkerGreen',
  'Very Rare': 'bg-ui-darkGreen',
  Limited: 'bg-ui-green',
  'Very Limited': 'bg-ui-lightGreen',
  'Only Mint': 'bg-ui-lighterGreen',
}

const rarityToClsNameTxt = {
  'Very Common': 'text-white/50',
  Common: 'text-white/70',
  Medium: 'text-ui-sulphur',
  Rare: 'text-ui-darkerGreen',
  'Very Rare': 'text-ui-darkGreen',
  Limited: 'text-ui-green',
  'Very Limited': 'text-ui-lightGreen',
  'Only Mint': 'text-ui-lighterGreen',
}

const Progress = ({ total = 36, pct, status, rarity }: ProgressProps) => {
  const filled =
    rarity === 'Only Mint'
      ? 1
      : rarity === 'Very Limited'
      ? 2
      : rarity === 'Limited'
      ? 3
      : Number(new BigNumber(pct || 0).times(new BigNumber(total)).toFixed(0, BigNumber.ROUND_CEIL).toString())
  return (
    <>
      <Skeleton
        loading={status !== 'success'}
        loadingElement={<div className="animate-pulse h-3 bg-white/20 rounded tracking-wider text-xs mb-2.5" />}
      >
        <div className={`${rarityToClsNameTxt[rarity]} tracking-wider text-xs mb-1.5`}>{rarity}</div>
      </Skeleton>
      <div className="flex gap-x-0.5">
        {[...Array(total)].map((_, i) => (
          <Skeleton
            key={i}
            loading={status !== 'success'}
            loadingElement={
              <div className="animate-pulse h-3 w-0.5 rounded-full bg-white/30">
                <div className="h-3 rounded-full bg-transparent" />
              </div>
            }
          >
            <div className="h-3 w-0.5 rounded-full bg-white/10">
              <div className={`h-3 rounded-full ${i + 1 <= filled ? rarityToClsName[rarity] : 'bg-transparent'}`} />
            </div>
          </Skeleton>
        ))}
      </div>
    </>
  )
}

export default Progress
