import Head from 'next/head'

export default function MyApp({ Component, pageProps}) {
  return (
    <>
      <Head>
        <title>Sixteen eLearning</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      
      <Component {...pageProps} />
    </>
  )
}
