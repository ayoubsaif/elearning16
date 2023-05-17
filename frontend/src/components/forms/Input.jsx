import React from 'react'
import { Input } from "@chakra-ui/react";

export default function PrimaryInput({ ...attributes }) {
  return (
    <Input
        {...attributes}
        rounded={"sm"}
        border={"1px"}
        borderColor="black"
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
