import { weightToClassName } from 'utils/index'
import { FontWeight } from 'utils/types'

type htmlButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonType = 'primary' | 'secondary' | 'action' | 'action-secondary' | 'link' | 'outline' | 'input'

type ButtonProps = {
  type?: ButtonType
  htmlType?: htmlButtonType
  children: React.ReactNode
  href?: string
  className?: string
  onClick?: Function
  disabled?: boolean
  ariaLabel?: string
  weight?: FontWeight
}

const Button = ({
  type = 'primary',
  children,
  href = undefined,
  htmlType = 'button',
  className,
  disabled = false,
  ariaLabel,
  weight = 'medium',
  onClick = () => {
    return null
  },
}: ButtonProps) => {
  const buttonClsMap: Record<ButtonType, string> = {
    primary:
      'bg-white rounded-lg disabled:cursor-not-allowed text-ui-black hover:bg-neutral-200 focus:bg-neutral-200 focus:ring-white border border-white/10 rounded-full px-3 py-2.5',
    secondary: 'bg-white/20 disabled:cursor-not-allowed border border-transparent hover:bg-white/30 rounded-[100%] p-2 disabled:opacity-40',
    action:
      'text-ui-black rounded-lg border-transparent bg-ui-green hover:bg-ui-green/50 disabled:cursor-not-allowed disabled:bg-ui-green/50 py-4',
    'action-secondary':
      'rounded-lg bg-white/20 border-0 hover:bg-white/10 disabled:bg-white/10 disabled:cursor-not-allowed text-white py-4',
    link: 'p-0 text-white/40 hover:text-white/80 text-base',
    outline:
      'hover:text-white hover:bg-white/10 border border-white/30 py-2 rounded-md text-ui-silver text-sm lg:text-xs xl:text-sm focus:outline-none focus:border-white',
    input:
      'text-sm text-left block w-full min-w-[18rem] text-white/60 hover:bg-white/20 bg-white/10 rounded-lg border m-0 border-white/5 hover:border-white/50 focus:outline-none focus:border-white py-2.5 pl-10 pr-14',
  }
  const ButtonElement = href ? 'a' : 'button'
  return (
    <ButtonElement
      aria-label={ariaLabel}
      href={href}
      disabled={disabled}
      {...(href ? { target: '_blank', rel: 'noopener norefferer' } : {})}
      className={`text-sm inline-block transition-colors group ease-in-out tracking-wide ${weightToClassName[weight]} ${
        buttonClsMap[type]
      } ${className ?? ''}`}
      onClick={() => onClick()}
      type={htmlType}
    >
      {children}
    </ButtonElement>
  )
}

export default Button
