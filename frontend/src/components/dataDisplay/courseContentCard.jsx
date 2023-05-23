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

export default function CourseContentCard(props) {
  const { name, thumbnail_url, id } = props;
  return (
    <Box
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
      <NextLink href={`/course/content/${id}`}>
        <AspectRatio maxW='200px' ratio={16 / 9}>
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
        </Box>
      </NextLink>
    </Box>
  );
}
