import { FontWeight } from 'utils/types'
import { weightToClassName } from 'utils/index'

type TitleProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  weight?: FontWeight
}

// avoiding string concatenation to create class names because of tailwind optimization
const xxsTextSize = ['xxs:text-5xl', 'xxs:text-4xl', 'xxs:text-3xl', 'xxs:text-2xl', 'xxs:text-xl', 'xxs:text-lg']
const textSize = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base']
const generateTextSize = (level: number) => `${textSize[level - 1]} ${xxsTextSize[level - 1]}`

const Title = ({ level = 3, children, className, weight = 'normal' }: TitleProps) => {
  const Heading = `h${level}` as const
  return (
    <Heading
      className={`text-white tracking-wide ${weightToClassName[weight]} ${generateTextSize(level)}${className ? ' ' + className : ''} `}
    >
      {children}
    </Heading>
  )
}

export default Title
