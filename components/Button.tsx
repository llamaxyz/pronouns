type ButtonProps = {
  type?: 'primary' | 'secondary'
  children: React.ReactNode
  href?: string
  className?: string
  onClick?: Function
  disabled?: boolean
}

type ButtonTypeMapping = {
  primary: string
  secondary: string
}

const Button = ({
  type = 'primary',
  children,
  href = undefined,
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
  }
  const ButtonElement = href ? 'a' : 'button'
  return (
    <ButtonElement
      href={href}
      disabled={disabled}
      {...(href ? { target: '_blank', rel: 'noopener norefferer' } : {})}
      className={`${className ?? ''} text-sm inline-block transition-colors group ease-in-out font-semibold ${buttonClsMap[type]}`}
      onClick={() => onClick()}
      type="button"
    >
      {children}
    </ButtonElement>
  )
}

export default Button
