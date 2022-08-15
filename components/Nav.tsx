import React from 'react'
import Connect from 'components/Connect'
import Search from 'components/Search'
import Title from 'components/Title'

const Nav = ({ latestId }: { latestId?: number }) => {
  return (
    <div className="py-6 px-10 flex justify-between items-center border-b border-b-white/10">
      <Title level={5} className="text-malachite-green uppercase" isLogo>
        Pronouns
      </Title>
      <Search latestId={latestId} />
      <Connect />
    </div>
  )
}

export default React.memo(Nav)
