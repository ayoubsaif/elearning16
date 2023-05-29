import React from "react";
import { Button, Flex, Box, Spacer, Text, Divider } from "@chakra-ui/react";
import Link from "next/link";
import SearchBar from "@/components/forms/searchInput";
import { BsPlusLg } from "react-icons/bs";

export default function CoursesToolbar({ canCreate, searchBar, setSearchBar, totalItems }) {
  return (
    <Box w="full">
      <Flex
        alignItems="center"
        gap="2"
        width="full"
        direction={{ base: "column", md: "row" }}
      >
        <Box>
          <SearchBar searchBar={searchBar} setSearchBar={setSearchBar} />
        </Box>
        {canCreate && (
          <>
            <Spacer />
            <Box>
              <Link href="/course/create">
                <Button leftIcon={<BsPlusLg />} variant="primary" type="submit">
                  Crear curso
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Flex>
      <Text fontSize="md" w="full" color={"gray.500"} mt={2}>
        {totalItems} { totalItems == 1? "curso encontrado" : "cursos encontrados" }
      </Text>
      <Divider my={2} />
    </Box>
  );
}
