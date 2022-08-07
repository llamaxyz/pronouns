type SkeletonProps = {
  children: React.ReactNode
  loadingElement: React.ReactNode
  className?: string
  loading: boolean
  hasParentElement?: boolean
}

const Skeleton = ({ className, children, loading, loadingElement, hasParentElement = false }: SkeletonProps) => {
  return hasParentElement ? (
    <div className={`${loading ? 'animate-pulse' : ''}${className ? ' ' + className : ''}`}>{loading ? loadingElement : children}</div>
  ) : (
    <>{loading ? loadingElement : children}</>
  )
}

export default Skeleton
