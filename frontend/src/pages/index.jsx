import Head from "next/head";
import NextLink from "next/link";
import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { getSiteConfig } from "@/services/siteConfig";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Layout from "@/layout/Layout";

import { getMenuItems } from "@/services/menuItems";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default function Home(props) {
  const { data: session } = useSession();
  const { siteConfig, menuItems } = props;

  return (
    <>
      <NextSeo
        title={siteConfig?.title}
        description={siteConfig?.description}
        canonical={siteConfig?.siteUrl}
      />
      {session ? (
        <Layout siteConfig={siteConfig} menuItems={menuItems}>
          <Flex
            w={"full"}
            h={"100vh"}
            backgroundImage={`url(${siteConfig?.home_background}})`}
            backgroundSize={"cover"}
            backgroundPosition={"center center"}
          >
            <VStack
              w={"full"}
              justify={"center"}
              px={useBreakpointValue({ base: 4, md: 8 })}
              bgGradient={"linear(to-r, blackAlpha.600, transparent)"}
            >
              <Stack maxW={"2xl"} align={"flex-start"} spacing={6}>
                <Text
                  color={"white"}
                  fontWeight={700}
                  lineHeight={1.2}
                  fontSize={useBreakpointValue({ base: "3xl", md: "4xl" })}
                >
                  Bienvenid@ a {siteConfig?.title}
                </Text>
                <Stack direction={"row"}>
                  <NextLink href="/courses">
                    <Button
                      color={"black"}
                      bg={"white"}
                      rounded={".25rem"}
                      border={"1px"}
                      borderColor="black"
                      _hover={{
                        transform: `translate(-.25rem, -.25rem)`,
                        bg: "gray.600",
                        color: "white",
                        boxShadow: ".25rem .25rem 0 black",
                      }}
                    >
                      Ver cursos
                    </Button>
                  </NextLink>
                </Stack>
              </Stack>
            </VStack>
          </Flex>
        </Layout>
      ) : (
        <Flex
          w={"full"}
          h={"100vh"}
          backgroundImage={`url(${siteConfig?.home_background}})`}
          backgroundSize={"cover"}
          backgroundPosition={"center center"}
        >
          <VStack
            w={"full"}
            justify={"center"}
            px={useBreakpointValue({ base: 4, md: 8 })}
            bgGradient={"linear(to-r, blackAlpha.600, transparent)"}
          >
            <Stack maxW={"2xl"} align={"flex-start"} spacing={6}>
              <Text
                color={"white"}
                fontWeight={700}
                lineHeight={1.2}
                fontSize={useBreakpointValue({ base: "3xl", md: "4xl" })}
              >
                Bienvenid@ a {siteConfig?.title}
              </Text>
              <Stack direction={"row"}>
                <NextLink href="/auth/login">
                  <Button
                    color={"black"}
                    bg={"white"}
                    rounded={".25rem"}
                    border={"1px"}
                    borderColor="black"
                    _hover={{
                      transform: `translate(-.25rem, -.25rem)`,
                      bg: "gray.600",
                      color: "white",
                      boxShadow: ".25rem .25rem 0 black",
                    }}
                  >
                    Iniciar sesión
                  </Button>
                </NextLink>
                <NextLink href="/auth/register">
                  <Button
                    color={"black"}
                    bg={"whiteAlpha.500"}
                    rounded={".25rem"}
                    border={"1px"}
                    borderColor="black"
                    _hover={{
                      transform: `translate(-.25rem, -.25rem)`,
                      bg: "whiteAlpha.700",
                      boxShadow: ".25rem .25rem 0 black",
                    }}
                  >
                    Registrarse
                  </Button>
                </NextLink>
              </Stack>
            </Stack>
          </VStack>
        </Flex>
      )}
    </>
  );
}

export async function getServerSideProps({ query, req, res }) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.expires * 1000 < Date.now()) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  const siteConfig = await getSiteConfig();
  if (session) {
    const menuItems = await getMenuItems(session?.user?.accessToken);
    return {
      props: {
        siteConfig,
        menuItems,
      },
    };
  }
  return {
    props: {
      siteConfig,
    },
  };
}
