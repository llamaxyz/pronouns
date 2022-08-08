type TagProps = {
  children: React.ReactNode
  className?: string
}

const Tag = ({ className, children }: TagProps) => {
  return (
    <div
      className={`text-malachite-green bg-malachite-green/10 py-1.5 px-3 tracking-wider text-xs xxs:text-sm rounded-full${
        className ? ' ' + className : ''
      }`}
    >
      {children}
    </div>
  )
}

export default Tag
