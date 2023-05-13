import {
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Pagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";

export default function ChakraPagination(props) {
  const { pages, currentPage, setCurrentPage, pagesCount } = props;

  return (
    <Pagination
      pagesCount={pagesCount}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      <PaginationContainer>
        <PaginationPrevious
          rounded={'sm'}
          bg="white"
          border={'1px'}
          borderColor="black"
          boxShadow={useColorModeValue('6px 6px 0 black', '6px 6px 0 cyan')}
        >Atras</PaginationPrevious>
        <PaginationPageGroup spacing={4}>
          {pages.map((page) => (
            <PaginationPage
              _hover={{ bg: 'gray.100' }}
              _current={{
                w: 7,
                bg: "black",
                color: "white",
                fontSize: "sm",
                _hover: {
                  bg: "gray.300",
                  color: "black",
                },
              }}
              w="m"
              rounded={'sm'}
              bg="white"
              border={'1px'}
              px={4}
              mx={[0, 2]}
              key={`pagination_page_${page}`} 
              page={page} />
          ))}
        </PaginationPageGroup>
        <PaginationNext
          rounded={'sm'}
          bg="white"
          border={'1px'}
          borderColor="black"
          boxShadow={useColorModeValue('6px 6px 0 black', '6px 6px 0 cyan')}
        >Siguiente</PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
}
