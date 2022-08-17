import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Connect from 'components/Connect'
import Search from 'components/Search'
import Title from 'components/Title'
import logo from 'public/pronouns-logo.svg'

const Nav = ({ latestId }: { latestId?: number }) => {
  return (
    <div className="py-6 px-10 flex justify-between items-center border-b border-b-white/10">
      <Link href="/">
        <a>
          <Image src={logo} alt="Pronouns" width={190} height={37} />
        </a>
      </Link>
      <Search latestId={latestId} />
      <Connect />
    </div>
  )
}

export default React.memo(Nav)
