type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  isLogo?: boolean
  isBold?: boolean
}

// avoiding string concatenation to create class names because of tailwind optimization
const xxsTextSize = ['xxs:text-7xl', 'xxs:text-6xl', 'xxs:text-5xl', 'xxs:text-4xl', 'xxs:text-3xl', 'xxs:text-2xl']
const textSize = ['text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl']
const generateTextSize = (level: number) => `${textSize[level - 1]} ${xxsTextSize[level - 1]}`

const Title = ({ level = 3, children, className, isLogo = false, isBold = false }: TitleProps) => {
  const Heading = `h${level}` as const
  return (
    <Heading
      className={`text-white ${isLogo ? 'font-logo' : ''} ${isBold ? 'font-semibold tracking-wide' : 'font-medium'} ${generateTextSize(
        level
      )}${className ? ' ' + className : ''} `}
    >
      {children}
    </Heading>
  )
}

export default Title
