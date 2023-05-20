import { Input as ChakraInput } from "@chakra-ui/react";

export default function Input({ ...attributes }) {
  return (
    <ChakraInput
        {...attributes}
        rounded={".25em"}
        border={"1px"}
        borderColor="gray.300"
        _hover={{
            borderColor: "black",
            boxShadow: "0 0 0 1px blue.300",
        }}
        _focusWithin={{
            outline: "2px solid",
            outlineColor: "blue.100",
            outlineOffset: "0px",
        }}
    />
  )
}
