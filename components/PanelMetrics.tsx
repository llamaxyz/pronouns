import React from 'react'
import { useBalance, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { utils, BigNumber as EthersBN } from 'ethers'
import Metric from 'components/Metric'
import { useAmounts, useOpenseaData, useTraitStats } from 'utils/hooks'
import diamond from 'public/icons/diamond.svg'
import crosshair from 'public/icons/crosshair.svg'
import stars from 'public/icons/stars.svg'
import fraction from 'public/icons/fraction.svg'
import { NounSeed } from 'utils/types'

type PanelMetricsProps = {
  amount?: string
  latestId?: number
  id?: number
  isNounder: boolean
  className?: string
  seed?: NounSeed
}

const metrics = [
  {
    description: 'Book Value',
    bgColor: 'bg-ui-green/5',
    icon: diamond,
    tooltipText: 'Total ETH/stETH in the treasury divided by number of Nouns.',
  },
  { description: '14 day avg.', bgColor: 'bg-ui-blue/5', icon: crosshair, tooltipText: 'Avg. price of the most recent 14 auctions.' },
  {
    description: 'Price vs. Floor',
    bgColor: 'bg-ui-sulphur/5',
    icon: fraction,
    tooltipText: 'Percentage difference between auction price (or current bid) and the secondary floor price.',
  },
  {
    description: 'Head Market Value',
    bgColor: 'bg-ui-purple/5',
    icon: stars,
    tooltipText: 'The median winning bid of auctions with this head.',
  },
]

const calculateBookValue = (latestId?: number, eth?: string, steth?: string) =>
  new BigNumber(eth || 0)
    .plus(new BigNumber(utils.formatEther(EthersBN.from(steth || 0))))
    .dividedBy(new BigNumber(latestId ? latestId - 1 : 1))
    .toFixed(2, BigNumber.ROUND_CEIL)
    .toString()

const stethAbi = ['function balanceOf(address) view returns (uint)']

const idToTrailingValues = (ema: Record<string, string>[], id?: number) => {
  if (id === 0) {
    return '—'
  }
  const trailingValues = ema?.slice(0, 14).map(i => i.amount)
  return trailingValues?.length
    ? trailingValues
        ?.map(value => BigNumber(utils.formatUnits(EthersBN.from(value), 'ether')))
        .reduce<BigNumber>((prev, next) => prev.plus(next), BigNumber(1))
        .dividedBy(trailingValues.length)
        .toFixed(2, BigNumber.ROUND_CEIL)
        .toString()
    : '—'
}

const calcPriceVsFloor = (isNounder: boolean, amount?: string, floor?: number) => {
  if (isNounder || amount === undefined || floor === undefined) return 'N/A'
  const pctChange = new BigNumber(amount)
    .div(new BigNumber(utils.parseEther(`${floor}` || '0').toString()))
    .decimalPlaces(4, BigNumber.ROUND_UP)
  const formattedPct = pctChange.isEqualTo(1)
    ? '0.00%'
    : pctChange.isGreaterThan(1)
    ? `+${pctChange.minus(1).times(100).toFixed(2, BigNumber.ROUND_CEIL).toString()}%`
    : `-${new BigNumber(1).minus(pctChange).times(100).toFixed(2, BigNumber.ROUND_CEIL).toString()}%`
  return formattedPct
}

const PanelMetrics = ({ amount, latestId, id, isNounder, className = '', seed }: PanelMetricsProps) => {
  const [loading, setLoading] = React.useState(true)
  const { data: ema, status: emaStatus } = useAmounts()
  const { data: osData, status: osDataStatus } = useOpenseaData()
  const [bookValue, setBookValue] = React.useState('0')
  const { data: seedData, status: seedStatus } = useTraitStats(seed as unknown as Record<string, string>, id)

  const { data: ethBalanceData } = useBalance({
    addressOrName: '0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71',
    formatUnits: 'ether',
    watch: true,
  })

  const { data: stethBalanceData } = useContractRead({
    addressOrName: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    contractInterface: stethAbi,
    functionName: 'balanceOf',
    args: '0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71',
  })

  React.useEffect(() => {
    setLoading(true)
    setBookValue(calculateBookValue(latestId, ethBalanceData?.formatted, stethBalanceData?.toString()))
    if (latestId !== undefined) {
      setLoading(false)
    }
  }, [latestId, ethBalanceData, stethBalanceData])

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="col-span-full xxs:col-auto">
        <Metric
          border
          bgColor={metrics[0].bgColor}
          stat={`Ξ ${bookValue}`}
          status={loading ? 'loading' : 'success'}
          description={metrics[0].description}
          icon={metrics[0].icon}
          tooltipText={metrics[0].tooltipText}
        />
      </div>
      <div className="col-span-full xxs:col-auto">
        <Metric
          border
          bgColor={metrics[1].bgColor}
          stat={`Ξ ${idToTrailingValues(ema, id)}`}
          status={emaStatus}
          description={metrics[1].description}
          icon={metrics[1].icon}
          tooltipText={metrics[1].tooltipText}
        />
      </div>
      <div className="col-span-full xxs:col-auto">
        <Metric
          border
          statClass="tabular-nums"
          bgColor={metrics[2].bgColor}
          stat={calcPriceVsFloor(isNounder, amount, osData?.stats?.floor_price)}
          status={osDataStatus}
          description={metrics[2].description}
          icon={metrics[2].icon}
          tooltipText={metrics[2].tooltipText}
        />
      </div>
      <div className="col-span-full xxs:col-auto">
        <Metric
          border
          statClass="tabular-nums"
          bgColor={metrics[3].bgColor}
          stat={
            seedData?.body?.head?.median_mint_price ? (
              `Ξ ${new BigNumber(seedData?.body?.head?.median_mint_price).toFixed(2, BigNumber.ROUND_CEIL).toString()}`
            ) : seedData?.body?.head?.total_occurrence === 1 ? (
              <span className="text-ui-green">First Mint</span>
            ) : (
              <span className="text-ui-green">Only Nounders</span>
            )
          }
          status={seedStatus}
          description={metrics[3].description}
          icon={metrics[3].icon}
          tooltipText={metrics[3].tooltipText}
        />
      </div>
    </div>
  )
}

export default React.memo(PanelMetrics)
