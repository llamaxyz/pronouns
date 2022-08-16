import React from 'react'
import type { NextPage } from 'next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { utils, BigNumber as EthersBN } from 'ethers'
import BigNumber from 'bignumber.js'
import { Address } from 'components/Address'
import Account from 'components/Account'
import Bid from 'components/Bid'
import Button from 'components/Button'
import Nav from 'components/Nav'
import Paragraph from 'components/Paragraph'
import { Layout } from 'components/Layout'
import Noun from 'components/Noun'
import Skeleton from 'components/Skeleton'
import Statistic from 'components/Statistic'
import Tag from 'components/Tag'
import Title from 'components/Title'
import { formatDate, getNoun, getNounSeed, getLatestNounId, getBidCount } from 'utils/index'

const Home: NextPage = () => {
  const queryClient = useQueryClient()
  const { query, push } = useRouter()
  const [id, setId] = React.useState<number>()
  const [pct, setPct] = React.useState('')
  const [latestId, setLatestId] = React.useState<number>()
  const [time, setTime] = React.useState<number>(Date.now())
  const isNounder = Boolean(id === 0 || (id && id % 10 === 0))
  const { data: noun, status: nounStatus } = useQuery(
    ['nounDetails', id, isNounder],
    () => getNoun(id === undefined ? id : isNounder ? id + 1 : id),
    {
      refetchOnWindowFocus: id === latestId,
      refetchInterval: id === latestId && 10000,
      staleTime: id === latestId ? 0 : Infinity,
      cacheTime: id === latestId ? 300000 : Infinity,
      retry: 1,
      enabled: id !== undefined && latestId !== undefined,
    }
  )
  const { data: seed, status: seedStatus } = useQuery(['noun', id], () => getNounSeed(id), {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 1,
  })
  const { data: latestNounId, status: latestNounStatus } = useQuery(['latestNounId'], () => getLatestNounId(), {
    retry: 1,
  })

  React.useEffect(() => {
    renderPctChange()
    const prefetchNextNouns = async (nounId: number) => {
      const nounder = Boolean(nounId === 0 || (nounId && nounId % 10 === 0))
      await queryClient.prefetchQuery(['nounDetails', nounId, nounder], () => getNoun(nounder ? nounId + 1 : nounId), {
        staleTime: Infinity,
      })
    }
    if (id !== undefined) {
      const prevNouns = Array.from({ length: 2 }, (_, i) => id - 1 - i)
      const nextNouns = Array.from({ length: 2 }, (_, i) => id + 1 + i)
      prevNouns.map(nextId => prefetchNextNouns(nextId))
      nextNouns.map(nextId => latestId && latestId > nextId && prefetchNextNouns(nextId))
    }
    id === latestId ? push('/', '', { shallow: true }) : push(`/noun/${id}`, '', { shallow: true })
  }, [id])

  React.useEffect(() => {
    if (query?.all?.[0] === 'noun' && query?.all?.[1]) {
      setId(Number(query?.all?.[1]))
    }
  }, [query])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())

      if (id === latestId && latestId && noun?.endTime && Date.now() > Number(noun?.endTime) * 1000) {
        setLatestId(latestId + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [noun])

  React.useEffect(() => {
    if (nounStatus === 'success') {
      const nounId = Number(noun?.id)
      if (nounId !== id) {
        setId(isNounder ? (nounId === 0 ? nounId + 1 : nounId - 1) : nounId)
      }
    }
  }, [nounStatus, noun])

  React.useEffect(() => {
    if (latestNounStatus === 'success') {
      setLatestId(Number(latestNounId))
      if (id === undefined) {
        setId(Number(latestNounId))
      }
    }
  }, [latestNounId, latestNounStatus])

  const renderAuctionStatus = () => {
    if (id === latestId && !isNounder && Date.now() < Number(noun?.endTime) * 1000) {
      const hours = Math.floor(((Number(noun?.endTime) * 1000 - time) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor(((Number(noun?.endTime) * 1000 - time) % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor(((Number(noun?.endTime) * 1000 - time) % (1000 * 60)) / 1000)
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

    return <Account address={isNounder ? 'nounders.eth' : noun?.bidder?.id} isEns={isNounder} />
  }

  const renderPctChange = async () => {
    if (id !== undefined && id < 2) {
      setPct('N/A')
    }

    if (id !== latestId && !isNounder) {
      // Winning bid of auction of current id
      const winningBid = new BigNumber(noun?.amount)

      // Ignore nounder nouns and get previous id winning bid
      const subtrahend = Boolean(id && (id - 1) % 10 === 0) ? 2 : 1
      const prevId = id && id - subtrahend
      const prevWinningBid = await queryClient.fetchQuery(['nounDetails', prevId, isNounder], () => getNoun(prevId))

      const pctChange = winningBid.div(new BigNumber(prevWinningBid?.amount)).decimalPlaces(4, BigNumber.ROUND_UP)
      const formattedPct = pctChange.isGreaterThan(1)
        ? `+${pctChange.minus(1).times(100).toString()}%`
        : `-${new BigNumber(1).minus(pctChange).times(100).toString()}%`
      setPct(formattedPct)
    }
  }

  const renderTopBid = () =>
    isNounder
      ? 'N/A'
      : `Ξ ${new BigNumber(utils.formatEther(EthersBN.from((noun?.amount || 0).toString()))).toFixed(2, BigNumber.ROUND_CEIL)}`

  return (
    <div className="bg-ui-black text-white">
      <Head>
        <meta name="title" content="Auction | Pronouns" />
        <meta property="og:title" content="Auction | Pronouns" />
        <title>Auction | Pronouns</title>
      </Head>
      <Nav latestId={latestId} />
      <Layout>
        <Layout.Section width={5} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button isBold onClick={() => id !== undefined && setId(id - 1)} disabled={id === 0} type="secondary">
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <Button isBold onClick={() => id !== undefined && setId(id + 1)} disabled={id === latestId} type="secondary">
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
            </div>
            <Skeleton
              className="px-1 w-[124px] whitespace-nowrap"
              hasParentElement
              loading={nounStatus === 'loading'}
              loadingElement={
                <>
                  <div className="h-5 mb-1 bg-white/20 rounded col-span-2" />
                  <div className="h-8 bg-white/20 rounded col-span-2" />
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
                <div className="w-[108px] overflow-hidden animate-pulse mt-auto h-8 text-white/20 bg-white/20 py-1.5 px-3 tracking-wider text-xs xxs:text-sm rounded-full">
                  Live Auction
                </div>
              }
            >
              <Tag className="mt-auto hidden xxxs:block">{isNounder ? 'Nounders' : noun?.settled ? 'Settled' : 'Live Auction'}</Tag>
            </Skeleton>
          </div>
          <Noun seed={seed?.seed} status={seedStatus} id={id} />
        </Layout.Section>
        <Layout.Section width={4}>
          <div className="border border-white/10 rounded-xl p-4 flex flex-col gap-y-4">
            <div className="grid grid-cols-2 gap-6 sticky">
              <Statistic
                status={nounStatus}
                titleClass="text-ui-black"
                contentClass="text-ui-black tabular-nums animate-fade-in-1 opacity-0 ease-in-out truncate"
                className={`bg-ui-sulphur w-full ${id === latestId ? 'col-span-1' : 'col-span-full'}`}
                title={id === latestId && noun?.endTime && Date.now() < Number(noun?.endTime) * 1000 ? 'Time Left' : 'Winner'}
                content={renderAuctionStatus()}
              />
              {!isNounder && (
                <Statistic
                  status={nounStatus}
                  contentClass="animate-fade-in-2 opacity-0 ease-in-out"
                  className="bg-ui-space col-span-1 w-full"
                  title={id === latestId && noun?.endTime && Date.now() < Number(noun?.endTime) * 1000 ? 'Top Bid' : 'Winning Bid'}
                  content={renderTopBid()}
                />
              )}
              {id !== latestId && !isNounder && (
                <Statistic
                  status={nounStatus}
                  contentClass="animate-fade-in-2 opacity-0 ease-in-out"
                  className="bg-ui-space col-span-1 w-full"
                  title="% Change"
                  content={<div className={pct[0] === '-' ? 'text-red-400' : 'text-malachite-green'}>{pct}</div>}
                />
              )}
            </div>
            {!noun?.settled && !isNounder && (
              <Address.Header
                bidCount={getBidCount(noun?.bids, noun?.bidder?.id)}
                address={noun?.bidder?.id}
                txHash={noun?.bids?.[0]?.id}
              />
            )}
            {!isNounder && <Address.List items={noun?.bids} />}
          </div>
        </Layout.Section>
        <Layout.Section width={3}>
          {noun?.amount && id === latestId && latestId && <Bid minAmount={noun.amount} id={latestId} />}
        </Layout.Section>
      </Layout>
    </div>
  )
}

export default Home
