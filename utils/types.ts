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

export type ToastData = {
  open: boolean
  message: string
  type: Status
}
