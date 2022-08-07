import type { NextPage } from 'next'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Button from 'components/Button'
import Nav from 'components/Nav'
import Paragraph from 'components/Paragraph'
import Title from 'components/Title'

const Home: NextPage = () => (
  <div className="bg-ui-black text-white">
    <Head>
      <meta name="title" content="Auction | Pronouns" />
      <meta property="og:title" content="Auction | Pronouns" />
      <title>Auction | Pronouns</title>
    </Head>
    <Nav />
    <div className="py-6 px-10">
      <div className="flex items-center gap-4">
        <div>
          <Button type="secondary">
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Button type="secondary">
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
        <div>
          <Paragraph className="text-ui-silver">July 22, 2022</Paragraph>
          <Title isBold level={6}>
            Noun 383
          </Title>
        </div>
      </div>
    </div>
  </div>
)

export default Home
