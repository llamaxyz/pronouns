import React from 'react'
import BigNumber from 'bignumber.js'
import { utils, BigNumber as EthersBN } from 'ethers'
import { useBalance } from 'wagmi'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Account from 'components/Account'
import Paragraph from 'components/Paragraph'
import Skeleton from 'components/Skeleton'
import { formatNumber } from 'utils/index'
import { Bid } from 'utils/types'
import { useOwner } from 'utils/hooks'

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
  const { data: owner, status: ownerStatus } = useOwner(address)
  return (
    <div className="bg-white/5 rounded-lg py-4 px-5 relative">
      <a
        className="absolute top-2.5 right-2.5 z-10 hover:text-white/70 transition ease-in-out"
        rel="noopener noreferer noreferrer"
        target="_blank"
        href={`https://etherscan.io/tx/${txHash}`}
      >
        <ExternalLinkIcon aria-label="Etherscan" className="opacity-60 h-4 w-4" />
      </a>
      <div className="flex flex-col justify-between gap-y-4">
        <div>
          <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Highest Bidder</Paragraph>
          <Paragraph className="flex items-center justify-between text-lg">
            <Account alwaysAvatar address={address} />
          </Paragraph>
        </div>
        <div className="flex items-center justify-between gap-x-2">
          <div>
            <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Wallet Balance</Paragraph>
            <Paragraph className="font-normal text-lg tracking-widest">
              Ξ {formatNumber(Number((+(data?.formatted || 0)).toFixed(2)))}
            </Paragraph>
          </div>
          <div>
            <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Current Bids</Paragraph>
            <Paragraph className="font-normal text-lg tracking-wide">{bidCount}</Paragraph>
          </div>
          <div>
            <Paragraph className="xxs:text-sm text-xs opacity-60 mb-2">Nouns Owned</Paragraph>
            <Skeleton
              className=""
              loading={ownerStatus !== 'success'}
              loadingElement={<div className="h-5 mb-1 bg-white/20 rounded col-span-2" />}
            >
              <Paragraph className="font-normal text-lg tracking-wide">{owner?.tokenBalanceRaw}</Paragraph>
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  )
}

const List = ({ items }: ListProps) => (
  <div className="p-3 flex flex-col gap-y-4">
    {items?.map((bid: Bid) => (
      <Paragraph key={bid.id} className="flex items-center justify-between opacity-60">
        <Account alwaysAvatar address={bid?.bidder?.id} />
        <a
          className="flex items-center gap-x-4 hover:text-white/70 transition ease-in-out mr-1"
          rel="noopener noreferer noreferrer"
          target="_blank"
          href={`https://etherscan.io/tx/${bid?.id}`}
        >
          <span className="min-w-[50px] tabular-nums">
            Ξ {new BigNumber(utils.formatEther(EthersBN.from((bid?.amount || 0).toString()))).toFixed(2, BigNumber.ROUND_CEIL)}
          </span>
          <ExternalLinkIcon aria-label="Etherscan" className="opacity-60 h-4 w-4" />
        </a>
      </Paragraph>
    ))}
  </div>
)

const pkg = {
  Header: React.memo(Header),
  List: React.memo(List),
}

export { pkg as Address }
