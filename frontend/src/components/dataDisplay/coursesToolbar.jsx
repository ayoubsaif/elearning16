        
import React, { useRef } from "react"
import {
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption ,
    IconButton,
    Button,
    MenuOptionGroup,
    Tooltip
} from "@chakra-ui/react";
import { BsFunnel, BsPlusLg, BsX } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchBar from "@/components/forms/searchInput";

export default function CoursesToolbar({categories, category, canCreate, searchBar, setSearchBar}) {
    const router = useRouter();
    const searchBarRef = useRef(null);

    const resetSearch = () => {
        setSearchBar(null);
        searchBarRef.current.setInputValue('');
    }

    return (
        <HStack spacing='24px' width={'100%'} justify={'space-between'}>
            <HStack spacing='24px'>
                <SearchBar searchBar={searchBar} setSearchBar={setSearchBar} ref={searchBarRef} />
                <Menu>
                    <Tooltip label='Filtrar' placement='bottom'>
                        <MenuButton as={IconButton} icon={<BsFunnel />} />
                    </Tooltip>
                    <MenuList>
                        <MenuOptionGroup defaultValue={category ? category?.slug : null} title='' type='radio'>
                            {categories.map((cat) => (
                                <MenuItemOption value={cat?.slug} key={cat?.id} onClick={() => router.push(cat?.name === category?.name ? '/courses' : `/courses/${cat?.slug}`)}>
                                    {cat?.name}
                                </MenuItemOption>
                            ))}
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
                {(category || searchBar) &&
                    <Tooltip label='Eliminar filtros' placement='bottom'>
                        <IconButton
                            aria-label="delete-filter"
                            icon={<BsX />}
                            onClick={resetSearch}
                        />
                    </Tooltip>
                }
            </HStack>
            {canCreate && 
                <HStack spacing='24px'>
                    <Link href="/course/create">
                        <Button
                            leftIcon={<BsPlusLg />}
                            variant="primary"
                            type="submit"
                        >
                            Crear curso
                        </Button>
                    </Link>
                </HStack>
            }
        </HStack>
    )
}