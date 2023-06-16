import { Textarea as ChakraTextarea } from "@chakra-ui/react";

export default function Textarea({ ...attributes }) {
  return (
    <ChakraTextarea
      {...attributes}
      rounded={"sm"}
      border={"1px"}
      borderColor="gray.100"
      _hover={{
        borderColor: "black",
        boxShadow: "0 0 0 1px brand.300",
      }}
      _focusWithin={{
        outline: "2px solid",
        outlineColor: "brand.100",
        outlineOffset: "0px",
      }}
    />
  );
}
