import type { AppProps } from 'next/app'
import Head from 'next/head'
import { RainbowKitProvider, getDefaultWallets, darkTheme } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'
import 'styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

const styleConfig = resolveConfig(tailwindConfig)

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Pronouns',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="title" content="Auction | Pronouns" />
      <meta name="description" content="The Nouns interface for power users." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://pronouns.gg/" />
      <meta property="og:title" content="Auction | Pronouns" />
      <meta property="og:description" content="The Nouns interface for power users." />
      <meta property="og:image" content="https://pronouns.gg/pronouns-header.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://pronouns.gg/" />
      <meta property="twitter:title" content="The Nouns interface for power users." />
      <meta property="twitter:description" content="The Nouns interface for power users." />
      <meta property="twitter:image" content="https://pronouns.gg/pronouns-header.png" />
      <title>Auction | Pronouns</title>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={darkTheme({
          // @ts-ignore
          accentColor: styleConfig?.theme?.colors?.white,
          // @ts-ignore
          accentColorForeground: styleConfig?.theme?.colors?.ui?.black,
          fontStack: 'system',
        })}
        chains={chains}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  </>
)

export default App
