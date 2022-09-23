import Image from 'next/image'
import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import Title from 'components/Title'
import Tooltip from 'components/Tooltip'
import { Status } from 'utils/types'

type StaticImageData = {
  src: string
  height: number
  width: number
  placeholder?: string
}

type MetricProps = {
  bgColor: string
  icon: StaticImageData
  statClass?: string
  description: string
  status: Status
  stat: string | React.ReactNode
  tooltipText?: string
  border?: boolean
}

const Metric = ({ bgColor = '', description, tooltipText, status, statClass = '', stat, icon, border = false }: MetricProps) => {
  return (
    <div className={`text-center rounded-lg ${border ? 'border border-white/10 p-4' : 'py-4 pt-4 pb-0'}`}>
      <Skeleton
        hasParentElement
        loading={status !== 'success'}
        loadingElement={
          <div className="flex gap-x-4 items-center">
            <div className={`rounded-lg p-2.5 flex items-center ${bgColor}`}>
              <Image alt="icon" src={icon} />
            </div>
            <div className="flex flex-col items-start">
              <div className="animate-pulse h-7 w-full bg-white/20 rounded tracking-wide" />
              <Paragraph className="text-ui-silver">{description}</Paragraph>
            </div>
          </div>
        }
      >
        <div className="flex gap-x-4 items-center">
          <div className={`rounded-lg p-2.5 flex items-center ${bgColor}`}>
            <Image alt="diamond" src={icon} />
          </div>
          <div className="flex flex-col items-start">
            <Title level={5} className={statClass} weight="medium">
              {stat}
            </Title>
            <Paragraph className="text-ui-silver text-sm sm:text-base lg:text-sm xl:text-base">
              {description} {tooltipText && <Tooltip text={tooltipText} />}
            </Paragraph>
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default Metric
