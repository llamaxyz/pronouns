export type AuctionState = 'settled' | 'live' | 'unsettled'

export interface Bid {
  id: string
  bidder: Bidder
  amount: string
  bids: Bidder[]
}

export interface Bidder {
  id: string
}

export type BidStatus = 'success' | 'loading' | 'error' | 'idle'

export type Status = 'success' | 'error' | 'loading'

export type ToastData = {
  open: boolean
  message: string
  type: BidStatus
}
