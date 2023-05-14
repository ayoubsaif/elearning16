import { NextSeo } from "next-seo";
import { useEffect, useState, useRef } from "react";
import { Inter } from "next/font/google";
import { Grid, GridItem, Center, SimpleGrid, Heading } from "@chakra-ui/react";

import { getSiteConfig } from "@/services/siteConfig";
import { getCourses } from "@/services/courses";

import Layout from "@/components/layout/Layout";
import CourseCard from "@/components/dataDisplay/courseCard";
import ChakraPagination from "@/components/pagination";

import { usePagination } from "@ajna/pagination";

export default function Home(props) {
  const { siteConfig } = props;
  const topRef = useRef(null);
  const [courses, setCourses] = useState();
  const [pagination, setPagination] = useState();
  const { pagesCount, currentPage, setCurrentPage, pages } = usePagination({
    pagesCount: pagination?.pagesCount,
    initialState: { currentPage: 1 },
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCourses(currentPage);
      setCourses(data.courses);
      setPagination(data.pagination);
    };
    if (topRef.current){
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
    fetchData();
  }, [currentPage]);

  return (
    <>
      <NextSeo
        title={siteConfig?.title}
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
        twitter={{
          handle: siteConfig?.twitter,
          site: siteConfig?.twitter,
          cardType: "summary_large_image",
        }}
      />
      <Layout>
          <Heading as="h1" size="2xl" textAlign="center" my="1em">
            Cursos
          </Heading>
          {courses ? (
            <Grid my="2em" ref={topRef}>
              <GridItem my="1em" w={"full"}>
                <SimpleGrid columns={[1, 2, 2, 4]} spacing='20px'>
                  {courses.map((course) => (
                      <CourseCard course={course} key={course?.id}/>
                  ))}
                </SimpleGrid>
              </GridItem>
              <Center>
                <ChakraPagination
                  pages={pages}
                  currentPage={currentPage}
                  pagesCount={pagesCount}
                  setCurrentPage={setCurrentPage}
                />
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
export async function getStaticProps() {
  const siteConfig = await getSiteConfig();
  return {
    props: {
      siteConfig: siteConfig,
    },
  };
}
