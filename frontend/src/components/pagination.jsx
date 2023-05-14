import { useColorModeValue } from "@chakra-ui/react";
import {
  Pagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { BsArrowLeft, BsIndent, BsArrowRight } from "react-icons/bs";
import { isMobile } from "react-device-detect";

export default function ChakraPagination(props) {
  const { pages, currentPage, setCurrentPage, pagesCount } = props;
  let pagesToShow = isMobile ? 3 : 9;
  let start = currentPage - 2;
  let maxPages = start + pagesToShow;

  console.log(maxPages);
  if (maxPages > pagesCount) {
    maxPages = pagesCount;
    start = Math.max(maxPages - pagesToShow, 1);
  } else if (start < 1) {
    start = 1;
    maxPages = Math.min(start + pagesToShow, pagesCount);
  }

  const hasFirst = start > 1;
  const hasLast = maxPages < pagesCount;

  return (
    <Pagination
      pagesCount={pagesCount}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      <PaginationContainer>
        <PaginationPrevious
          rounded={".25rem"}
          border={"1px"}
          borderColor="black"
          bg="white"
          _hover={{
            transform: `translate(-.25rem, -.25rem)`,
            boxShadow: ".25rem .25rem 0 black",
          }}
          _active={{
            transform: `none`,
            boxShadow: "none",
          }}
          mr=".50em"
        >
          {isMobile ? (
              <BsArrowLeft />
          ) : (
            <>
              <BsArrowLeft />
              {"Atras"}
            </>
          )}
        </PaginationPrevious>
        <PaginationPageGroup spacing={2} alignItems={"center"}>
          {hasFirst && (
            <>
              <PaginationPage
                minWidth="2.5em"
                rounded={".25rem"}
                border={"1px"}
                borderColor="black"
                bg="white"
                _hover={{
                  transform: `translate(-.25rem, -.25rem)`,
                  boxShadow: ".25rem .25rem 0 black",
                }}
                _active={{
                  transform: `none`,
                  boxShadow: "none",
                }}
                _current={{
                  w: 7,
                  bg: "blue.300",
                  color: "white",
                  _hover: {
                    bg: "blue.500",
                    color: "white",
                  },
                }}
                key="pagination_page_first"
                page={1}
              />
              <BsIndent />
            </>
          )}
          {pages.slice(start - 1, maxPages).map((page) => (
            <PaginationPage
              minWidth="2.5em"
              rounded={".25rem"}
              border={"1px"}
              borderColor="black"
              bg="white"
              _hover={{
                transform: `translate(-.25rem, -.25rem)`,
                boxShadow: ".25rem .25rem 0 black",
              }}
              _active={{
                transform: `none`,
                boxShadow: "none",
              }}
              _current={{
                w: 7,
                bg: "blue.300",
                color: "white",
                _hover: {
                  bg: "blue.500",
                  color: "white",
                },
              }}
              key={`pagination_page_${page}`}
              page={page}
            />
          ))}
          {hasLast && (
            <>
              <BsIndent />
              <PaginationPage
                minWidth="2.5em"
                rounded={".25rem"}
                border={"1px"}
                borderColor="black"
                bg="white"
                _hover={{
                  transform: `translate(-.25rem, -.25rem)`,
                  boxShadow: ".25rem .25rem 0 black",
                }}
                _active={{
                  transform: `none`,
                  boxShadow: "none",
                }}
                _current={{
                  w: 7,
                  bg: "blue.300",
                  color: "white",
                  _hover: {
                    bg: "blue.500",
                    color: "white",
                  },
                }}
                key="pagination_page_last"
                page={pagesCount}
              />
            </>
          )}
        </PaginationPageGroup>
        <PaginationNext
          rounded={".25rem"}
          border={"1px"}
          borderColor="black"
          bg="white"
          _hover={{
            transform: `translate(-.25rem, -.25rem)`,
            boxShadow: ".25rem .25rem 0 black",
          }}
          _active={{
            transform: `none`,
            boxShadow: "none",
          }}
          ml=".50em"
        >
          {isMobile ? (
            <BsArrowRight />
          ) : (
            <>
              {"Siguiente"}
              <BsArrowRight />
            </>
          )}
        </PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
}
