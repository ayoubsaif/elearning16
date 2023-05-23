import NextLink from "next/link";
import {
  Box,
  Heading,
  Text,
  Img,
  Flex,
  AspectRatio,
  HStack,
} from "@chakra-ui/react";
import { BsArrowUpRight } from "react-icons/bs";

export default function CourseCard(props) {
  const { name, description, thumbnail_url, slug, id } = props.course;
  return (
    <Box
      w={"full"}
      width={"275px"}
      rounded={"md"}
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
        <AspectRatio maxW='400px' ratio={16 / 9}>
          <Img
            src={thumbnail_url}
            roundedTop={".25em"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </AspectRatio>
        <Box p={4} minHeight={"8em"} maxHeight="10em">
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
            h="4em"
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
