import { SearchIcon } from '@heroicons/react/outline'
import Title from 'components/Title'
import Connect from 'components/Connect'

const Nav = () => {
  return (
    <div className="py-6 px-10 flex justify-between items-center border-b border-b-white/10">
      <Title level={5} className="text-malachite-green uppercase" isLogo>
        Pronouns
      </Title>
      <div className="relative hidden md:block">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <input type="search" placeholder="Search" className="block pl-10 w-full text-sm p-2.5 bg-white/10 rounded-xl" />
        <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400 border border-white/10 p-1 text-xs rounded-md">⌘ + K</span>
        </div>
      </div>
      <Connect />
    </div>
  )
}

export default Nav
