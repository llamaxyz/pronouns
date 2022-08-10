type InputProps = {
  placeholder: string
}

const Input = ({ placeholder }: InputProps) => {
  return (
    <input
      placeholder={placeholder}
      className="px-4 py-3 bg-jungle rounded-md tracking-wide border m-0 border-white/5 appearance-none"
      type="number"
      min="0"
    />
  )
}

export default Input
