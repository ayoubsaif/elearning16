import { Center, Fade, Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import CourseCard from "@/components/dataDisplay/courseCard";
import ChakraPagination from "@/components/pagination";
import CoursesLoading from "@/components/skeleton/CoursesLoading";

export default function CoursesGrid({
  loading,
  courses,
  pages,
  currentPage,
  pagesCount,
  setCurrentPage,
  topRef,
}) {
  return (
    <>
      {loading ? (
        <CoursesLoading />
      ) : courses && courses.length > 0 ? (
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
    </>
  );
}
