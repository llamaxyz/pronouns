type ButtonProps = {
  type?: 'primary' | 'secondary' | 'action' | 'action-secondary'
  children: React.ReactNode
  href?: string
  className?: string
  onClick?: Function
  disabled?: boolean
  isBold?: boolean
}

type ButtonTypeMapping = {
  primary: string
  secondary: string
  action: string
  'action-secondary': string
}

const Button = ({
  type = 'primary',
  children,
  href = undefined,
  isBold = false,
  className,
  disabled = false,
  onClick = () => {
    return null
  },
}: ButtonProps) => {
  const buttonClsMap: ButtonTypeMapping = {
    primary:
      'bg-white text-ui-black hover:bg-neutral-200 focus:bg-neutral-200 focus:ring-white border border-white/10 rounded-full px-3 py-2.5',
    secondary: 'bg-ui-onyx border border-transparent hover:bg-neutral-600 rounded-[100%] p-2 disabled:opacity-40',
    action:
      'font-medium tracking-wide text-ui-black rounded-lg border-transparent bg-malachite-green hover:bg-malachite-green/50 disabled:opacity-40 py-4',
    'action-secondary': 'font-medium tracking-wide rounded-lg bg-white/20 border-0 hover:bg-white/10 text-white py-4',
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
      type="button"
    >
      {children}
    </ButtonElement>
  )
}

export default Button
