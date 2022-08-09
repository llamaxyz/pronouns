import type { NextPage } from 'next'
import Image from 'next/future/image'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon } from '@heroicons/react/outline'
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
import { formatDate, getNoun, getNounSeed } from 'utils/index'

const truncateAddress = (address: string) => (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '0x00...0000')

interface NounSeed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

interface Bid {
  id: string
  bidder: {
    id: string
  }
  amount: string
}

const Home: NextPage = () => {
  const queryClient = useQueryClient()
  const [id, setId] = React.useState<number>()
  const [latestId, setLatestId] = React.useState<number>()
  const [time, setTime] = React.useState<number>(Date.now())
  const isNounderNoun = id && id % 10 === 0
  const validityTime = id === latestId ? 0 : Infinity

  const { data: noun, status: nounStatus } = useQuery(['nounDetails', id, isNounderNoun], () => getNoun(isNounderNoun ? id + 1 : id), {
    refetchOnWindowFocus: false,
    staleTime: validityTime,
    cacheTime: id === latestId ? 100 : Infinity,
    retry: 1,
  })
  const { data: seed, status: seedStatus } = useQuery(['noun', id], () => getNounSeed(id), {
    refetchOnWindowFocus: false,
    retry: 1,
  })

  React.useEffect(() => {
    const prefetchNextNouns = async (nounId: number) => {
      await queryClient.prefetchQuery(
        ['nounDetails', nounId, nounId && nounId % 10 === 0],
        () => getNoun(nounId && nounId % 10 === 0 ? nounId + 1 : nounId),
        {
          staleTime: validityTime,
        }
      )
    }
    if (id) {
      const nextNouns = Array.from({ length: 2 }, (_, i) => id - 1 - i)
      nextNouns.map(nextId => prefetchNextNouns(nextId))
    }
  }, [id])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [noun])

  React.useEffect(() => {
    if (nounStatus === 'success') {
      if (id === undefined) {
        setLatestId(Number(noun?.id))
      }
      setId(isNounderNoun ? Number(noun?.id) - 1 : Number(noun?.id))
    }
  }, [nounStatus, noun])

  const renderNoun = (seed: NounSeed) => {
    const { parts, background } = getNounData(seed)
    return `data:image/svg+xml;base64,${window.btoa(buildSVG(parts, ImageData.palette, background))}`
  }

  const getTimer = (endTime: string) => {
    const hours = Math.floor(((Number(endTime) * 1000 - time) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor(((Number(endTime) * 1000 - time) % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor(((Number(endTime) * 1000 - time) % (1000 * 60)) / 1000)
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
              <Button onClick={() => id && setId(id + 1)} disabled={id === latestId} type="secondary">
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
            <Skeleton
              className="px-1 w-[124px] whitespace-nowrap"
              hasParentElement
              loading={nounStatus === 'loading'}
              loadingElement={
                <>
                  <div className="h-5 mb-1 bg-ui-silver rounded col-span-2" />
                  <div className="h-8 bg-ui-silver rounded col-span-2" />
                </>
              }
            >
              <Paragraph className="text-ui-silver">{formatDate(noun?.startTime * 1000)}</Paragraph>
              <Title isBold level={6}>
                Noun {id}
              </Title>
            </Skeleton>
            <Skeleton
              loading={nounStatus === 'loading'}
              loadingElement={
                <div className="w-[108px] overflow-hidden animate-pulse mt-auto h-8 text-ui-silver bg-ui-silver py-1.5 px-3 tracking-wider text-xs xxs:text-sm rounded-full">
                  Live Auction
                </div>
              }
            >
              <Tag className="mt-auto hidden xxxs:block">{isNounderNoun ? 'Nounders' : noun?.settled ? 'Settled' : 'Live Auction'}</Tag>
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
          <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
            <div className="flex gap-4">
              <div className="bg-ui-sulphur xl:px-8 py-2 w-[50%] text-center rounded-lg">
                <div>
                  <Paragraph className="text-ui-black opacity-60 font-medium text-sm">{id === latestId ? 'Time Left' : 'Winner'}</Paragraph>
                </div>
                <Skeleton
                  hasParentElement
                  loading={nounStatus === 'loading'}
                  loadingElement={<div className="h-8 bg-ui-silver rounded tracking-wide" />}
                >
                  <div>
                    <Title level={6} className="text-ui-black tracking-wide tabular-nums">
                      {id === latestId ? getTimer(noun?.endTime) : truncateAddress(noun.bidder.id)}
                    </Title>
                  </div>
                </Skeleton>
              </div>
              <div className="bg-ui-space xl:px-8 py-2 w-[50%] text-center rounded-lg">
                <div>
                  <Paragraph className="text-sm opacity-60 font-medium">{id === latestId ? 'Top Bid' : 'Winning Bid'}</Paragraph>
                </div>
                <Skeleton
                  hasParentElement
                  loading={nounStatus === 'loading'}
                  loadingElement={<div className="h-8 bg-ui-silver rounded tracking-wide" />}
                >
                  <div>
                    <Title level={6} className="tracking-wide">
                      Ξ {ethers.utils.formatEther(noun?.amount || 0)}
                    </Title>
                  </div>
                </Skeleton>
              </div>
            </div>
            {!noun?.settled && (
              <div className="bg-white/10 rounded-lg py-2 px-3">
                <Paragraph className="xxs:text-sm text-xs opacity-60">Highest Bidder</Paragraph>
                <Paragraph className="flex items-center justify-between">
                  {truncateAddress(noun?.bidder?.id)}{' '}
                  <a rel="noopener noreferer noreferrer" target="_blank" href={`https://etherscan.io/tx/${noun?.bids?.[0]?.id}`}>
                    <ExternalLinkIcon className="opacity-60 h-4 w-4" />
                  </a>
                </Paragraph>
              </div>
            )}
            <div className="py-2 px-3 flex flex-col gap-y-4">
              {noun?.bids?.map((bid: Bid) => (
                <Paragraph key={bid.id} className="flex items-center justify-between opacity-60">
                  {truncateAddress(bid?.bidder?.id)}
                  <span className="flex items-center gap-x-4">
                    <span>Ξ {ethers.utils.formatEther(bid?.amount || 0)}</span>
                    <a rel="noopener noreferer noreferrer" target="_blank" href={`https://etherscan.io/tx/${bid?.id}`}>
                      <ExternalLinkIcon className="opacity-60 h-4 w-4" />
                    </a>
                  </span>
                </Paragraph>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-full lg:col-span-3 py-6" />
      </div>
    </div>
  )
}

export default Home
