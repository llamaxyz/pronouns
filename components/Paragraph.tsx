type ParagraphProps = {
  children: React.ReactNode
  className?: string
  isLarge?: boolean
}

const Paragraph = ({ className, children, isLarge = false }: ParagraphProps) => {
  return <p className={`text-white tracking-wide ${isLarge ? 'text-lg' : 'text-base'} ${className ? ' ' + className : ''}`}>{children}</p>
}

export default Paragraph
