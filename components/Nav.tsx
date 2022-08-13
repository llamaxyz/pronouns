import React from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import Connect from 'components/Connect'
import Input from 'components/Input'
import Loader from 'components/Loader'
import Title from 'components/Title'

const Nav = () => {
  const [typing, setTyping] = React.useState(false)
  const [value, setValue] = React.useState<string>()

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
    <div className="py-6 px-10 flex justify-between items-center border-b border-b-white/10">
      <Title level={5} className="text-malachite-green uppercase" isLogo>
        Pronouns
      </Title>
      <Input
        placeholder="Search"
        type="text"
        onChange={onChange}
        className="text-sm block w-full"
        parentClassName="hidden lg:block min-w-[18rem]"
        prefix={typing ? <Loader className="w-5 h-5 text-white/60" /> : <SearchIcon className="w-5 h-5 text-white/60" />}
        suffix={<span className="text-white/60 border border-white/10 p-1 text-xs rounded-md">⌘ + K</span>}
      />
      <Connect />
    </div>
  )
}

export default Nav
