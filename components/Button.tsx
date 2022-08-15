type htmlButtonType = 'button' | 'submit' | 'reset' | undefined

type ButtonType = 'primary' | 'secondary' | 'action' | 'action-secondary' | 'link' | 'outline'

type ButtonProps = {
  type?: ButtonType
  htmlType?: htmlButtonType
  children: React.ReactNode
  href?: string
  className?: string
  onClick?: Function
  disabled?: boolean
  isBold?: boolean
}

const Button = ({
  type = 'primary',
  children,
  href = undefined,
  isBold = false,
  htmlType = 'button',
  className,
  disabled = false,
  onClick = () => {
    return null
  },
}: ButtonProps) => {
  const buttonClsMap: Record<ButtonType, string> = {
    primary:
      'bg-white rounded-lg disabled:cursor-not-allowed text-ui-black hover:bg-neutral-200 focus:bg-neutral-200 focus:ring-white border border-white/10 rounded-full px-3 py-2.5',
    secondary:
      'bg-ui-onyx disabled:cursor-not-allowed border border-transparent hover:bg-neutral-600 rounded-[100%] p-2 disabled:opacity-40',
    action:
      'font-medium tracking-wide text-ui-black rounded-lg border-transparent bg-malachite-green hover:bg-malachite-green/50 disabled:cursor-not-allowed disabled:bg-malachite-green/50 py-4',
    'action-secondary':
      'font-medium tracking-wide rounded-lg bg-white/20 border-0 hover:bg-white/10 disabled:bg-white/10 disabled:cursor-not-allowed text-white py-4',
    link: 'p-0 text-white/40 hover:text-white/80 tracking-wide font-normal text-base',
    outline: 'hover:text-white hover:bg-white/10 border border-white/10 py-2 rounded-md text-ui-silver font-normal tracking-wide text-sm',
  }
  const ButtonElement = href ? 'a' : 'button'
  return (
    <ButtonElement
      href={href}
      disabled={disabled}
      {...(href ? { target: '_blank', rel: 'noopener norefferer' } : {})}
      className={`text-sm inline-block transition-colors group ease-in-out ${isBold ? 'font-semibold' : 'font-medium'} ${
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
