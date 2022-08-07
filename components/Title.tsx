type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  isLogo?: boolean
  isBold?: boolean
}

// avoiding string concatenation to create class names because of tailwind optimization
const smTextSize = ['sm:text-7xl', 'sm:text-6xl', 'sm:text-5xl', 'sm:text-4xl', 'sm:text-3xl', 'sm:text-2xl']
const textSize = ['text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl']
const generateTextSize = (level: number) => `${textSize[level - 1]} ${smTextSize[level - 1]}`

const Title = ({ level = 3, children, className, isLogo = false, isBold = false }: TitleProps) => {
  const Heading = `h${level}` as const
  return (
    <Heading
      className={`${className ? className + ' ' : ''} text-white ${isLogo ? 'font-logo' : ''} ${
        isBold ? 'font-semibold tracking-wide' : 'font-medium'
      } ${generateTextSize(level)}`}
    >
      {children}
    </Heading>
  )
}

export default Title
