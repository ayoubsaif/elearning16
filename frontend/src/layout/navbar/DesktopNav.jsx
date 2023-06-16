import NextLink from "next/link";

import {
  Box,
  Flex,
  Text,
  Icon,
  Link,
  useColorModeValue,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  StackDivider,
} from "@chakra-ui/react";

import { GrFormNextLink } from "react-icons/gr";

export const DesktopNav = ({ menuItems }) => {
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
                      borderColor="gray.200"
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

export const DesktopSubNav = ({ label, url, subLabel }) => {
  return (
    <Link
      as={NextLink}
      href={url}
      role={"group"}
      display={"block"}
      p={4}
      rounded={"sm"}
      _hover={{ bg: useColorModeValue("brand.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "brand.400" }}
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
          <Icon color={"brand.400"} w={5} h={5} as={GrFormNextLink} />
        </Flex>
      </Stack>
    </Link>
  );
};
