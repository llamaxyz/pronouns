type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

const textSize = ['text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base']

const smTextSize = ['sm:text-7xl', 'sm:text-6xl', 'sm:text-5xl', 'sm:text-4xl', 'sm:text-3xl', 'sm:text-2xl', 'sm:text-xl', 'sm:text-lg']

const mdTextSize = [
  'md:text-[7.5rem]',
  'md:text-7xl',
  'md:text-6xl',
  'md:text-5xl',
  'md:text-4xl',
  'md:text-3xl',
  'md:text-2xl',
  'md:text-xl',
]

const generateTextSize = (level: number) => `${textSize[level - 1]} ${smTextSize[level - 1]} ${mdTextSize[level - 1]}`

const Title = ({ level = 3, children, className }: TitleProps) => {
  const Heading = `h${level}` as const
  // avoiding string concatenation to create class names because of tailwind optimization
  return (
    <Heading className={`${className ? className + ' ' : ''}font-heading font-medium mb-6 text-white ${generateTextSize(level)}`}>
      {children}
    </Heading>
  )
}

export default Title
