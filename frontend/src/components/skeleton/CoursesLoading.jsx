import {
  Grid,
  GridItem,
  SimpleGrid,
  Skeleton,
  Box,
  Flex,
  AspectRatio,
  HStack,
  SkeletonText,
  SkeletonCircle,
} from "@chakra-ui/react";

export default function CoursesLoading() {
  return (
    <Grid my="1em">
      <GridItem my="1em" w={"full"}>
        <SimpleGrid columns={[1, 2, 2, 4]} spacing="20px">
          {Array.from({ length: 12 }, (_, index) => (
            <SkeletonCard key={index}/>
          ))}
        </SimpleGrid>
      </GridItem>
    </Grid>
  );
}

const SkeletonCard = () => {
  return (
    <Box
      w={"full"}
      width={"275px"}
      rounded={".25em"}
      overflow={"hidden"}
      bg="white"
      border={"1px"}
      borderColor="gray.400"
      transition="all .2s ease-in-out"
    >
      <AspectRatio maxW="400px" ratio={16 / 9}>
        <Skeleton
          roundedTop={".25em"}
          h="full"
          w="full"
          height={"50px"}
          width={"full"}
        />
      </AspectRatio>
      <Box p={4} minHeight={"8em"} maxHeight="10em">
        <SkeletonText mt="4" noOfLines={1} skeletonHeight="4" />
        <SkeletonText mt="4" noOfLines={2} skeletonHeight="2" />
      </Box>
      <HStack borderTop={"1px"} color="gray.400">
        <Flex
          p={4}
          alignItems="center"
          justifyContent={"space-between"}
          roundedBottom={"sm"}
          cursor={"pointer"}
          w="full"
          h="4em"
        >
          <Skeleton
            h="full"
            w="full"
            height={"20px"}
            width={"80%"}
          />
          <SkeletonCircle size="10" />
        </Flex>
      </HStack>
    </Box>
  );
};
