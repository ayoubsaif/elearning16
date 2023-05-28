import { NextSeo } from "next-seo";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
import { getCourses, getCoursesFromServer } from "@/services/courses";
import { getCategories } from "@/services/category";
import CoursesToolbar from "@/components/dataDisplay/coursesToolbar";
import Layout from "@/layout/Layout";
import CourseCard from "@/components/dataDisplay/courseCard";
import ChakraPagination from "@/components/pagination";
import CoursesLoading from "@/components/skeleton/CoursesLoading";

import { usePagination } from "@ajna/pagination";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useRouter } from "next/router";

export default function Home(props) {
  const { siteConfig, menuItems, coursesData, paginationData, categories, canCreate, params } = props;
  const { page, search } = params;
  const router = useRouter();
  const topRef = useRef(null);
  const [courses, setCourses] = useState(coursesData);
  const [pagination, setPagination] = useState(paginationData);
  const [searchParams, setSearchParams] = useState(search);
  const [searchBar, setSearchBar] = useState(search);
  const { pagesCount, currentPage, setCurrentPage, pages } = usePagination({
    pagesCount: pagination?.pagesCount,
    initialState: { currentPage: page || 1 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId;
    
    console.log(searchBar);
    const fetchData = async () => {
      if (currentPage) {
        const params = {};
        if (currentPage && currentPage != 1){params.page = currentPage};
        if (searchParams){params.search = searchParams};
        if (searchBar){params.search = searchBar}
        const data = await getCourses(params);
        if (data && data.courses && data.pagination) {
          setCourses(data.courses);
          setPagination(data.pagination);
          setLoading(false);

          router.replace({
            pathname: router.pathname,
            query: { ...params },
          });
        }
      }
    };
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setLoading(true);
    timeoutId = setTimeout(fetchData, 200);
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchBar, searchParams]);

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
        <Heading as="h1" size="2xl" textAlign="center" my={2}>
          Cursos
        </Heading>
        <CoursesToolbar categories={categories} canCreate={canCreate} searchBar={searchBar} setSearchBar={setSearchBar} setSearchParams={setSearchParams}/>
        {loading ? (
          <CoursesLoading />
        ) : courses ? (
          <Grid my="1em" ref={topRef}>
            <Fade in={!loading}>
              <GridItem my="1em" w={"full"}>
                <Center>
                  <SimpleGrid columns={[1, 2, 2, 4]} spacing="20px">
                    {courses.map((course) => (
                      <CourseCard course={course} key={course?.id} />
                    ))}
                  </SimpleGrid>
                </Center>
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
  const menuItems = await getMenuItems(session?.user?.accessToken);
  const categories = await getCategories(session?.user?.accessToken);

  const { page, search } = query;
  const params = {
    page: parseInt(page) || 1,
    search: search || null,
  };

  const coursesItems = await getCoursesFromServer(
    session?.user?.accessToken,
    params
  );

  return {
    props: {
      categories,
      siteConfig,
      menuItems,
      coursesData: coursesItems?.courses || [],
      paginationData: coursesItems?.pagination || {},
      canCreate: coursesItems?.canCreate || false,
      params,
    },
  };
}
