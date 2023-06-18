import React from "react";
import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuList,
  MenuItem,
  MenuDivider,
  Flex,
  Avatar,
  Text,
  Box,
  Center,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function ProfileMenu({ session, signOut }) {
  return (
    <Menu>
      <MenuButton rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
        <Flex direction={"row"} align={"center"} p={2}>
          <Avatar size={"sm"} src={session?.user?.image} />
          <Text ml={2} display={{ base: "none", md: "flex" }}>
            {session?.user?.firstname}
          </Text>
        </Flex>
      </MenuButton>
      <MenuList
        rounded={".25em"}
        overflow={"hidden"}
        border={"1px"}
        borderColor="black"
        boxShadow={".25rem .25rem 0 black"}
        alignItems={"center"}
      >
        <Flex direction={"row"} align={"center"} p={2}>
          <Center>
            <Avatar size={"lg"} src={session?.user?.image} />
          </Center>
          <Box>
            <Text ml={2}>{session?.user?.name}</Text>
            <Text
              ml={2}
              fontSize={"sm"}
              color={"gray.500"}
            >{`@${session?.user?.username}`}</Text>
          </Box>
        </Flex>
        <MenuDivider />
        {session?.user?.role === "admin" && (
          <MenuGroup title="Admin">
            <MenuItem as={NextLink} href={"/admin/users"}>
              Usuarios
            </MenuItem>
            <MenuItem as={NextLink} href={"/admin/config"}>
              Configuración
            </MenuItem>
          </MenuGroup>
        )}
        <MenuGroup title="Perfil">
          <MenuItem as={NextLink} href={"/profile"}>
            Cuenta
          </MenuItem>
          <MenuItem onClick={() => signOut()}>Cerrar sesión</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
