import React from 'react'
import { ethers } from 'ethers'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Account from 'components/Account'
import Paragraph from 'components/Paragraph'
import Title from 'components/Title'

interface Bid {
  id: string
  bidder: {
    id: string
  }
  amount: string
}

type HeaderProps = {
  address: string
  txHash: string
}

type ListProps = {
  items: Bid[] | undefined
}

const Header = ({ address, txHash }: HeaderProps) => (
  <div className="bg-white/10 rounded-lg py-2 px-3 relative">
    <a rel="noopener noreferer noreferrer" target="_blank" href={`https://etherscan.io/tx/${txHash}`}>
      <ExternalLinkIcon className="opacity-60 h-4 w-4 absolute top-2.5 right-2.5" />
    </a>
    <div className="flex flex-col justify-between gap-y-4">
      <div>
        <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Highest Bidder</Paragraph>
        <Paragraph className="flex items-center justify-between text-lg">
          <Account alwaysAvatar address={address} />
        </Paragraph>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Wallet Balance</Paragraph>
          <Paragraph className="font-normal text-lg tracking-wide">Ξ 30.00</Paragraph>
        </div>
        <div>
          <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Bids (Current)</Paragraph>
          <Paragraph className="font-normal text-lg tracking-wide">2</Paragraph>
        </div>
        <div>
          <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Bids (All Time)</Paragraph>
          <Paragraph className="font-normal text-lg tracking-wide">5</Paragraph>
        </div>
      </div>
    </div>
  </div>
)

const List = ({ items }: ListProps) => (
  <div className="py-2 px-3 flex flex-col gap-y-4 max-h-[32rem] overflow-scroll">
    {items?.map((bid: Bid) => (
      <Paragraph key={bid.id} className="flex items-center justify-between opacity-60">
        <Account alwaysAvatar address={bid?.bidder?.id} />
        <span className="flex items-center gap-x-4">
          <span>Ξ {ethers.utils.formatEther(bid?.amount || 0)}</span>
          <a rel="noopener noreferer noreferrer" target="_blank" href={`https://etherscan.io/tx/${bid?.id}`}>
            <ExternalLinkIcon className="opacity-60 h-4 w-4" />
          </a>
        </span>
      </Paragraph>
    ))}
  </div>
)

const pkg = {
  Header,
  List: React.memo(List),
}

export { pkg as Address }
