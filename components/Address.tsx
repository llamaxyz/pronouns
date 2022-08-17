import React from 'react'
import { ethers } from 'ethers'
import { useBalance } from 'wagmi'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Account from 'components/Account'
import Paragraph from 'components/Paragraph'
import { Bid } from 'utils/types'

type HeaderProps = {
  address: string
  txHash: string
  bidCount?: number
}

type ListProps = {
  items: Bid[] | undefined
}

const Header = ({ address, txHash, bidCount = 0 }: HeaderProps) => {
  const { data } = useBalance({
    addressOrName: address,
  })
  return (
    <div className="bg-white/10 rounded-lg py-2 px-3 relative">
      <a
        className="absolute top-2.5 right-2.5 z-10"
        rel="noopener noreferer noreferrer"
        target="_blank"
        href={`https://etherscan.io/tx/${txHash}`}
      >
        <ExternalLinkIcon className="opacity-60 h-4 w-4" />
      </a>
      <div className="flex flex-col justify-between gap-y-4">
        <div>
          <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Highest Bidder</Paragraph>
          <Paragraph className="flex items-center justify-between text-lg">
            <Account alwaysAvatar address={address} />
          </Paragraph>
        </div>
        <div className="flex items-center gap-x-12">
          <div>
            <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Wallet Balance</Paragraph>
            <Paragraph className="font-normal text-lg tracking-wide">Ξ {(+(data?.formatted || 0)).toFixed(2).toString()}</Paragraph>
          </div>
          <div>
            <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Bids</Paragraph>
            <Paragraph className="font-normal text-lg tracking-wide">{bidCount}</Paragraph>
          </div>
        </div>
      </div>
    </div>
  )
}

const List = ({ items }: ListProps) => (
  <div className="py-2 px-3 flex flex-col gap-y-4 max-h-[28rem] overflow-scroll">
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
