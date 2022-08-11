import React from 'react'

type InputProps = {
  placeholder: string
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({ placeholder, onChange }: InputProps) => {
  return (
    <input
      onChange={onChange}
      placeholder={placeholder}
      className="px-4 py-3 bg-ui-jungle rounded-md tracking-wide border m-0 border-white/5"
      type="number"
      min="0"
    />
  )
}

export default Input
