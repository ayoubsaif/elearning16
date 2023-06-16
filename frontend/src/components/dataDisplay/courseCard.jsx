import NextLink from "next/link";
import {
  Box,
  Heading,
  Text,
  Img,
  AspectRatio,
  Card
} from "@chakra-ui/react";

export default function CourseCard(props) {
  const { name, description, thumbnail, slug, id } = props.course;
  return (
    <Card
      w={"full"}
      width={"275px"}
      variant="outline"
    >
      <NextLink href={`/course/${slug}-${id}`}>
        <AspectRatio maxW='500px' ratio={16 / 9}>
          <Img
            src={thumbnail}
            roundedTop={".25em"}
            objectFit="cover"
            h="full"
            w="full"
            alt={"Blog Image"}
          />
        </AspectRatio>
        <Box p={4} minHeight={"8em"} maxHeight="10em">
          <Heading color={"inherit"} fontSize={"2xl"} noOfLines={1} lineHeight={1.5}>
            {name}
          </Heading>
          <Text color={"gray.500"} noOfLines={2}>
            {description}
          </Text>
        </Box>
      </NextLink>
    </Card >
  );
}
