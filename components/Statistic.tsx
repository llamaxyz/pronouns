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
  onClick?: () => void
}

const Statistic = ({ className = '', title, status, contentClass = '', content, titleClass, onClick }: StatisticProps) => {
  return (
    <div onClick={onClick} className={`py-3 px-1 text-center rounded-lg ${className}`}>
      <div>
        <Paragraph className={`opacity-70 font-medium text-sm truncate ${titleClass}`}>{title}</Paragraph>
      </div>
      <Skeleton
        hasParentElement
        loading={status === 'loading'}
        loadingElement={<div className="animate-pulse h-8 w-[75%] mx-auto bg-ui-black/20 rounded tracking-wide" />}
      >
        <div>
          <Title level={4} className={contentClass} weight="medium">
            {content}
          </Title>
        </div>
      </Skeleton>
    </div>
  )
}

export default Statistic
