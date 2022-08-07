import type { NextPage } from 'next'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Button from 'components/Button'
import React from 'react'
import Nav from 'components/Nav'
import Paragraph from 'components/Paragraph'
import Tag from 'components/Tag'
import Title from 'components/Title'

const Home: NextPage = () => {
  const [id, setId] = React.useState(401)

  return (
    <div className="bg-ui-black text-white">
      <Head>
        <meta name="title" content="Auction | Pronouns" />
        <meta property="og:title" content="Auction | Pronouns" />
        <title>Auction | Pronouns</title>
      </Head>
      <Nav />
      <div className="py-6 px-10">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button onClick={() => setId(id - 1)} disabled={id === 0} type="secondary">
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button onClick={() => setId(id + 1)} disabled={id === 401} type="secondary">
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="px-1 w-[124px] whitespace-nowrap">
            <Paragraph className="text-ui-silver">July 22, 2022</Paragraph>
            <Title isBold level={6}>
              Noun {id}
            </Title>
          </div>
          <Tag className="mt-auto">{id === 401 ? 'Live Auction' : id % 10 === 0 ? 'Nounder Reward' : 'Settled'}</Tag>
        </div>
      </div>
    </div>
  )
}

export default Home
