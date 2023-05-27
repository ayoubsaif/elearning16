import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Text,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  AspectRatio,
} from "@chakra-ui/react";
import Link from "next/link";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { ChevronRightIcon } from "@chakra-ui/icons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import Layout from "@/layout/Layout";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCourseContentById } from "@/services/courses";
import { formatDistanceToNow, set } from "date-fns";
import { es } from "date-fns/locale";

import { updateContentProgress } from "@/services/courseContent";
import { useSession } from "next-auth/react";

export default function Home(props) {
  const { siteConfig, menuItems, content } = props;
  const { data: session } = useSession();
  const createdDate = formatDistanceToNow(new Date(content?.create_date), {
    locale: es,
  });
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(content?.played);
  const [onDuration, setOnDuration] = useState(0);


  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds.toFixed(4));
    const updateProgress = async () => {
      const data = {
        played: currentTime,
        progress:
          onDuration - currentTime > 0 ? (currentTime * 100) / onDuration : 100,
      };
      updateContentProgress(session?.user?.accessToken, content?.id, data);
    };
    setTimeout(updateProgress, 120000);
  };

  return (
    <Layout siteConfig={siteConfig} menuItems={menuItems}>
      <Flex direction="column" align="flex-start" my={4}>
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <Link href="/">
              <Text>Inicio</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/courses">
              <Text>Cursos</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/course/${content?.course?.slug}`}>
              <Text>{content?.course?.name}</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text>{content?.name}</Text>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>

      <Box px={4} marginBottom={5} width={"full"}>
        <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} my={4}>
          {content?.name}
        </Heading>
        <Box paddingTop={10}>
          <AspectRatio maxW="100%" ratio={16 / 9}>
            <ReactPlayer
              ref={playerRef}
              url={content?.iframe}
              controls
              onProgress={handleProgress}
              onDuration={setOnDuration}
              width={"full"}
              height={"full"}
            />
          </AspectRatio>
          <Text paddingTop={10}>
            Publicado hace {createdDate}{" "}
            {content?.create_uid?.name && (
              <>
                {"por"} <strong>{content?.create_uid?.name}</strong>
              </>
            )}
          </Text>
          <Text paddingTop={10} paddingBottom={10}>
            {content?.description}
          </Text>
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps({ query, req, res }) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  const siteConfig = await getSiteConfig();
  const menuItems = await getMenuItems(session?.user?.accessToken);
  const content = await getCourseContentById(
    query?.id,
    session?.user?.accessToken
  );
  return {
    props: {
      siteConfig,
      menuItems,
      content,
    },
  };
}
