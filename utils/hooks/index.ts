import { useQuery } from '@tanstack/react-query'
import { getLatestNounId, getNoun, getAccount, getSeeds, getTraitStats } from 'utils/index'
import { NounSeed } from 'utils/types'

export const useLatestNounId = () =>
  useQuery(['latestNounId'], () => getLatestNounId(), {
    retry: 1,
  })

export const useNoun = (id?: number, latestId?: number) => {
  const isNounder = Boolean(id === 0 || (id && id % 10 === 0))
  return useQuery(['noun', id, isNounder], () => getNoun(id), {
    refetchOnWindowFocus: id === latestId,
    refetchInterval: id === latestId && 5000,
    staleTime: id === latestId ? 0 : Infinity,
    cacheTime: id === latestId ? 300000 : Infinity,
    retry: 1,
    enabled: id !== undefined && latestId !== undefined,
  })
}

export const useOwner = (address: string) =>
  useQuery(['owner', address], () => address && getAccount(address), {
    retry: 1,
  })

export const useSeeds = () =>
  useQuery(['seeds'], getSeeds, {
    retry: 1,
  })

export const useTraitStats = (seed?: Record<string, string>, id?: number) => {
  return useQuery(['traitStats', id, seed], () => getTraitStats(seed), {
    retry: 1,
  })
}
