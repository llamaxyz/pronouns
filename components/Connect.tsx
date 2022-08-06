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
              return <Button onClick={openConnectModal}>Connect</Button>
            }

            if (chain.unsupported) {
              return <Button onClick={openChainModal}>Wrong network</Button>
            }

            return (
              <div className="flex gap-6">
                <Button onClick={openAccountModal}>
                  {account.displayName}
                  {account.displayBalance ? ` (${account.displayBalance})` : ''}
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
