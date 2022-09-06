import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Connect from 'components/Connect'
import Search from 'components/Search'
import logo from 'public/pronouns-logo.svg'

const Nav = ({ latestId }: { latestId?: number }) => {
  return (
    <div className="py-6 flex-wrap xs:no-flex-wrap gap-x-4 sm:gap-x-0 gap-y-4 xs:gap-y-0 px-10 flex justify-between items-center border-b border-b-white/10">
      <Link href="/">
        <a className="flex items-center">
          <Image src={logo} alt="Pronouns" width={188} height={22} />
        </a>
      </Link>
      <Search latestId={latestId} />
      <Connect />
    </div>
  )
}

export default React.memo(Nav)
