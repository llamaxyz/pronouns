import type { NextPage } from 'next'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import axios from 'axios'
import Button from 'components/Button'
import React from 'react'
import Nav from 'components/Nav'
import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import Tag from 'components/Tag'
import Title from 'components/Title'
import { formatDate } from 'utils/index'

const Home: NextPage = () => {
  const [id, setId] = React.useState(0)
  const [nouns, setNouns] = React.useState([])
  const [nounDetails, setDetails] = React.useState({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const getData = async () => {
      setLoading(true)
      await axios
        .post('https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph', {
          query:
            '{\n  auctions(orderBy: startTime, orderDirection: desc, first: 1000) {\n    id\n    amount\n    settled\n    bidder {\n      id\n      __typename\n    }\n    startTime\n    endTime\n    noun {\n      id\n      owner {\n        id\n        __typename\n      }\n      __typename\n    }\n    bids {\n      id\n      amount\n      blockNumber\n      blockTimestamp\n      txIndex\n      bidder {\n        id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        })
        .then(response => {
          setNouns(response?.data?.data?.auctions)
          setId(Number(response?.data?.data?.auctions[0].id))
        })
      setLoading(false)
    }
    getData()
  }, [])

  React.useEffect(() => {
    const getData = async () => {
      await axios
        .post('https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph', {
          query: `{\n  noun(id: ${id}) {\n    id\n    seed {\n      background\n      body\n      accessory\n      head\n      glasses\n      __typename\n    }\n    owner {\n      id\n      __typename\n    }\n    __typename\n  }\n}\n`,
        })
        .then(response => {
          setDetails(response?.data?.data?.noun)
        })
    }
    getData()
  }, [id])

  const currentNoun = nouns.find(noun => Number(noun.id) === id)
  const currentNounPlusOne = nouns.find(noun => Number(noun.id) === id + 1)
  return (
    <div className="bg-ui-black text-white">
      <Head>
        <meta name="title" content="Auction | Pronouns" />
        <meta property="og:title" content="Auction | Pronouns" />
        <title>Auction | Pronouns</title>
      </Head>
      <Nav />
      <div className="py-6 px-10 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button onClick={() => setId(id - 1)} disabled={id === 0} type="secondary">
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button onClick={() => setId(id + 1)} disabled={id === Number(nouns?.[0]?.id)} type="secondary">
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>
          <Skeleton
            className="px-1 w-[124px] whitespace-nowrap"
            hasParentElement
            loading={loading}
            loadingElement={
              <>
                <div className="h-5 mb-1 bg-ui-silver rounded col-span-2" />
                <div className="h-8 bg-ui-silver rounded col-span-2" />
              </>
            }
          >
            <Paragraph className="text-ui-silver">{`${
              id % 10 === 0 ? formatDate(currentNounPlusOne?.startTime * 1000) : formatDate(currentNoun?.startTime * 1000)
            }`}</Paragraph>
            <Title isBold level={6}>
              Noun {id}
            </Title>
          </Skeleton>
          <Skeleton
            loading={loading}
            loadingElement={
              <div className="w-[108px] animate-pulse mt-auto h-8 text-ui-silver bg-ui-silver py-1.5 px-3 tracking-wider text-sm rounded-full">
                Live Auction
              </div>
            }
          >
            <Tag className="mt-auto">{id % 10 === 0 ? 'Nounder Reward' : !currentNoun?.settled ? 'Live Auction' : 'Settled'}</Tag>
          </Skeleton>
        </div>
        <div className="bg-white rounded-lg w-[50%] h-64 text-black">
          <pre>{JSON.stringify(nounDetails.seed, undefined, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Home
