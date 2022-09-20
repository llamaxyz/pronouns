import React from 'react'
import { useBalance, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { utils, BigNumber as EthersBN } from 'ethers'
import Metric from 'components/Metric'
import { useAmounts, useOpenseaData } from 'utils/hooks'
import diamond from 'public/icons/diamond.svg'
import crosshair from 'public/icons/crosshair.svg'
import stars from 'public/icons/stars.svg'
import fraction from 'public/icons/fraction.svg'

type PanelMetricsProps = {
  amount?: string
  latestId?: number
  id?: number
  isNounder: boolean
}

const metrics = [
  { description: 'Book Value', bgColor: 'bg-ui-green/5', icon: diamond },
  { description: 'Trailing Avg.', bgColor: 'bg-ui-blue/5', icon: crosshair },
  { description: 'Price vs. Floor', bgColor: 'bg-ui-sulphur/5', icon: fraction },
  { description: 'Weight', bgColor: 'bg-ui-purple/5', icon: stars },
]

const calculateBookValue = (latestId?: number, eth?: string, steth?: string) =>
  new BigNumber(eth || 0)
    .plus(new BigNumber(utils.formatEther(EthersBN.from(steth || 0))))
    .dividedBy(new BigNumber(latestId || 1))
    .toFixed(2, BigNumber.ROUND_CEIL)
    .toString()

const stethAbi = ['function balanceOf(address) view returns (uint)']

const idToTrailingValues = (ema: Record<string, string>[], id?: number) => {
  if (id === 0) {
    return '—'
  }
  const startIndex = ema?.findIndex(amount => {
    const startId = `${id !== undefined ? ((id - 1) % 10 === 0 ? id : id - 1) : 0}`
    return amount.id === startId
  })
  const trailingValues = ema?.slice(startIndex, startIndex + 14).map(i => i.amount)
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
  // setPctLoading(true)

  // if (id !== latestId && !isNounder) {
  //   // Winning bid of auction of current id
  //   const winningBid = new BigNumber(amount)

  //   // Ignore nounder nouns and get previous id winning bid
  //   const subtrahend = Boolean(id && (id - 1) % 10 === 0) ? 2 : 1
  //   const prevId = id && id - subtrahend
  //   const prevWinningBid = await queryClient.fetchQuery(['nounDetails', prevId, isNounder], () => getNoun(prevId))

  // }

  if (isNounder || amount === undefined || floor === undefined) return 'N/A'
  const pctChange = new BigNumber(amount)
    .div(new BigNumber(utils.parseEther(`${floor}` || '0').toString()))
    .decimalPlaces(4, BigNumber.ROUND_UP)
  const formattedPct = pctChange.isEqualTo(1)
    ? '0.00%'
    : pctChange.isGreaterThan(1)
    ? `+ ${pctChange.minus(1).times(100).toFixed(2, BigNumber.ROUND_CEIL).toString()}%`
    : `- ${new BigNumber(1).minus(pctChange).times(100).toFixed(2, BigNumber.ROUND_CEIL).toString()}%`
  return formattedPct
}

const PanelMetrics = ({ amount, latestId, id, isNounder }: PanelMetricsProps) => {
  const [loading, setLoading] = React.useState(true)
  const { data: ema, status: emaStatus } = useAmounts()
  const { data: osData, status: osDataStatus } = useOpenseaData()
  const [bookValue, setBookValue] = React.useState('0')

  const { data: ethBalanceData } = useBalance({
    addressOrName: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
    formatUnits: 'ether',
    watch: true,
  })

  const { data: stethBalanceData } = useContractRead({
    addressOrName: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    contractInterface: stethAbi,
    functionName: 'balanceOf',
    args: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
  })

  React.useEffect(() => {
    setLoading(true)
    setBookValue(calculateBookValue(latestId, ethBalanceData?.formatted, stethBalanceData?.toString()))
    if (latestId !== undefined) {
      setLoading(false)
    }
  }, [latestId, ethBalanceData, stethBalanceData])

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="xxs:col-auto col-span-full">
        <Metric
          bgColor={metrics[0].bgColor}
          stat={`Ξ ${bookValue}`}
          status={loading ? 'loading' : 'success'}
          description={metrics[0].description}
          icon={metrics[0].icon}
        />
      </div>
      <div className="xxs:col-auto col-span-full">
        <Metric
          bgColor={metrics[1].bgColor}
          stat={`Ξ ${idToTrailingValues(ema, id)}`}
          status={emaStatus}
          description={metrics[1].description}
          icon={metrics[1].icon}
        />
      </div>
      <div className="xxs:col-auto col-span-full">
        <Metric
          statClass="tabular-nums"
          bgColor={metrics[2].bgColor}
          stat={calcPriceVsFloor(isNounder, amount, osData?.stats?.floor_price)}
          status={osDataStatus}
          description={metrics[2].description}
          icon={metrics[2].icon}
        />
      </div>
    </div>
  )
}

export default React.memo(PanelMetrics)
