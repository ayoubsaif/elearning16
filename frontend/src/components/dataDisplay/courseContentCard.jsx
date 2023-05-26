
import React from "react";
import Link from "next/link";
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
  const { name, thumbnail_url, id, slug } = props;
  
  return (
    <Box
      rounded={"md"}
      overflow={"hidden"}
      bg="white"
      width={"100%"}
      border={"1px"}
      borderColor="black"
      transition="all .2s ease-in-out"
      _hover={{
        transform: `translate(-.25rem, -.25rem,)`,
        boxShadow: ".25rem .25rem 0 black",
      }}
    >
      <Link href={`/course/${slug}/content/${id}`}>
        <HStack spacing='5rem' >
          <AspectRatio width='100%' height='100%' ratio={16 / 9}>
            <Img
              src={thumbnail_url}
              roundedTop={".25em"}
              objectFit={"cover"}
              height='full'
              width='full'
              alt={"Blog Image"}
            />
          </AspectRatio>
          <Box p={4} m={0}>
            <Heading color={"black"} fontSize={"1xm"} noOfLines={1} lineHeight={2}>
              {name}
            </Heading>
          </Box>
        </HStack>
      </Link>
    </Box>
  );
}