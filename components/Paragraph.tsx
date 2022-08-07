type ParagraphProps = {
  children: React.ReactNode
  className?: string
}

const Paragraph = ({ className, children }: ParagraphProps) => {
  return <p className={`text-white tracking-wide text-base${className ? ' ' + className : ''}`}>{children}</p>
}

export default Paragraph
