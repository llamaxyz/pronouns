import React from 'react'

type InputProps = {
  placeholder: string
  value?: string
  className?: string
  parentClassName?: string
  type: string
  min?: string
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const inputClass =
  'transition hover:bg-white/5 ease-in-out placeholder:text-white/60 bg-white/10 rounded-md tracking-wide border m-0 border-white/5 focus:outline-none focus:border-white'

const Input = ({ placeholder, type, min, onChange, prefix, suffix, value, className = '', parentClassName = '' }: InputProps) => {
  return prefix || suffix ? (
    <div className={`relative ${parentClassName}`}>
      {prefix && <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">{prefix}</div>}
      <input
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClass} py-2.5 pl-10 pr-14 ${className}`}
        type={type}
        {...(min ? { min } : {})}
        {...(value ? { value } : {})}
      />
      {suffix && <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">{suffix}</div>}
    </div>
  ) : (
    <input
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
