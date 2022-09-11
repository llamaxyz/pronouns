type ProgressProps = {
  total?: number
  filled?: number
}

const Progress = ({ total = 36, filled = 18 }: ProgressProps) => {
  return (
    <div className="flex gap-x-0.5">
      {[...Array(total)].map((_, i) => (
        <div className="h-3 w-0.5 rounded-full bg-white/10" key={i}>
          <div className={`h-3 rounded-full ${i + 1 <= filled ? 'bg-ui-green' : 'bg-transparent'}`} />
        </div>
      ))}
    </div>
  )
}

export default Progress
