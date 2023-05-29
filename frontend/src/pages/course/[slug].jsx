import { useRef } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  VStack,
  HStack,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  useBreakpointValue,
  Button,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { BsTrash3, BsPencilSquare, BsPlusLg } from "react-icons/bs";
import Layout from "@/layout/Layout";
import ContentCard from "@/components/dataDisplay/contentCard";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCourse, deleteCourse } from "@/services/courses";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Link from "next/link";

export default function CourseLandingPage(props) {
  const { siteConfig, menuItems, course } = props;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const router = useRouter();

  const { data: session } = useSession();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const onDelete = async () => {
    await deleteCourse(course?.id, session?.user?.accessToken);
    router.push("/courses");
  }

  return (
    <>
    <NextSeo
        title={`${course?.name} - ${siteConfig?.title}`}
        description={`${course?.description}`}
        canonical={`${siteConfig?.siteUrl}/course/${course?.slug}`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/course/${course?.slug}`,
          title: `${course?.name}`,
          description: `${course?.name}`,
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

            <BreadcrumbItem isCurrentPage>
              <Text>{course?.name}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <Box px={4} marginBottom={5} width={"full"}>
          <HStack spacing={4} mb={4}>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} my={4}>
              {course?.name}
            </Heading>
            {course?.canEdit &&
              <>
                <Link href={`/course/${router?.query?.slug}/edit`}>
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
                        Eliminar curso {course?.name}
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        ¿Estás seguro? No podrás revertir esta acción después.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancelar
                        </Button>
                        <Button colorScheme='red' onClick={onDelete} ml={3}>
                          Eliminar
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>
            }
          </HStack>
          {course?.create_uid &&
            <Text fontSize={{ base: "md", md: "lg" }} mb={4}>
              Creado por <strong>{course?.create_uid?.name}</strong>
            </Text>
          }
          <Flex direction={isMobile ? "column" : "row"} align="flex-start" mb={8}>
            <Box
              w={isMobile ? "full" : 400}
              h={isMobile ? "auto" : 225}
              bg="gray.200"
              rounded="md"
              overflow="hidden"
              mr={isMobile ? 0 : 4}
              mb={isMobile ? 4 : 0}
            >
              <Image
                src={course?.thumbnail}
                alt={course?.name}
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
            <VStack align="flex-start" spacing={4} mb={4} flex="1">
              <Text fontSize={{ base: "md", md: "lg" }}>{course?.description}</Text>
            </VStack>
          </Flex>

          <Box>
            <HStack spacing={4} mb={4}>
              <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} my={4}>
                Contenidos del curso
              </Heading>
              {course?.canEdit &&
                <Link href={`/course/${router?.query?.slug}/content/create`}>
                  <IconButton
                    icon={<BsPlusLg />}
                    aria-label="Create content"
                    rounded={"full"}
                    variant={'outlined'}
                  />
                </Link>
              }
            </HStack>
            <VStack spacing={5} maxWidth={'100%'}>
              {course?.courseContents?.map((content, i) => (
                <ContentCard
                  key={i}
                  slug={router?.query?.slug}
                  {...content}
                />
              ))}
            </VStack>
          </Box>
        </Box>
      </Layout>
    </>
  );
}


// get static props with page info from backend
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
  const course = await getCourse(query?.slug, session?.user?.accessToken);
  return {
    props: {
      siteConfig,
      menuItems,
      course,
    },
  };
}