import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import theme from "@/layout/theme";
import { getSiteConfig } from "@/services/siteConfig";

export default function App({Component, pageProps: { session, ...pageProps }}) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

// get static props with page info from backend
App.getInitialProps = async (req) => {
  const siteConfig = await getSiteConfig();
  return {
    pageProps: {
      siteConfig,
    },
  };
}