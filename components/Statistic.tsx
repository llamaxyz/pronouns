import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import Title from 'components/Title'
import { Status } from 'utils/types'

type StatisticProps = {
  className?: string
  titleClass?: string
  contentClass?: string
  title: string
  status: Status
  content: string | React.ReactNode
}

const Statistic = ({ className = '', title, status, contentClass = '', content, titleClass }: StatisticProps) => {
  return (
    <div className={`py-2 px-1 text-center rounded-lg ${className}`}>
      <div>
        <Paragraph className={`opacity-60 font-medium text-sm ${titleClass}`}>{title}</Paragraph>
      </div>
      <Skeleton
        hasParentElement
        loading={status === 'loading'}
        loadingElement={<div className="h-8 bg-ui-black/20 rounded tracking-wide" />}
      >
        <div>
          <Title level={6} className={`tracking-wide ${contentClass}`}>
            {content}
          </Title>
        </div>
      </Skeleton>
    </div>
  )
}

export default Statistic
