import type { NextPage } from 'next'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Button from 'components/Button'
import React from 'react'
import Nav from 'components/Nav'
import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import Tag from 'components/Tag'
import Title from 'components/Title'
import { formatDate, getAllNouns, getNounSeed } from 'utils/index'

interface Noun {
  id: string
  settled: boolean
}

const Home: NextPage = () => {
  const [id, setId] = React.useState<number>()
  const {
    isLoading: nounsLoading,
    data: nouns,
    status: nounsStatus,
  } = useQuery(['nouns'], getAllNouns, {
    refetchOnWindowFocus: false,
    retry: 1,
  })
  const { data: seed, status: seedStatus } = useQuery(['noun', id], () => getNounSeed(id), {
    refetchOnWindowFocus: false,
    retry: 1,
  })

  React.useEffect(() => {
    if (nounsStatus === 'success') {
      setId(Number(nouns[0].id))
    }
  }, [nounsStatus, nouns])

  const getNounDetails = (nounId = id) => nouns?.find((noun: Noun) => Number(noun.id) === nounId)
  const isNounderNoun = id && id % 10 === 0
  return (
    <div className="bg-ui-black text-white">
      <Head>
        <meta name="title" content="Auction | Pronouns" />
        <meta property="og:title" content="Auction | Pronouns" />
        <title>Auction | Pronouns</title>
      </Head>
      <Nav />
      <div className="grid grid-cols-12 gap-6 px-10">
        <div className="flex flex-col gap-4 col-span-full lg:col-span-5 py-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button onClick={() => id && setId(id - 1)} disabled={id === 0} type="secondary">
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <Button onClick={() => id && setId(id + 1)} disabled={id === Number(nouns?.[0]?.id)} type="secondary">
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
            <Skeleton
              className="px-1 w-[124px] whitespace-nowrap"
              hasParentElement
              loading={nounsLoading}
              loadingElement={
                <>
                  <div className="h-5 mb-1 bg-ui-silver rounded col-span-2" />
                  <div className="h-8 bg-ui-silver rounded col-span-2" />
                </>
              }
            >
              <Paragraph className="text-ui-silver">{formatDate(getNounDetails(isNounderNoun ? id + 1 : id)?.startTime * 1000)}</Paragraph>
              <Title isBold level={6}>
                Noun {id}
              </Title>
            </Skeleton>
            <Skeleton
              loading={nounsLoading}
              loadingElement={
                <div className="w-[108px] animate-pulse mt-auto h-8 text-ui-silver bg-ui-silver py-1.5 px-3 tracking-wider text-sm rounded-full">
                  Live Auction
                </div>
              }
            >
              <Tag className="mt-auto">{isNounderNoun ? 'Nounder Reward' : getNounDetails()?.settled ? 'Settled' : 'Live Auction'}</Tag>
            </Skeleton>
          </div>
          <div className="bg-white rounded-lg h-64 text-black">
            <pre>{seedStatus === 'success' ? JSON.stringify(seed?.seed, undefined, 2) : 'Loading...'}</pre>
          </div>
        </div>
        <div className="col-span-full lg:col-span-3 py-6">Column 2</div>
        <div className="col-span-full lg:col-span-3 py-6">Column 3</div>
      </div>
    </div>
  )
}

export default Home
