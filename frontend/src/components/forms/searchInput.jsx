import React, { useRef } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

export default function SearchBar(props){
    const { setSearchBar } = props;
    const searchRef = useRef(null);

    const handleSearch = () => setSearchBar(searchRef.current.value);

    return (
        <>
            <InputGroup borderRadius={5} size="md" width={300} height={'100%'}>
                <InputLeftElement
                    pointerEvents="none"
                    children={<Search2Icon color="gray.600" />}
                />
                <Input type="text" placeholder="Busca lo que necesites..." borderRightRadius={0} borderLeftRadius={'.25rem'} ref={searchRef}/>
                <InputRightAddon
                    p={0}
                    border="none"
                >
                    <Button size="md" borderLeftRadius={0} borderRightRadius={'.25rem'} onClick={handleSearch}>
                        Search
                    </Button>
                </InputRightAddon>
            </InputGroup>
        </>
    );
};