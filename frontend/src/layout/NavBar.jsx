import NextLink from "next/link";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Collapse,
  Link,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Center,
  Spacer,
  ButtonGroup,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";

import { GrMenu, GrClose } from "react-icons/gr";
import { useSession, signIn, signOut } from "next-auth/react";

import MobileNav from "./navbar/MobileNav";
import { DesktopNav } from "./navbar/DesktopNav";

export default function NavBar({ siteConfig, menuItems }) {
  const { isOpen, onToggle } = useDisclosure();
  const { data: session } = useSession();

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"black"}
        align={"center"}
      >
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }} alignItems={"center"}>
          <Flex display={{ base: "flex", md: "none" }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <GrClose w={3} h={3} /> : <GrMenu w={5} h={5} />}
              variant={"ghost"}
              border={0}
              aria-label={"Toggle Navigation"}
            />
          </Flex>

          <Spacer display={{ base: "block", md: "none" }} />

          <Center>
            <Link
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
              fontFamily={"heading"}
              color={useColorModeValue("gray.800", "white")}
              href={"/"}
            >
              {siteConfig?.title}
            </Link>
          </Center>

          <Spacer />

          <Flex display={{ base: "none", md: "flex" }}>
            <Center>
              <DesktopNav menuItems={menuItems} />
            </Center>
          </Flex>

          <Spacer display={{ base: "none", md: "flex" }} />

          {session?.user ? (
            <Menu>
              <MenuButton
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
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
                bg="white"
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
                <MenuItem as={NextLink} href={"/profile"}>
                  Perfil
                </MenuItem>
                <MenuItem onClick={() => signOut()}>Cerrar sesión</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <ButtonGroup gap="2">
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
                onClick={() => signIn()}
              >
                Iniciar sesión
              </Button>
              <Button
                as={"a"}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                href={"/auth/register"}
                _hover={{
                  bg: "pink.300",
                }}
              >
                Registrarse
              </Button>
            </ButtonGroup>
          )}
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav menuItems={menuItems} />
      </Collapse>
    </Box>
  );
}
