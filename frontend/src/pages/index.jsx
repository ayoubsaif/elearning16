import Head from "next/head";
import NextLink from "next/link";
import {
  Stack,
  Flex,
  Button,
  Text,
  useColorModeValue,
  Heading,
  Box,
  Icon,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";

import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Layout from "@/layout/Layout";

import { getMenuItems } from "@/services/menuItems";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default function Home(props) {
  const { data: session } = useSession();
  const { siteConfig, menuItems } = props;
  const user = session?.user;
  return (
    <>
      <NextSeo
        title={siteConfig?.title}
        description={siteConfig?.description}
        canonical={siteConfig?.siteUrl}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
            >
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: "30%",
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.50",
                  zIndex: -1,
                }}
              >
                Bienvenid@
              </Text>
              <br />
              <Text as={"span"} color={"blue.300"}>
                {user?.firstname}
              </Text>
            </Heading>
            <Text color={"gray.500"}>{siteConfig?.heroDescription}</Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <NextLink href="/courses">
                <Button
                  variant="primary"
                  rounded={"full"}
                  size={"lg"}
                  fontWeight={"normal"}
                  px={6}
                  leftIcon={<BsSearch h={4} w={4} />}
                >
                  Abrir cursos
                </Button>
              </NextLink>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={"center"}
            align={"center"}
            position={"relative"}
            w={"full"}
          >
            <Blob
              w={"150%"}
              h={"150%"}
              position={"absolute"}
              left={0}
              zIndex={-1}
              color={useColorModeValue("blue.50", "blue.100")}
            />
            <Box
              position={"relative"}
              rounded={"md"}
              boxShadow={"2xl"}
              width={"full"}
              overflow={"hidden"}
            >
            <AspectRatio maxW="560px" ratio={16/9}>
              <Image
                alt={"Hero Image"}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={"100%"}
                src={
                  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80"
                }
              />
              </AspectRatio>
            </Box>
          </Flex>
        </Stack>
      </Layout>
    </>
  );
}

export const Blob = (props) => {
  return (
    <Icon
      width={"100%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};

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
  if (session) {
    const menuItems = await getMenuItems(session?.user?.accessToken);
    return {
      props: {
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
