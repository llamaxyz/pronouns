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

const allNounsQuery = `{
      auctions(orderBy: startTime, orderDirection: desc, first: 1000) {
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
    bids {
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

export const getAllNouns = async () => {
  const response = await subgraphClient({
    method: 'post',
    data: {
      query: allNounsQuery,
    },
  })
  return response.data?.data?.auctions
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
