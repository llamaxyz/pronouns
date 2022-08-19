import React from 'react'
import Link from 'next/link'
import { Command } from 'cmdk'
import { SearchIcon } from '@heroicons/react/outline'
import Button from 'components/Button'
import Input from 'components/Input'
import Loader from 'components/Loader'

const Search = ({ latestId }: { latestId?: number }) => {
  const [typing, setTyping] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string>('')
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

  const onFocus = () => setOpen(true)

  const onBlur = () => setOpen(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(open => !open)
      }

      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    document.addEventListener('mousedown', clickOutside)

    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('mousedown', clickOutside)
    }
  }, [])

  return (
    <div className="relative hidden lg:block">
      <Button type="input" onClick={() => setOpen(true)}>
        <div className="flex absolute inset-y-0 left-0 items-center pl-3">
          <SearchIcon className="w-5 h-5 text-white/60" />
        </div>
        Search
        <div className={`flex absolute inset-y-0 right-0 items-center pr-3`}>
          <span className="text-white/60 border border-white/10 p-1 text-xs rounded-md">⌘ + K</span>
        </div>
      </Button>
      <Command.Dialog
        className="fixed top-0 left-0 w-screen h-screen backdrop-blur-sm"
        ref={node}
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
      >
        <Input
          isCommandInput
          placeholder="Search"
          type="text"
          onValueChange={setValue}
          onFocus={onFocus}
          className="text-sm block w-full text-white"
          value={value}
          parentClassName="min-w-[18rem]"
          prefix={typing ? <Loader className="w-5 h-5 text-white/60" /> : <SearchIcon className="w-5 h-5 text-white/60" />}
          suffix={<span className="text-white/60 border border-white/10 p-1 text-xs rounded-md">ESC</span>}
        />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Nouns">
            {idArray
              .filter(id => value && id?.toString().includes(value))
              .slice(0, 6)
              .map((id, i, arr) => (
                <Command.Item key={id}>
                  <Link href={`/noun/${id}`}>
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
                </Command.Item>
              ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </div>
  )
}

export default Search

// <div
//   className={`absolute border border-white/10 w-full z-50 tracking-wide rounded-lg bg-ui-black transition ease-in-out ${
//     open ? 'block' : 'hidden'
//   }`}
//   ref={node}
// >

// </div>
