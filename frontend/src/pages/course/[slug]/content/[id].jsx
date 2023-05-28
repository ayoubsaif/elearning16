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
  HStack,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button
} from "@chakra-ui/react";
import Link from "next/link";
import { BsTrash3, BsPencilSquare } from "react-icons/bs";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { ChevronRightIcon } from "@chakra-ui/icons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import Layout from "@/layout/Layout";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCourseContentById, deleteContent } from "@/services/courseContent";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { updateContentProgress } from "@/services/courseContent";
import { useSession } from "next-auth/react";

export default function Home(props) {
  const { siteConfig, menuItems, content } = props;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef();
  const router = useRouter();
  
  const { data: session } = useSession();
  const createdDate = formatDistanceToNow(new Date(content?.create_date), {
    locale: es,
  });
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(content?.played);
  const [onDuration, setOnDuration] = useState(0);
  const lastUpdateRef = useRef(0);
  
  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds.toFixed(4));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;

      if (timeSinceLastUpdate >= 60000) {
        const data = {
          played: parseFloat(currentTime),
          progress:
            onDuration - currentTime > 0 ? (currentTime * 100) / onDuration : 100,
        };
        updateContentProgress(session?.user?.accessToken, content?.id, data);
        lastUpdateRef.current = now;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentTime, onDuration]);

  const onDelete = async () => {
    await deleteContent(content?.id, session?.user?.accessToken);
    router.push(`/course/${content?.course?.slug}`);
  }

  return (
    <>
      <NextSeo
        title={`${content?.name} - ${siteConfig?.title}`}
        description={`${content?.description}`}
        canonical={`${siteConfig?.siteUrl}/course/${content?.course?.slug}/content/${content?.id}`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/course/${content?.course?.slug}/content/${content?.id}`,
          title: `${content?.name}`,
          description: `${content?.description}`
        }}
      />
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
          <HStack spacing={4} align="center">
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} my={4}>
              {content?.name}
            </Heading>
            {content?.canEdit &&
              <>
                <Link href={`/course/${content?.course?.slug}/content/${content?.id}/edit`}>
                  <IconButton
                    icon={<BsPencilSquare />}
                    aria-label="Edit course"
                    rounded={"full"}
                    variant={'outlined'}
                  />
                </Link>
                <IconButton
                  icon={<BsTrash3 />}
                  aria-label="Delete course"
                  rounded={"full"}
                  variant={'red'}
                  onClick={onOpen}
                />
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent
                      border='1px solid black'
                      transform="translate(-.25rem, -.25rem)"
                      boxShadow=".25rem .25rem 0 black"
                    >
                      <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Eliminar contenido {content?.name}
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        ¿Estás seguro? No podrás revertir esta acción después.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancelar
                        </Button>
                        <Button colorScheme='red' onClick={onDelete} ml={3}>
                          Elimiar
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>
            }
          </HStack>
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
    </>
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
