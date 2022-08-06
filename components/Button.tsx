type ButtonProps = {
  children: React.ReactNode
  href?: string
  className?: string
  onClick?: Function
}

const Button = ({
  children,
  href = undefined,
  className,
  onClick = () => {
    return null
  },
}: ButtonProps) => {
  const ButtonElement = href ? 'a' : 'button'
  return (
    <ButtonElement
      href={href}
      {...(href ? { target: '_blank', rel: 'noopener norefferer' } : {})}
      className={`${
        className ?? ''
      } px-3 py-2.5 rounded-full text-sm border border-white/10 inline-block transition-colors bg-white text-ui-black hover:bg-neutral-200 focus:bg-neutral-200 focus:ring-white group font-bold`}
      onClick={() => onClick()}
    >
      {children}
    </ButtonElement>
  )
}

export default Button
