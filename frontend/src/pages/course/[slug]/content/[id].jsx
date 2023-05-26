import {
  Box,
  Text,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  AspectRatio
} from "@chakra-ui/react";
import Link from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import Layout from "@/layout/Layout";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCourseContentById } from "@/services/courses";
import { useRouter } from 'next/router'
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'


export default function Home(props ) {
  const { siteConfig, menuItems, content } = props;
  const createdDate = formatDistanceToNow(new Date(content?.create_date), {locale: es})

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
            <Link href={`/courses/${content?.course?.slug}`}>
              <Text>{content?.course?.name}</Text>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <Text>{content?.name}</Text>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>

      <Box px={4} marginBottom={5}>
        <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} my={4}>
          {content?.name}
        </Heading>
        <Box paddingTop={10}>
          <AspectRatio maxW='100%' ratio={16/9}>
            <iframe
              title={content?.name}
              src={content?.iframe}
              allowFullScreen
            />
          </AspectRatio>
          <Text paddingTop={10}>
            Publicado hace {createdDate} {content?.create_uid?.name && `por ${content?.create_uid?.name}`}
          </Text>
          <Text paddingTop={10} paddingBottom={10}>
            {content?.description}
          </Text>
        </Box>
      </Box>
    </Layout>
  )
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
  const content = await getCourseContentById(query?.id, session?.user?.accessToken);
  return {
    props: {
      siteConfig,
      menuItems,
      content,
    },
  };
}