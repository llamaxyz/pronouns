import React from 'react'
import type { NextPage } from 'next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import { ethers } from 'ethers'
import { Address } from 'components/Address'
import Button from 'components/Button'
import Input from 'components/Input'
import Nav from 'components/Nav'
import Paragraph from 'components/Paragraph'
import { Layout } from 'components/Layout'
import Noun from 'components/Noun'
import Skeleton from 'components/Skeleton'
import Statistic from 'components/Statistic'
import Tag from 'components/Tag'
import Title from 'components/Title'
import { formatDate, getNoun, getNounSeed, truncateAddress } from 'utils/index'

const Home: NextPage = () => {
  const queryClient = useQueryClient()
  const [id, setId] = React.useState<number>()
  const [latestId, setLatestId] = React.useState<number>()
  const [time, setTime] = React.useState<number>(Date.now())
  const isNounderNoun = id && id % 10 === 0

  const { data: noun, status: nounStatus } = useQuery(['nounDetails', id, isNounderNoun], () => getNoun(isNounderNoun ? id + 1 : id), {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
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
          staleTime: Infinity,
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
      <Layout>
        <Layout.Section width={5} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button isBold onClick={() => id && setId(id - 1)} disabled={id === 0} type="secondary">
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <Button isBold onClick={() => id && setId(id + 1)} disabled={id === latestId} type="secondary">
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
          <Noun seed={seed?.seed} status={seedStatus} id={id} />
        </Layout.Section>
        <Layout.Section width={4}>
          <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
            <div className="flex gap-4">
              <Statistic
                status={nounStatus}
                titleClass="text-ui-black"
                contentClass="text-ui-black tabular-nums"
                className="bg-ui-sulphur"
                title={id === latestId ? 'Time Left' : 'Winner'}
                content={Number(id) === latestId ? getTimer(noun?.endTime) : truncateAddress(noun?.bidder?.id)}
              />
              <Statistic
                status={nounStatus}
                className="bg-ui-space"
                title={id === latestId ? 'Top Bid' : 'Winning Bid'}
                content={`Ξ ${ethers.utils.formatEther(noun?.amount || 0)}`}
              />
            </div>
            {!noun?.settled && <Address.Header address={noun?.bidder?.id} txHash={noun?.bids?.[0]?.id} />}
            <Address.List items={noun?.bids} />
          </div>
        </Layout.Section>
        <Layout.Section width={3}>
          <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
            <Paragraph>Bid controls</Paragraph>
            <Input placeholder={`Ξ ${(Number(ethers.utils.formatEther(noun?.amount || 0)) * 1.02).toFixed(2)} or more`} />
            <div className="flex flex-col gap-y-2">
              <Button type="action">Place Bid</Button>
              <Button type="action-secondary">Min Bid</Button>
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </div>
  )
}

export default Home
