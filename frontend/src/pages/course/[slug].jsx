import {
  Box,
  Text,
  Link,
  Flex,
  Image,
  VStack,
  HStack,
  Heading,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  useBreakpointValue,
  Grid,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

import Layout from "@/layout/Layout";
import Button from "@/components/forms/Button";
import CourseContentCard from "@/components/dataDisplay/CourseContentCard";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCourse } from "@/services/courses";
import NextLink from "next/link";

export default function CourseLandingPage(props) {
  const { siteConfig, menuItems, course } = props;

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Layout siteConfig={siteConfig} menuItems={menuItems}>
      <Flex direction="column" align="flex-start" my={4}>
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <NextLink href="/" passHref>
              <BreadcrumbLink>Inicio</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <NextLink href="/courses" passHref>
              <BreadcrumbLink>Cursos</BreadcrumbLink>
            </NextLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{course?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>

      <Box px={4}>
        <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} my={4}>
          {course?.name}
        </Heading>

        <Text fontSize={{ base: "md", md: "lg" }} mb={4}>
          Creado por <strong>{course?.teacher?.name}</strong>
        </Text>

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
              src={course?.thumbnail_url}
              alt={course?.name}
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>

          <VStack align="flex-start" spacing={4} mb={4} flex="1">
            <Text fontSize={{ base: "md", md: "lg" }}>{course?.description}</Text>

            <Button>Enroll Now</Button>
          </VStack>
        </Flex>

        <Box>
          <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} my={4}>
            Course Contents
          </Heading>

          {course?.courseContents?.map((content) => (
            <CourseContentCard key={content?.id} {...content} />
          ))}
        </Box>
      </Box>
    </Layout>
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
