import { useBreakpointValue, useStyleConfig  } from "@chakra-ui/react";
import {
  Pagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import {
  BsArrowLeft,
  BsUnindent,
  BsIndent,
  BsArrowRight,
} from "react-icons/bs";
import { isMobile } from "react-device-detect";

export default function ChakraPagination(props) {
  const { pages, currentPage, setCurrentPage, pagesCount } = props;
  const pagesToShow = isMobile || useBreakpointValue({ base: true, md: false }) ? 4 : 9;
  
  let start = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
  let end = start + pagesToShow - 1;
  
  if (end > pagesCount) {
    end = pagesCount;
    start = Math.max(end - pagesToShow + 1, 1);
  }
  
  const pageRange = pages.slice(start - 1, end);
  const hasFirst = start > 1;
  const hasLast = end < pagesCount;

  const outlineButton = useStyleConfig('Button', { variant: "outline" })
  const activeButton = useStyleConfig('Button', { variant: "active" })
  return (
    <Pagination
      pagesCount={pagesCount}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      <PaginationContainer>
        <PaginationPrevious display={useBreakpointValue({ base: "none", md: "block"})} mr=".50em" __css={outlineButton}>
          <BsArrowLeft />
        </PaginationPrevious>
        <PaginationPageGroup spacing={2} alignItems={"center"}>
          {hasFirst && (
            <>
              <PaginationPage
                minWidth="2.5em"
                __css={outlineButton}
                _current={{
                  __css: activeButton,
                }}
                key="pagination_page_first"
                page={1}
              />
              <BsUnindent />
            </>
          )}
          {pages.slice(start - 1, end).map((page) => (
            <PaginationPage
              variant="transparent"
              minWidth="2.5em"
              __css={outlineButton}
              _current={{
                __css: activeButton,
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
                __css={outlineButton}
                _current={{
                  __css: activeButton,
                }}
                key="pagination_page_last"
                page={pagesCount}
              />
            </>
          )}
        </PaginationPageGroup>
        <PaginationNext display={useBreakpointValue({ base: "none", md: "block"})} ml=".50em" __css={outlineButton}>
          <BsArrowRight />
        </PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
}
