import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import {
  Heading,
} from "@chakra-ui/react";
import { usePagination } from "@ajna/pagination";

import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCoursesByCategory, getCoursesFromServer } from "@/services/courses";

import Layout from "@/layout/Layout";
import CoursesGrid from "@/components/courses/CoursesGrid";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

export default function Home(props) {
  const { siteConfig, menuItems, coursesData, paginationData, params, category } = props;
  const { page, search } = params;
  const router = useRouter();
  const topRef = useRef(null);
  const [courses, setCourses] = useState(coursesData);
  const [pagination, setPagination] = useState(paginationData);
  const { pagesCount, currentPage, setCurrentPage, pages } = usePagination({
    pagesCount: pagination?.pagesCount,
    initialState: { currentPage: page || 1 },
  });
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    let timeoutId;
    
    const fetchData = async () => {
      if (currentPage && router.query.slug && session?.user?.accessToken) {
        const params = {};
        if (currentPage !== 1) {
          params.page = currentPage;
        }
        if (search) {
          params.search = search;
        }
        
        const data = await getCoursesByCategory(router.query.slug, session?.user?.accessToken, params);
        
        if (data && data.courses && data.pagination) {
          setCourses(data.courses);
          setPagination(data.pagination);
          setLoading(false);
          
          router.replace({
            pathname: router.pathname,
            query: { ...router.query, ...params },
          });
        }
      }
    };
  
    const scrollIntoView = () => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
  
    const fetchDataWithDelay = () => {
      timeoutId = setTimeout(fetchData, 200);
    };
  
    scrollIntoView();
    fetchDataWithDelay();
  
    return () => clearTimeout(timeoutId);
  }, [currentPage, router.query.slug, session?.user?.accessToken]);

  return (
    <>
      <NextSeo
        title={`Cursos de ${category?.name} - ${siteConfig?.title}`}
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
        <Heading as="h1" size="2xl" textAlign="center" my={4}>
          Cursos de {category?.name}
        </Heading>
        <CoursesGrid 
          loading={loading}
          courses={courses}
          pages={pages}
          currentPage={currentPage}
          pagesCount={pagesCount}
          setCurrentPage={setCurrentPage}
          topRef={topRef}
        />
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

  const { page, search, slug } = query;
  const params = {
    page: parseInt(page) || 1,
    search: search || null,
  };

  const coursesItems = await getCoursesByCategory(
    slug,
    session?.user?.accessToken,
    params
  );

  if (!coursesItems) {
    // Handle the 404 error and redirect to a 404 page
    return {
      notFound: true,
    };
  }

  return {
    props: {
      siteConfig,
      menuItems,
      coursesData: coursesItems?.courses || [],
      category: coursesItems?.category || null,
      paginationData: coursesItems?.pagination || {},
      params,
    },
  };
}
