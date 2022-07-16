type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

const textSize = ['text-7xl', 'text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg']

const xsTextSize = ['xs:text-7xl', 'xs:text-6xl', 'xs:text-5xl', 'xs:text-4xl', 'xs:text-3xl', 'xs:text-2xl', 'xs:text-xl', 'xs:text-lg']

const Title = ({ level = 3, children, className }: TitleProps) => {
  const Heading = `h${level}` as const
  // avoiding string concatenation to create class names because of tailwind optimization
  return (
    <Heading
      className={`${className ? className + ' ' : ''}font-heading font-medium text-white ${textSize[level + 1]} ${xsTextSize[level - 1]}`}
    >
      {children}
    </Heading>
  )
}

export default Title
