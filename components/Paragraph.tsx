type ParagraphProps = {
  children: React.ReactNode
  className?: string
}

const Paragraph = ({ className, children }: ParagraphProps) => {
  return <p className={`${className ? className + ' ' : ''}text-white text-base sm:text-lg md:text-xl`}>{children}</p>
}

export default Paragraph
