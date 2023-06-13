import React, { useRef, forwardRef, useImperativeHandle } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
  CloseButton,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const SearchBar = forwardRef((props, ref) => {
  const { searchBar, setSearchBar } = props;
  const inputRef = useRef(null);

  const handleSearch = () => {
    const searchTerm = inputRef.current.value;
    setSearchBar(searchTerm); // Trigger the search request to the backend
  };

  // Expose inputRef to the parent component using useImperativeHandle
  useImperativeHandle(ref, () => ({
    setInputValue: (value) => {
      inputRef.current.value = value;
    },
  }));

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setSearchContent(searchTerm);
    inputRef.current.value = e.target.value;
  };

  const handleReset = () => {
    setSearchBar(null);
    inputRef.current.value = null;
  };

  return (
    <>
      <Box width={300}>
        <HStack>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Buscar cursos..."
              ref={inputRef}
              onKeyDown={handleKeyDown}
            />
            <InputRightElement>
              {searchBar && <CloseButton size="sm" onClick={handleReset} />}
            </InputRightElement>
          </InputGroup>
          <Button variant={"outline"} onClick={handleSearch}>
            Buscar
          </Button>
        </HStack>
      </Box>
    </>
  );
});

export default SearchBar;
