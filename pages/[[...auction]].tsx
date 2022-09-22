import React from 'react'
import type { NextPage } from 'next'
import { useQueryClient } from '@tanstack/react-query'
import Head from 'next/head'
import { useRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import Auction from 'components/Auction'
import Bid from 'components/Bid'
import AuctionDetails from 'components/AuctionDetails'
import Nav from 'components/Nav'
import { Layout } from 'components/Layout'
import Panel from 'components/Panel'
import { getNoun } from 'utils/index'
import { AuctionState } from 'utils/types'
import { useNoun, useLatestNounId } from 'utils/hooks/index'

const Home: NextPage = () => {
  // Imported hooks
  const queryClient = useQueryClient()
  const { query, push } = useRouter()

  // Local state
  const [id, setId] = React.useState<number>()
  const [pct, setPct] = React.useState('')
  const [pctLoading, setPctLoading] = React.useState(false)
  const [latestId, setLatestId] = React.useState<number>()
  const [time, setTime] = React.useState<number>(Date.now())

  // Server state
  const { data: noun, status: nounStatus } = useNoun(id, latestId)
  const { data: latestNounId, status: latestNounStatus } = useLatestNounId()

  // Local variables
  const isNounder = Boolean(id === 0 || (id && id % 10 === 0))
  const auctionState: AuctionState = noun?.settled
    ? 'settled'
    : noun?.endTime && Date.now() < Number(noun?.endTime) * 1000
    ? 'live'
    : 'unsettled'

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        id !== 0 && setId(id => (id !== undefined ? id - 1 : undefined))
      }

      if (e.key === 'ArrowRight') {
        id !== latestId && setId(id => (id !== undefined ? id + 1 : undefined))
      }
    }

    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [latestId, id])

  React.useEffect(() => {
    const prefetchNextNouns = async (nounId: number) => {
      const nounder = Boolean(nounId === 0 || (nounId && nounId % 10 === 0))
      await queryClient.prefetchQuery(['noun', nounId, nounder], () => getNoun(nounId), {
        staleTime: Infinity,
      })
    }

    if (id !== undefined) {
      const prevNouns = Array.from({ length: 2 }, (_, i) => id - 1 - i)
      const nextNouns = Array.from({ length: 2 }, (_, i) => id + 1 + i)
      prevNouns.map(nextId => prefetchNextNouns(nextId))
      nextNouns.map(nextId => latestId && latestId > nextId && prefetchNextNouns(nextId))
    }

    id !== undefined && id !== latestId && push(`/noun/${id}`, undefined, { shallow: true })

    if (id === latestId) {
      window.history.replaceState({ ...window.history.state, as: '/', url: '/' }, '', '/')
    }
  }, [id])

  React.useEffect(() => {
    if (query?.auction?.[0] === 'noun' && query?.auction?.[1]) {
      setId(Number(query?.auction?.[1]))
    }

    if (Object.entries(query).length === 0) {
      setId(latestId)
    }
  }, [query])

  React.useEffect(() => {
    if (nounStatus === 'success') {
      const nounId = Number(noun?.id)
      renderPctChange(noun?.amount)
      if (nounId !== id) {
        setId(isNounder ? (nounId === 0 ? nounId + 1 : nounId - 1) : nounId)
      }
    }

    const interval = setInterval(() => {
      setTime(Date.now())

      if (id === latestId && latestId && auctionState === 'unsettled') {
        setLatestId(latest => latest && latest + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [nounStatus, noun])

  React.useEffect(() => {
    if (latestNounStatus === 'success') {
      setLatestId(Number(latestNounId))
      if (id === undefined) {
        if (window.location.pathname.startsWith('/noun/')) {
          setId(Number(window.location.pathname.replace('/noun/', '')))
        } else {
          setId(Number(latestNounId))
        }
      }
    }
  }, [latestNounId, latestNounStatus])

  const renderPctChange = async (amount: string) => {
    setPctLoading(true)
    if (id !== undefined && id < 2) {
      setPct('N/A')
    }

    if (id !== latestId && !isNounder) {
      // Winning bid of auction of current id
      const winningBid = new BigNumber(amount)

      // Ignore nounder nouns and get previous id winning bid
      const subtrahend = Boolean(id && (id - 1) % 10 === 0) ? 2 : 1
      const prevId = id && id - subtrahend
      const prevWinningBid = await queryClient.fetchQuery(['nounDetails', prevId, isNounder], () => getNoun(prevId))

      const pctChange = winningBid.div(new BigNumber(prevWinningBid?.amount)).decimalPlaces(4, BigNumber.ROUND_UP)

      const formattedPct = pctChange.isEqualTo(1)
        ? '0.00%'
        : pctChange.isGreaterThan(1)
        ? `+${pctChange.minus(1).times(100).toFixed(2, BigNumber.ROUND_CEIL).toString()}%`
        : `-${new BigNumber(1).minus(pctChange).times(100).toFixed(2, BigNumber.ROUND_CEIL).toString()}%`
      setPct(formattedPct)
    }
    setPctLoading(false)
  }

  return (
    <div className="bg-ui-black text-white">
      <Head>
        <meta name="title" content="Auction | Pronouns" />
        <meta property="og:title" content="Auction | Pronouns" />
        <title>Auction | Pronouns</title>
      </Head>
      <Nav latestId={latestId} />
      <Layout>
        <Layout.Section width={5}>
          <Panel
            amount={noun?.amount}
            auctionState={auctionState}
            seed={noun?.noun?.seed}
            status={nounStatus}
            id={id}
            ownerAddress={noun?.noun?.owner?.id}
            setId={setId}
            latestId={latestId}
            startTime={noun?.startTime}
            isNounder={isNounder}
          />
        </Layout.Section>
        <Layout.Section width={4}>
          <Auction
            noun={noun}
            status={nounStatus}
            auctionState={auctionState}
            isPercentChangeLoading={pctLoading}
            isNounder={isNounder}
            percentChange={pct}
            timeRemaining={time}
            id={id}
            latestId={latestId}
          />
        </Layout.Section>
        <Layout.Section width={3}>
          {latestId && auctionState === 'live' ? (
            <Bid minAmount={noun.amount} id={latestId} />
          ) : (
            <AuctionDetails
              bids={noun?.bids?.length}
              startTime={noun?.startTime}
              status={nounStatus}
              isNounder={isNounder}
              auctionState={auctionState}
            />
          )}
        </Layout.Section>
      </Layout>
    </div>
  )
}

export default Home
