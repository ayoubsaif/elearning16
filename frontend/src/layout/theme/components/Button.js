const baseStyle = ({ colorMode }) => ({
  bg: colorMode === "dark" ? "gray.200" : "white",
  color: "black",
  rounded: "md",
  border: "1px",
});
const variants = {
  primary: ({ colorMode }) => ({
    color: "white",
    bg: "brand.300",
    _hover: {
      bg: "white",
      color: "black",
      transform: "translate(-.25rem, -.25rem)",
      boxShadow:
        colorMode === "dark"
          ? ".25rem .25rem 0 var(--chakra-colors-brand-300)"
          : ".25rem .25rem 0 black",
    },
    _active: {
      bg: "brand.400",
      color: "white",
      transform: "none",
      boxShadow: "none",
    },
  }),
  secondary: ({ colorMode }) => ({
    color: "black",
    bg: "white",
    _hover: {
      bg: "brand.400",
      boxShadow:
        colorMode === "dark"
          ? ".25rem .25rem 0 var(--chakra-colors-brand-300)"
          : ".25rem .25rem 0 black",
    },
    _active: {
      bg: "black",
    },
  }),
  outline: ({ colorMode }) => ({
    color: colorMode === "dark" ? "white" : "black",
    bg: colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.100",
    _hover: {
      bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300",
      transform: "none",
      boxShadow: "none",
    },
    _active: {
      color: "white",
      bg: colorMode === "dark" ? "blackAlpha.500" : "blackAlpha.500",
    },
  }),
  ghost: ({ colorMode }) => ({
    color: colorMode === "dark" ? "white" : "black",
    bg: colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.100",
    border: 0,
    _hover: {
      bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200",
      transform: "none",
      boxShadow: "none"
    },
    _active: {
      color: "white",
      bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.300",
    },
  }),
  transparent: ({ colorMode }) => ({
    color: colorMode === "dark" ? "white" : "black",
    bg: "transparent",
    border: 0,
    _hover: {
      bg: "transparent",
      transform: "none",
      boxShadow: "none",
    },
    _active: {
      bg: colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.100",
    },
  }),
  active: ({ colorMode }) => ({
    color: colorMode === "dark" ? "black" : "white",
    bg: colorMode === "dark" ? "white" : "black",
    _hover: {
      color: colorMode === "dark" ? "black" : "white",
      bg: colorMode === "dark" ? "white" : "black",
      transform: "none",
      boxShadow: "none",
    },
  }),
  red: {
    color: "black",
    bg: "red.100",
    _hover: {
      bg: "red.500",
      color: "white",
    },
    _active: {
      color: "white",
      bg: "red.400",
    },
  },
};

export const buttonTheme = {
  baseStyle,
  variants,
};
