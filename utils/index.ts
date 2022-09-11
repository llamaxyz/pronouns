import { Bid, FontWeight } from 'utils/types'

/*
 *********************
 * Utility functions
 *********************
 */

export const formatDate = (date: number | Date, displayTime?: boolean): string =>
  new Intl.DateTimeFormat(typeof window !== 'undefined' ? window?.navigator?.language : 'default', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    ...(displayTime && { hour: 'numeric' }),
    ...(displayTime && { minute: 'numeric' }),
    timeZone: 'UTC',
  }).format(date ? new Date(date) : new Date())

export const formatNumber = (num: number): string =>
  new Intl.NumberFormat(typeof window !== 'undefined' ? window?.navigator?.language : 'default', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)

export const truncateAddress = (address: string) => (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '0x00...0000')

export const weightToClassName: Record<FontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  bold: 'font-semibold',
}

export const getBidCount = (bids: Bid[], bidder: string): number =>
  bids?.reduce((acc, cur) => (cur.bidder.id === bidder ? (acc += 1) : acc), 0)

/*
 *********************
 * Nouns data fetching
 *********************
 */

const NOUNS_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph'

const nounQuery = (id: number) => `{
    auction(id: ${id}) {
        id
        amount
        settled
        bidder {
          id
          __typename
    }
    startTime
    endTime
    noun {
      id
      seed {
        background
        body
        accessory
        head
        glasses
        __typename
      }
      owner {
        id
        __typename
      }
      __typename
    }
    bids(orderBy: amount, orderDirection: desc) {
          id
          amount
          blockNumber
          blockTimestamp
          txIndex
          bidder {
            id
            __typename
      }
      __typename
    }
    __typename
  }
}`

const latestNounQuery = `{
    auctions(orderBy: startTime, orderDirection: desc, first: 1) {
        id
        amount
        settled
        bidder {
          id
          __typename
    }
    startTime
    endTime
    noun {
      id
      seed {
        background
        body
        accessory
        head
        glasses
        __typename
      }
      owner {
        id
        __typename
      }
      __typename
    }
    bids(orderBy: amount, orderDirection: desc) {
          id
          amount
          blockNumber
          blockTimestamp
          txIndex
          bidder {
            id
            __typename
      }
      __typename
    }
    __typename
  }
}`

const latestNounIdQuery = `{
    auctions(orderBy: startTime, orderDirection: desc, first: 1) { id }
}`

const seedQuery = (id: number) => `{
    noun(id: ${id}) {
        id
        seed {
          background
          body
          accessory
          head
          glasses
          __typename
    }
    owner {
          id
          __typename
    }
    __typename
  }
}`

const seedsQuery = `{
    nouns(first: 1000) {
        id
        seed {
          background
          body
          accessory
          head
          glasses
          __typename
    }
    owner {
          id
          __typename
    }
    __typename
  }
}`

const accountQuery = (address: string) => `{
  account(id: "${address}") {
    id
    tokenBalanceRaw
  }
}`

export const getNoun = async (id?: number) => {
  const isNounder = Boolean(id === 0 || (id && id % 10 === 0))
  const response = await fetch(NOUNS_SUBGRAPH_URL, {
    method: 'post',
    body: JSON.stringify({
      query: id !== undefined ? nounQuery(isNounder ? id + 1 : id) : latestNounQuery,
    }),
  })

  if (isNounder && id !== undefined) {
    const nounderResponse = await fetch(NOUNS_SUBGRAPH_URL, {
      method: 'post',
      body: JSON.stringify({
        query: seedQuery(id),
      }),
    })

    const responseData = await response?.json()
    const nounderData = await nounderResponse?.json()
    return {
      endTime: responseData?.data?.auction.endTime,
      startTime: responseData?.data?.auction.startTime,
      id: nounderData?.data.noun.id,
      settled: true,
      ...nounderData?.data,
    }
  }

  const responseData = await response?.json()
  return id ? responseData?.data?.auction : responseData?.data?.auctions[0]
}

export const getLatestNounId = async () => {
  const response = await fetch(NOUNS_SUBGRAPH_URL, {
    method: 'post',
    body: JSON.stringify({
      query: latestNounIdQuery,
    }),
  })
  const responseData = await response?.json()
  return responseData?.data?.auctions?.[0]?.id
}

export const getAccount = async (address: string) => {
  const response = await fetch(NOUNS_SUBGRAPH_URL, {
    method: 'post',
    body: JSON.stringify({
      query: accountQuery(address),
    }),
  })
  const responseData = await response?.json()
  return responseData?.data?.account ?? { account: { id: address, tokenBalanceRaw: '0' } }
}

export const getSeeds = async () => {
  const response = await fetch(NOUNS_SUBGRAPH_URL, {
    method: 'post',
    body: JSON.stringify({
      query: seedsQuery,
    }),
  })
  const responseData = await response?.json()
  return responseData?.data?.nouns
}

export const getTraitStats = async (seed?: Record<string, string>) => {
  if (seed) {
    const seedSearchParams: Record<string, string> = {
      background: seed.background,
      body: seed.body,
      head: seed.head,
      accessory: seed.accessory,
      glasses: seed.glasses,
    }
    const response = await fetch('/api/stats?' + new URLSearchParams(seedSearchParams), {
      method: 'GET',
    })
    const responseData = await response?.json()
    return responseData
  }
}
