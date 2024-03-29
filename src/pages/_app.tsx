import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, ColorModeProvider  } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import theme from '@/theme'
import { wrapper } from '@/store'
import { ReactElement } from 'react'

function App({ Component, pageProps }: AppProps) {
  const ComponentElement = Component as any
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider options={{ useSystemColorMode: false }} value="light">
      <Layout>
        <ComponentElement {...pageProps} />
      </Layout>
      </ColorModeProvider>
    </ChakraProvider>
  ) as ReactElement
}

export default wrapper.withRedux(App)
