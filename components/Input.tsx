import React from 'react'

type InputProps = {
  placeholder: string
  value?: string
  className?: string
  parentClassName?: string
  type: string
  min?: string
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: React.Dispatch<React.SetStateAction<string>>
  prefix?: React.ReactNode
  prefixPadding?: string
  suffix?: React.ReactNode
  hasClickableSuffix?: boolean
  isCommandInput?: boolean
  autoFocus?: boolean
}

const inputClass =
  'w-full transition ease-in-out placeholder:text-white/60 bg-white/10 rounded-lg tracking-wide border m-0 border-white/5 hover:border-white/50 focus:outline-none focus:border-white font-normal'

const Input = ({
  placeholder,
  type,
  min,
  onChange,
  prefix,
  prefixPadding = 'pl-10',
  suffix,
  value,
  className = '',
  parentClassName = '',
  hasClickableSuffix = false,
  autoFocus,
}: InputProps) => {
  return prefix || suffix ? (
    <div className={`relative ${parentClassName}`}>
      {prefix && <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">{prefix}</div>}
      <input
        onChange={onChange}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={`${inputClass} py-2.5 ${prefix ? prefixPadding : 'pl-2.5'} ${suffix ? 'pr-14' : 'pr-2.5'} ${className}`}
        type={type}
        {...(min ? { min } : {})}
        {...(value !== undefined ? { value } : {})}
      />
      {suffix && (
        <div className={`flex absolute inset-y-0 right-0 items-center pr-3 ${hasClickableSuffix ? '' : 'pointer-events-none'}`}>
          {suffix}
        </div>
      )}
    </div>
  ) : (
    <input
      autoFocus={autoFocus}
      onChange={onChange}
      placeholder={placeholder}
      className={`${inputClass} px-4 py-3 ${className}`}
      type={type}
      {...(min ? { min } : {})}
      {...(value ? { value } : {})}
    />
  )
}

export default Input
