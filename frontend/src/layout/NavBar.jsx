import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Flex,
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
  Slide 
} from "@chakra-ui/react";

import { BsList as MenuIcon, BsXLg as CloseIcon } from "react-icons/bs";
import { useSession, signIn, signOut } from "next-auth/react";

import MobileNav from "./navbar/MobileNav";
import { DesktopNav } from "./navbar/DesktopNav";
import ProfileMenu from "./navbar/ProfileMenu";
import useScrollListener from "@/hooks/useScrollListener";

export default function NavBar({ siteConfig, menuItems }) {
  const { isOpen, onToggle } = useDisclosure();
  const { data: session } = useSession();

  const scroll = useScrollListener();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (scroll.lastY === scroll.y) { // this fixes the trembling
      return;
    }
    if (scroll.y > 50 && scroll.y - scroll.lastY > 0) {
      return setVisible(false);
    }
    return setVisible(true);
  }, [scroll.y, scroll.lastY]);

  return (
    <Slide direction='top' in={visible} style={{ zIndex: 10 }}>
      <Box w="full">
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
          minH={"60px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          align={"center"}
        >
          <Flex
            flex={{ base: 1 }}
            justify={{ base: "center", md: "start" }}
            alignItems={"center"}
          >
            <Flex display={{ base: "flex", md: "none" }}>
              <IconButton
                onClick={onToggle}
                color={useColorModeValue("black", "white")}
                icon={isOpen ? <CloseIcon w={5} h={5} /> : <MenuIcon w={5} h={5} />}
                variant="transparent"
                aria-label={"Toggle Navigation"}
              />
            </Flex>

            <Spacer display={{ base: "block", md: "none" }} />

            <Center>
              <Link
                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                fontFamily={"heading"}
                color={useColorModeValue("gray.800", "white")}
                as={NextLink}
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
              <ProfileMenu session={session} signOut={signOut} />
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
    </Slide >
  );
}