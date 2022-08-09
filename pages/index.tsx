import type { NextPage } from 'next'
import Image from 'next/future/image'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { ImageData, getNounData } from '@nouns/assets'
import { buildSVG } from '@nouns/sdk'
import Head from 'next/head'
import { ethers } from 'ethers'
import Button from 'components/Button'
import React from 'react'
import Nav from 'components/Nav'
import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import Tag from 'components/Tag'
import Title from 'components/Title'
import loadingNoun from 'public/loading-skull-noun.gif'
import { formatDate, getAllNouns, getNounSeed } from 'utils/index'

interface Noun {
  id: string
  settled: boolean
}

interface NounSeed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

interface AuctionData {
  amount: string
  endTime: string
  bidder: string
}

const Home: NextPage = () => {
  const [id, setId] = React.useState<number>()
  const [auction, setAuction] = React.useState<AuctionData>({} as AuctionData)
  const { data: nouns, status: nounsStatus } = useQuery(['nouns'], getAllNouns, {
    refetchOnWindowFocus: false,
    retry: 1,
  })
  const { data: seed, status: seedStatus } = useQuery(['noun', id], () => getNounSeed(id), {
    refetchOnWindowFocus: false,
    retry: 1,
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAuction({ ...auction, endTime: auction.endTime })
    }, 1000)

    return () => clearInterval(interval)
  }, [auction?.endTime])

  React.useEffect(() => {
    if (nounsStatus === 'success') {
      setId(Number(nouns[0].id))
      setAuction({ bidder: nouns[0].bidder.id, endTime: nouns[0].endTime, amount: nouns[0].amount })
    }
  }, [nounsStatus, nouns])

  const getNounDetails = (nounId = id) => nouns?.find((noun: Noun) => Number(noun.id) === nounId)

  const renderNoun = (seed: NounSeed) => {
    const { parts, background } = getNounData(seed)
    return `data:image/svg+xml;base64,${window.btoa(buildSVG(parts, ImageData.palette, background))}`
  }

  const getTimer = (endTime: string) => {
    const hours = Math.floor(((Number(endTime) * 1000 - Date.now()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor(((Number(endTime) * 1000 - Date.now()) % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor(((Number(endTime) * 1000 - Date.now()) % (1000 * 60)) / 1000)
    return (
      <>
        {hours < 10 ? `0${hours}` : hours}
        <span className="px-0.5 opacity-60 relative bottom-0.5">:</span>
        {minutes < 10 ? `0${minutes}` : minutes}
        <span className="px-0.5 opacity-60 relative bottom-0.5">:</span>
        {seconds < 10 ? `0${seconds}` : seconds}
      </>
    )
  }

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
              loading={nounsStatus === 'loading'}
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
              loading={nounsStatus === 'loading'}
              loadingElement={
                <div className="w-[108px] overflow-hidden animate-pulse mt-auto h-8 text-ui-silver bg-ui-silver py-1.5 px-3 tracking-wider text-xs xxs:text-sm   rounded-full">
                  Live Auction
                </div>
              }
            >
              <Tag className="mt-auto hidden xxxs:block">
                {isNounderNoun ? 'Nounders' : getNounDetails()?.settled ? 'Settled' : 'Live Auction'}
              </Tag>
            </Skeleton>
          </div>
          <div className={`${seed?.seed?.background === '0' ? 'bg-cool' : 'bg-warm'} rounded-lg h-64 text-black`}>
            <Image
              alt={`Noun ${id}`}
              className="mx-auto"
              width={256}
              height={256}
              src={seedStatus === 'success' ? renderNoun(seed.seed) : loadingNoun}
            />
          </div>
        </div>
        <div className="col-span-full lg:col-span-4 py-6">
          <div className="border border-white/10 rounded-xl p-4">
            <div className="flex gap-4">
              <div className="bg-ui-sulphur xl:px-8 py-2 w-[50%] text-center rounded-lg">
                <div>
                  <Paragraph className="text-ui-black opacity-60 font-medium text-sm">Time Left</Paragraph>
                </div>
                <Skeleton
                  hasParentElement
                  loading={nounsStatus === 'loading'}
                  loadingElement={<div className="h-8 bg-ui-silver rounded tracking-wide" />}
                >
                  <div>
                    <Title level={6} className="text-ui-black tracking-wide">
                      {getTimer(auction.endTime)}
                    </Title>
                  </div>
                </Skeleton>
              </div>
              <div className="bg-ui-space xl:px-8 py-2 w-[50%] text-center rounded-lg">
                <div>
                  <Paragraph className="text-sm opacity-60 font-medium">Top Bid</Paragraph>
                </div>
                <Skeleton
                  hasParentElement
                  loading={nounsStatus === 'loading'}
                  loadingElement={<div className="h-8 bg-ui-silver rounded tracking-wide" />}
                >
                  <div>
                    <Title level={6} className="tracking-wide">
                      Ξ {ethers.utils.formatEther(auction.amount || 0)}
                    </Title>
                  </div>
                </Skeleton>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full lg:col-span-3 py-6" />
      </div>
    </div>
  )
}

export default Home
