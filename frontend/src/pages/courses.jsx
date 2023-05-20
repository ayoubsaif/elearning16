import { NextSeo } from "next-seo";
import { useEffect, useState, useRef } from "react";
import {
  Grid,
  GridItem,
  Center,
  SimpleGrid,
  Heading,
  Fade,
} from "@chakra-ui/react";

import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCourses } from "@/services/courses";

import Layout from "@/layout/Layout";
import CourseCard from "@/components/dataDisplay/courseCard";
import ChakraPagination from "@/components/pagination";
import CoursesLoading from "@/components/skeleton/CoursesLoading";

import { usePagination } from "@ajna/pagination";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

export default function Home(props) {
  const { siteConfig, menuItems } = props;
  const topRef = useRef(null);
  const [courses, setCourses] = useState();
  const [pagination, setPagination] = useState();
  const { pagesCount, currentPage, setCurrentPage, pages } = usePagination({
    pagesCount: pagination?.pagesCount,
    initialState: { currentPage: 1 },
  });
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  useEffect(() => {
    setLoading(true);
    let timeoutId;
    const fetchData = async () => {
      if (currentPage && accessToken) {
        const params = { currentPage };
        const data = await getCourses(accessToken, params);
        if (data && data.courses && data.pagination) {
          setCourses(data.courses);
          setPagination(data.pagination);
          setLoading(false);
        }
      }
    };
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
    timeoutId = setTimeout(fetchData, 200);
    return () => clearTimeout(timeoutId);
  }, [currentPage, accessToken]);

  return (
    <>
      <NextSeo
        title={`Cursos - ${siteConfig?.title}`}
        description={siteConfig?.description}
        canonical={siteConfig?.url}
        openGraph={{
          url: siteConfig?.url,
          title: siteConfig?.title,
          description: siteConfig?.description,
          images: [
            {
              url: siteConfig?.image,
              width: 800,
              height: 600,
              alt: siteConfig?.title,
            },
          ],
          site_name: siteConfig?.title,
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Heading as="h1" size="2xl" textAlign="center" my="1em">
          Cursos
        </Heading>
        {loading ? (
          <CoursesLoading />
        ) : courses ? (
          <Grid my="1em" ref={topRef}>
            <Fade in={!loading}>
              <GridItem my="1em" w={"full"}>
                <SimpleGrid columns={[1, 2, 2, 4]} spacing="20px">
                  {courses.map((course) => (
                    <CourseCard course={course} key={course?.id} />
                  ))}
                </SimpleGrid>
              </GridItem>
            </Fade>
            <Center>
              <Fade in={!loading}>
                <ChakraPagination
                  pages={pages}
                  currentPage={currentPage}
                  pagesCount={pagesCount}
                  setCurrentPage={setCurrentPage}
                />
              </Fade>
            </Center>
          </Grid>
        ) : (
          <p>No hay cursos</p>
        )}
      </Layout>
    </>
  );
}

// get static props with page info from backend
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
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
  return {
    props: {
      siteConfig: siteConfig,
      menuItems: menuItems,
    },
  };
}
