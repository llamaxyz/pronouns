type ParagraphProps = {
  children: React.ReactNode
  className?: string
}

const Paragraph = ({ className, children }: ParagraphProps) => {
  return <p className={`${className ? className + ' ' : ''}text-white text-lg xs:text-xl`}>{children}</p>
}

export default Paragraph
