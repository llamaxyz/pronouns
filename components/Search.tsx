import React from 'react'
import Link from 'next/link'
import { SearchIcon } from '@heroicons/react/outline'
import Input from 'components/Input'
import Loader from 'components/Loader'

const Search = ({ latestId }: { latestId?: number }) => {
  const [typing, setTyping] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>()
  const node = React.useRef<HTMLDivElement>(null)

  const idArray = [...Array.from(Array(latestId || 0).keys()), latestId]

  React.useEffect(() => {
    setTyping(true)
    const timeout = setTimeout(() => {
      setTyping(false)
    }, 250)

    return () => clearTimeout(timeout)
  }, [value])

  const clickOutside = (e: MouseEvent) => {
    if (!node?.current?.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  React.useEffect(() => {
    document.addEventListener('mousedown', clickOutside)

    // clean up function before running new effect
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setOpen(Boolean(e.target.value.length))
  }

  const onFocus = () => {
    setOpen(Boolean(value?.length))
  }

  return (
    <div className="relative hidden lg:block">
      <Input
        placeholder="Search"
        type="text"
        onChange={onChange}
        onFocus={onFocus}
        className="text-sm block w-full"
        value={value}
        parentClassName="min-w-[18rem]"
        prefix={typing ? <Loader className="w-5 h-5 text-white/60" /> : <SearchIcon className="w-5 h-5 text-white/60" />}
        suffix={<span className="text-white/60 border border-white/10 p-1 text-xs rounded-md">⌘ + K</span>}
      />
      <div
        className={`absolute border border-white/10 w-full z-50 tracking-wide rounded-lg bg-ui-black transition ease-in-out ${
          open ? 'block' : 'hidden'
        }`}
        ref={node}
      >
        {idArray
          .filter(id => value && id?.toString().includes(value))
          .slice(0, 6)
          .map((id, i, arr) => (
            <Link key={id} href={`/noun/${id}`}>
              <a
                onClick={() => {
                  setValue('')
                  setOpen(false)
                }}
              >
                <div
                  className={`px-4 py-3 ${
                    i === arr.length - 1 ? 'rounded-b-lg' : 'border-b border-b-white/10'
                  } hover:bg-white/10 transition ease-in-out`}
                >
                  Noun {id}
                </div>
              </a>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Search
