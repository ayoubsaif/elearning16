import NextLink from "next/link";
import {
  Box,
  Heading,
  Text,
  Img,
  Flex,
  Center,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { BsArrowUpRight } from "react-icons/bs";

export default function CourseCard(props) {
  const { name, description, thumbnail_url, slug, id } = props.course;
  return (
    <Box
      w={"full"}
      minWidth={"250px"}
      rounded={"sm"}
      overflow={"hidden"}
      bg="white"
      border={"1px"}
      borderColor="black"
      transition="all .2s ease-in-out"
      _hover={{
        transform: `translate(-.25rem, -.25rem,)`,
        boxShadow: ".25rem .25rem 0 black",
      }}
    >
      <NextLink href={`/course/${slug}-${id}`}>
        <Box h={"200px"} borderBottom={"1px"} borderColor="black">
          <Img
            src={thumbnail_url}
            roundedTop={"sm"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </Box>
        <Box p={4}>
          <Heading color={"black"} fontSize={"2xl"} noOfLines={1}>
            {name}
          </Heading>
          <Text color={"gray.500"} noOfLines={2}>
            {description}
          </Text>
        </Box>
        <HStack borderTop={"1px"} color="black">
          <Flex
            p={4}
            alignItems="center"
            justifyContent={"space-between"}
            roundedBottom={"sm"}
            cursor={"pointer"}
            w="full"
          >
            <Text fontSize={"md"} fontWeight={"semibold"}>
              Ver más
            </Text>
            <BsArrowUpRight />
          </Flex>
        </HStack>
      </NextLink>
    </Box>
  );
}
