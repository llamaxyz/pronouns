import axios from 'axios'

export const formatDate = (date: number | Date): string =>
  new Intl.DateTimeFormat('default', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date ? new Date(date) : new Date())

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
  if (id) {
    const response = await subgraphClient({
      method: 'post',
      data: {
        query: nounSeedQuery(id),
      },
    })
    return response.data?.data?.noun
  }
}
