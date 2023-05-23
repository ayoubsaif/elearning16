import { Button as ChakraButton } from "@chakra-ui/react";

export default function Button({ children, ...buttonProps }) {
  return (
    <ChakraButton
      rounded={"md"}
      border={"1px"}
      borderColor="black"
      {...buttonProps}
      _hover={{
        ...buttonProps._hover,
        transform: `translate(-.25rem, -.25rem)`,
        boxShadow: ".25rem .25rem 0 black",
      }}
      _active={{
        ...buttonProps._active,
        transform: `none`,
        boxShadow: "none",
      }}
    >
      {children}
    </ChakraButton>
  );
}
