import { Button } from "@chakra-ui/react";

export default function PrimaryButton({ children, ...buttonProps }) {
  return (
    <Button
      rounded={".25rem"}
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
    </Button>
  );
}
