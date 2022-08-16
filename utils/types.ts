export type Status = 'success' | 'error' | 'loading'

export interface Bidder {
  id: string
}

export interface Bid {
  id: string
  bidder: Bidder
  amount: string
  bids: Bidder[]
}
