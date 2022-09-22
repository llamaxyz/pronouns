export type AuctionState = 'settled' | 'live' | 'unsettled'

export type FontWeight = 'normal' | 'medium' | 'bold'

export interface Bid {
  id: string
  bidder: Bidder
  amount: string
  bids: Bidder[]
}

export interface Bidder {
  id: string
}

export interface NounSeed {
  accessory: number
  background: number
  body: number
  glasses: number
  head: number
}

export type Status = 'success' | 'error' | 'loading' | 'idle'

export type Rarity = 'Very Common' | 'Common' | 'Medium' | 'Rare' | 'Very Rare' | 'Limited' | 'Very Limited' | 'Only Mint'

export type ToastData = {
  open: boolean
  message: string
  type: Status
}

export type NounType = {
  amount: string
  endTime: string
  bidder: Bidder
  settled: boolean
  bids: Bid[]
  noun: {
    seed: NounSeed
  }
}
