import NextLink from "next/link";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Center,
  Spacer,
  ButtonGroup,
  StackDivider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { GrMenu, GrClose, GrDown, GrFormNextLink } from "react-icons/gr";
import { useSession, signIn, signOut } from "next-auth/react";

import MobileNav from "./navbar/MobileNav";

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
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <GrClose w={3} h={3} /> : <GrMenu w={5} h={5} />}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Center>
            <Text
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
              fontFamily={"heading"}
              color={useColorModeValue("gray.800", "white")}
            >
              Logo
            </Text>
          </Center>

          <Spacer />

          <Center>
            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav menuItems={menuItems} />
            </Flex>
          </Center>

          <Spacer />

          {session?.user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={ session?.user?.image }
                />
              </MenuButton>
              <MenuList alignItems={"center"}>
                <br />
                <Center>
                  <Avatar
                    size={"2xl"}
                    src={ session?.user?.image }
                  />
                </Center>
                <br />
                <Center>
                  <p>{session?.user?.name}</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem as={NextLink} href={"/profile"}>Perfil</MenuItem>
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
        <MobileNav menuItems={menuItems}/>
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({menuItems}) => {
  const linkColor = useColorModeValue("black", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {menuItems?.map((navItem) => (
        <Box key={navItem?.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                as={NextLink}
                href={navItem?.url ?? "#"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem?.label}
              </Link>
            </PopoverTrigger>

            {navItem?.children && (
              <PopoverContent
                borderColor="black"
                border={"1px"}
                boxShadow={".25em .25em 0 black"}
                bg={popoverContentBgColor}
                rounded={"sm"}
                minW={"sm"}
              >
                <Stack
                  p={2}
                  divider={
                    <StackDivider
                      border={"1px 0px"}
                      borderColor="black"
                      my={"0px"}
                    />
                  }
                >
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, url, subLabel }) => {
  return (
    <Link
      as={NextLink}
      href={url}
      role={"group"}
      display={"block"}
      p={4}
      rounded={"sm"}
      _hover={{ bg: useColorModeValue("green.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "green.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={GrFormNextLink} />
        </Flex>
      </Stack>
    </Link>
  );
};
