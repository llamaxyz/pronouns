import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import Title from 'components/Title'
import { Status } from 'utils/types'

type MetricProps = {
  className?: string
  titleClass?: string
  contentClass?: string
  title: string
  status: Status
  content: string | React.ReactNode
}

const Metric = ({ className = '', title, status, contentClass = '', content, titleClass }: MetricProps) => {
  return (
    <div className={`p-4 text-center rounded-lg border border-white/10`}>
      <Skeleton
        hasParentElement
        loading={status === 'loading'}
        loadingElement={<div className="h-8 w-[75%] mx-auto bg-ui-black/20 rounded tracking-wide" />}
      >
        <div className="flex gap-x-4 items-center">
          <div className="rounded-lg bg-white/10 p-2.5">
            {' '}
            <img className={`h-6 w-6`} src={`https://cdn.stamp.fyi/avatar/nounders.eth`} />
          </div>
          <Title level={4} className={contentClass} weight="medium">
            {content}
          </Title>
        </div>
      </Skeleton>
    </div>
  )
}

export default Metric
