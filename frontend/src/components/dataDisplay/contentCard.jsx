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
  Stack,
} from "@chakra-ui/react";

export default function ContentCard(props) {
  const { name, description, thumbnail, id, slug } = props;

  return (
    <>
      {name && thumbnail && id && slug && (
        <Box
          rounded={"md"}
          overflow={"hidden"}
          bg="white"
          width={"100%"}
          border={"1px"}
          borderColor="black"
          transition="all .2s ease-in-out"
          _hover={{
            transform: "translate(-.25rem, -.25rem)",
            boxShadow: ".25rem .25rem 0 black",
          }}
        >
          <Link href={`/course/${slug}/content/${id}`}>
            <HStack spacing={2}>
              <AspectRatio height="100%" minWidth={"160px"} ratio={16 / 9}>
                <Img
                  src={thumbnail}
                  objectFit={"cover"}
                  height="full"
                  width="full"
                  alt={"Blog Image"}
                />
              </AspectRatio>
              <Stack spacing={1} width={"full"} p={2}>
                <Box>
                  <Heading
                    color={"black"}
                    fontSize={"1xm"}
                    noOfLines={1}
                    lineHeight={1.5}
                  >
                    {name}
                  </Heading>
                  <Text
                    color={"gray.500"}
                    fontSize={"sm"}
                    noOfLines={1}
                  >
                    {description}
                  </Text>
                </Box>
              </Stack>
            </HStack>
          </Link>
        </Box>
      )}
    </>
  );
}
