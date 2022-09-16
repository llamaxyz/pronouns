import React from 'react'
import { useBalance, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { utils, BigNumber as EthersBN } from 'ethers'
import Metric from 'components/Metric'
import { useAmounts } from 'utils/hooks'
import diamond from 'public/icons/diamond.svg'
import crosshair from 'public/icons/crosshair.svg'
import stars from 'public/icons/stars.svg'
import fraction from 'public/icons/fraction.svg'

const metrics = [
  { description: 'Book Value', bgColor: 'bg-ui-green/5', icon: diamond },
  { description: '14 Day Avg.', bgColor: 'bg-ui-blue/5', icon: crosshair },
  { description: 'Weight', bgColor: 'bg-ui-purple/5', icon: stars },
  { description: 'Bid vs. Floor', bgColor: 'bg-ui-sulphur/5', icon: fraction },
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

const PanelMetrics = ({ latestId, id }: { latestId?: number; id?: number }) => {
  const [loading, setLoading] = React.useState(true)
  const { data: ema, status: emaStatus } = useAmounts()
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
    </div>
  )
}

export default React.memo(PanelMetrics)
