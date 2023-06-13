import React from "react";
import {
  AspectRatio,
  Box,
  Center,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { BsPencilSquare, BsBoxArrowInDown } from "react-icons/bs";

export default function ImageDragAndDrop({
  course,
  handleImageChange,
  isDraggingOver,
  setIsDraggingOver,
  handleDrop,
}) {
  return (
    <AspectRatio
      ratio={16 / 9}
      flexShrink={0}
      overflow="hidden"
      rounded="md"
      border={isDraggingOver ? "2px dashed black" : "2px solid transparent"}
    >
      <Box textAlign="center" position="relative" onDrop={handleDrop}>
        {course?.thumbnail ? (
          <Image
            name={course?.name}
            src={course?.thumbnail}
            bg="black"
            objectFit="cover"
            borderRadius="md"
            alt={course?.name}
          />
        ) : (
          <Box bg="gray.200" height="full" w="full" />
        )}
        <Box
          position="absolute"
          inset={4}
          display="flex"
          alignItems="end"
          justifyContent="end"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
          }}
          onDragLeave={() => setIsDraggingOver(true)}
          bg={isDraggingOver ? "blackAlpha.300" : "blackAlpha.100"}
        >
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <Text
              color="white"
              textShadow="0 0 10px black"
              textAlign="center"
              fontWeight={600}
            >
              Arrastre y suelte su imagen aquí
            </Text>
            <Center>
              <BsBoxArrowInDown />
            </Center>
          </Box>
          <input
            id="thumbnail"
            name="thumbnail"
            style={{ display: "none" }}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
          />
          <IconButton
            icon={<BsPencilSquare />}
            aria-label="Change Image"
            rounded="full"
            variant="outlined"
            display={isDraggingOver ? "none" : "inherit"}
            onClick={() => document.getElementById("thumbnail").click()}
          />
        </Box>
      </Box>
    </AspectRatio>
  );
}
