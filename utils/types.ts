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

export type AuctionState = 'settled' | 'live' | 'unsettled'

export type BidStatus = 'success' | 'loading' | 'error' | 'idle'

export type ToastData = {
  open: boolean
  message: string
  type: BidStatus
}
