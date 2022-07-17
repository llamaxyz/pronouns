type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

const textSize = ['text-7xl', 'text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg']

const mdTextSize = [
  'md:text-[7.5rem]',
  'md:text-6xl',
  'md:text-5xl',
  'md:text-4xl',
  'md:text-3xl',
  'md:text-2xl',
  'md:text-xl',
  'md:text-lg',
]

const Title = ({ level = 3, children, className }: TitleProps) => {
  const Heading = `h${level}` as const
  // avoiding string concatenation to create class names because of tailwind optimization
  return (
    <Heading
      className={`${className ? className + ' ' : ''}font-heading font-medium mb-6 text-white ${textSize[level - 1]} ${
        mdTextSize[level - 1]
      }`}
    >
      {children}
    </Heading>
  )
}

export default Title
