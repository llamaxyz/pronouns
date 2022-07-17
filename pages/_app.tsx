import type { AppProps } from 'next/app'
import Head from 'next/head'
import 'styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="title" content="Pronouns | Nouns for Power Users" />
      <meta name="description" content="The Nouns interface for power users." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://pronouns.gg/" />
      <meta property="og:title" content="Pronouns | Nouns for Power Users" />
      <meta property="og:description" content="The Nouns interface for power users." />
      <meta property="og:image" content="https://pronouns.gg/pronouns-header.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://pronouns.gg/" />
      <meta property="twitter:title" content="The Nouns interface for power users." />
      <meta property="twitter:description" content="The Nouns interface for power users." />
      <meta property="twitter:image" content="https://pronouns.gg/pronouns-header.png" />
      <title>Pronouns | Nouns for Power Users</title>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    <Component {...pageProps} />
  </>
)

export default App
