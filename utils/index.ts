import axios from 'axios'
import { Bid } from 'utils/types'

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

const subgraphClient = axios.create({
  baseURL: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
})

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

const nounSeedQuery = (id: number) => `{
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

const latestNounIdQuery = `{
    auctions(orderBy: startTime, orderDirection: desc, first: 1) { id }
}`

export const getNoun = async (id: number | undefined) => {
  const response = await subgraphClient({
    method: 'post',
    data: {
      query: id ? nounQuery(id) : latestNounQuery,
    },
  })
  return id ? response.data?.data?.auction : response.data?.data?.auctions[0]
}

export const getNounSeed = async (id: number | undefined) => {
  if (id !== undefined) {
    const response = await subgraphClient({
      method: 'post',
      data: {
        query: nounSeedQuery(id),
      },
    })
    return response.data?.data?.noun
  }
}

export const getLatestNounId = async () => {
  const response = await subgraphClient({
    method: 'post',
    data: {
      query: latestNounIdQuery,
    },
  })

  return response?.data?.data?.auctions?.[0]?.id
}

export const truncateAddress = (address: string) => (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '0x00...0000')

export const getBidCount = (bids: Bid[], bidder: string): number =>
  bids?.reduce((acc, cur) => (cur.bidder.id === bidder ? (acc += 1) : acc), 0)
