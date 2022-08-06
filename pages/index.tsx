import type { NextPage } from 'next'
import Head from 'next/head'
import Nav from 'components/Nav'

const Home: NextPage = () => (
  <div className="bg-ui-black text-white">
    <Head>
      <meta name="title" content="Auction | Pronouns" />
      <meta property="og:title" content="Auction | Pronouns" />
      <title>Auction | Pronouns</title>
    </Head>
    <Nav />
    <div className="py-6 px-10">
      <h1>noun</h1>
    </div>
  </div>
)

export default Home
