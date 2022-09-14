import React from 'react'
import { useBalance, useContractRead } from 'wagmi'
import BigNumber from 'bignumber.js'
import { utils, BigNumber as EthersBN } from 'ethers'
import Metric from 'components/Metric'
import diamond from 'public/icons/diamond.svg'
import crosshair from 'public/icons/crosshair.svg'
import stars from 'public/icons/stars.svg'
import fraction from 'public/icons/fraction.svg'

const metrics = [
  { stat: 'Ξ 69.69', description: 'Book Value', bgColor: 'bg-ui-green/5', icon: diamond },
  { stat: 'Ξ 89.83', description: '14 Day EMA', bgColor: 'bg-ui-blue/5', icon: crosshair },
  { stat: '12', description: 'Weight', bgColor: 'bg-ui-purple/5', icon: stars },
  { stat: '-25.56%', description: 'Bid vs. Floor', bgColor: 'bg-ui-sulphur/5', icon: fraction },
]
const stethAbi = ['function balanceOf(address) view returns (uint)']

const PanelMetrics = ({ latestId }: { latestId?: number }) => {
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

  const bookValue = new BigNumber(ethBalanceData?.formatted || 0)
    .plus(new BigNumber(utils.formatEther(EthersBN.from(stethBalanceData || 0))))
    .dividedBy(new BigNumber(latestId || 1))
    .toFixed(2, BigNumber.ROUND_CEIL)
    .toString()

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, id) => (
        <div key={id} className="xxs:col-auto col-span-full">
          <Metric bgColor={metric.bgColor} stat={metric.stat} status="success" description={metric.description} icon={metric.icon} />
        </div>
      ))}
    </div>
  )
}

export default React.memo(PanelMetrics)
