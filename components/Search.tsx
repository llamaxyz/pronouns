import React from 'react'
import Link from 'next/link'
import { SearchIcon } from '@heroicons/react/outline'
import Input from 'components/Input'
import Loader from 'components/Loader'

const Search = ({ latestId }: { latestId?: number }) => {
  const [typing, setTyping] = React.useState(false)
  const [value, setValue] = React.useState<string>()

  const idArray = [...Array(latestId || 0).keys(), latestId]

  React.useEffect(() => {
    setTyping(true)
    const timeout = setTimeout(() => {
      setTyping(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [value])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return (
    <div className="relative">
      <Input
        placeholder="Search"
        type="text"
        onChange={onChange}
        className="text-sm block w-full"
        parentClassName="hidden lg:block min-w-[18rem]"
        prefix={typing ? <Loader className="w-5 h-5 text-white/60" /> : <SearchIcon className="w-5 h-5 text-white/60" />}
        suffix={<span className="text-white/60 border border-white/10 p-1 text-xs rounded-md">⌘ + K</span>}
      />
      <div className="absolute w-full bg-ui-black z-50">
        {idArray
          .filter(id => id?.toString().includes(value))
          .map(id => (
            <div className="px-3 py-2">
              <Link href={`/nouns/${id}`}>
                <a>Noun {id}</a>
              </Link>
            </div>
          ))
          .slice(0, 6)}
      </div>
    </div>
  )
}

export default Search
