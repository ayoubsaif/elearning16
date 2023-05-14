// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import "@/styles/globals.css"

const colors = {
  blue: {
    50: '#cbe0f3',
    100: '#98c1e7',
    200: '#65a1da',
    300: '#3182ce',
    400: '#1f5181',
    500: '#194167',
    600: '#12314d',
    800: '#06101a',
  }
}

export const theme = extendTheme({ colors })

// 3. Pass the `theme` prop to the `ChakraProvider`
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp