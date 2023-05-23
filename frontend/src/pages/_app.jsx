import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

import theme from "@/layout/theme";

export default function App({  
  Component,  
  pageProps: { session, ...pageProps },
}) {  
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
