import React from 'react'
import { Command } from 'cmdk'

type InputProps = {
  placeholder: string
  value?: string
  className?: string
  parentClassName?: string
  type: string
  min?: string
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: React.Dispatch<React.SetStateAction<string>>
  onFocus?: (_e: React.ChangeEvent<HTMLInputElement>) => void
  prefix?: React.ReactNode
  prefixPadding?: string
  suffix?: React.ReactNode
  hasClickableSuffix?: boolean
  isCommandInput?: boolean
}

const inputClass =
  'w-full transition ease-in-out placeholder:text-white/60 bg-white/10 rounded-lg tracking-wide border m-0 border-white/5 hover:border-white/50 focus:outline-none focus:border-white'

const Input = ({
  placeholder,
  type,
  min,
  onChange,
  onValueChange,
  onFocus,
  prefix,
  prefixPadding = 'pl-10',
  suffix,
  value,
  className = '',
  parentClassName = '',
  hasClickableSuffix = false,
  isCommandInput = false,
}: InputProps) => {
  const InputElement = isCommandInput ? Command.Input : 'input'
  return prefix || suffix ? (
    <div className={`relative ${parentClassName}`}>
      {prefix && <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">{prefix}</div>}
      <InputElement
        {...(isCommandInput ? { onValueChange } : { onChange })}
        onFocus={onFocus}
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
    <InputElement
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      className={`${inputClass} px-4 py-3 ${className}`}
      type={type}
      {...(min ? { min } : {})}
      {...(value ? { value } : {})}
    />
  )
}

export default Input
