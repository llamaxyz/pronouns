import Image from 'next/image'
import { InformationCircleIcon } from '@heroicons/react/solid'
import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import Title from 'components/Title'
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
}

const Metric = ({ bgColor = '', description, status, statClass = '', stat, icon }: MetricProps) => {
  return (
    <div className="p-4 text-center rounded-lg border border-white/10">
      <Skeleton
        hasParentElement
        loading={status === 'loading'}
        loadingElement={<div className="animate-pulse h-8 w-[75%] mx-auto bg-ui-black/20 rounded tracking-wide" />}
      >
        <div className="flex gap-x-4 items-center">
          <div className={`rounded-lg p-2.5 flex items-center ${bgColor}`}>
            <Image alt="diamond" src={icon} />
          </div>
          <div className="flex flex-col items-start">
            <Title level={5} className={statClass} weight="medium">
              {stat}
            </Title>
            <Paragraph className="text-ui-silver">
              {description}{' '}
              <InformationCircleIcon className="h-4 w-4 inline hover:text-white/50 transition ease-in-out hover:cursor-pointer" />
            </Paragraph>
          </div>
        </div>
      </Skeleton>
    </div>
  )
}

export default Metric
