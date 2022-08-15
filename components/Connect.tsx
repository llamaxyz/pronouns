import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from 'components/Button'

const Connect = () => (
  <ConnectButton.Custom>
    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
      return (
        <div
          {...(!mounted && {
            'aria-hidden': true,
            style: {
              opacity: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            },
          })}
        >
          {(() => {
            if (!mounted || !account || !chain) {
              return (
                <Button className="rounded-lg" isBold onClick={openConnectModal}>
                  Connect
                </Button>
              )
            }

            if (chain.unsupported) {
              return (
                <Button className="rounded-lg" isBold onClick={openChainModal}>
                  Wrong network
                </Button>
              )
            }

            return (
              <div className="flex gap-6">
                <Button className="rounded-lg flex items-center" isBold onClick={openAccountModal}>
                  <img className="h-6 w-6 mr-2 inline rounded-full" src={`https://cdn.stamp.fyi/avatar/${account.displayName}`} />
                  <span>
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </span>
                </Button>
              </div>
            )
          })()}
        </div>
      )
    }}
  </ConnectButton.Custom>
)

export default Connect
