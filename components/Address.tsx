import { ethers } from 'ethers'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Paragraph from 'components/Paragraph'
import { truncateAddress } from 'utils/index'

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
  <div className="bg-white/10 rounded-lg py-3 px-4">
    <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Highest Bidder</Paragraph>
    <Paragraph className="flex items-center justify-between">
      <span className="flex items-center">
        <img className="h-6 w-6 mr-2 rounded-full" src={`https://cdn.stamp.fyi/avatar/${address}`} />
        <span>{truncateAddress(address)}</span>
      </span>
      <a rel="noopener noreferer noreferrer" target="_blank" href={`https://etherscan.io/tx/${txHash}`}>
        <ExternalLinkIcon className="opacity-60 h-4 w-4" />
      </a>
    </Paragraph>
  </div>
)

const List = ({ items }: ListProps) => {
  return (
    <div className="py-2 px-3 flex flex-col gap-y-4">
      {items?.map((bid: Bid) => (
        <Paragraph key={bid.id} className="flex items-center justify-between opacity-60">
          <span className="flex items-center">
            <img className="h-6 w-6 mr-2 rounded-full" src={`https://cdn.stamp.fyi/avatar/${bid?.bidder?.id}`} />
            <span>{truncateAddress(bid?.bidder?.id)}</span>
          </span>
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
}

const pkg = {
  Header,
  List,
}

export { pkg as Address }
