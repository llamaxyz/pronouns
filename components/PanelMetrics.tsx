import React from 'react'
import { useBalance, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { utils, BigNumber as EthersBN } from 'ethers'
import Metric from 'components/Metric'
import diamond from 'public/icons/diamond.svg'
import crosshair from 'public/icons/crosshair.svg'
import stars from 'public/icons/stars.svg'
import fraction from 'public/icons/fraction.svg'

const metrics = [{ description: 'Book Value', bgColor: 'bg-ui-green/5', icon: diamond }]

const calculateBookValue = (latestId?: number, eth?: string, steth?: string) =>
  new BigNumber(eth || 0)
    .plus(new BigNumber(utils.formatEther(EthersBN.from(steth || 0))))
    .dividedBy(new BigNumber(latestId || 1))
    .toFixed(2, BigNumber.ROUND_CEIL)
    .toString()

const stethAbi = ['function balanceOf(address) view returns (uint)']

const PanelMetrics = ({ latestId }: { latestId?: number }) => {
  const [loading, setLoading] = React.useState(true)
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
      {metrics.map((metric, id) => (
        <div key={id} className="xxs:col-auto col-span-full">
          <Metric
            bgColor={metric.bgColor}
            stat={`Ξ ${bookValue}`}
            status={loading ? 'loading' : 'success'}
            description={metric.description}
            icon={metric.icon}
          />
        </div>
      ))}
    </div>
  )
}

export default React.memo(PanelMetrics)
