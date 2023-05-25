import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import NextLink from "next/link";

import { getSiteConfig } from "@/services/siteConfig";
import Footer from '@/layout/Footer';

export default function CallToActionWithIllustration(props) {
  const { siteConfig } = props;
  return (
    <>
      <NextSeo
        title={`Página no encontrada ${siteConfig?.title}`}
        description="Quizás el recurso que ha buscado ha sido borrado o ya no se encuentre disponible."
      />
      <Container maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Página{" "}
            <Text as={"span"} color={"blue.400"}>
              no encontrada
            </Text>
          </Heading>
          <Text color={"gray.500"} maxW={"3xl"}>
            Quizás el recurso que ha buscado ha sido borrado o ya no se
            encuentre disponible.
          </Text>
          <Stack spacing={6} direction={"row"}>
            <NextLink href="/" passhref>
              <Button variant="primary" px={6}>
                Volver al Inicio
              </Button>
            </NextLink>
          </Stack>
          <Flex w={"full"}>
            <Image src={"/assets/404.svg"} alt={"404"} />
          </Flex>
        </Stack>
      </Container>
      <Footer siteConfig={siteConfig} />
    </>
  );
}

export async function getStaticProps() {
  const siteConfig = await getSiteConfig();
  return {
    props: {
      siteConfig,
    },
  };
}
