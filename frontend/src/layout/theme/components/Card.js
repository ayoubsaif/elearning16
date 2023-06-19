import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const variants = {
  outline: definePartsStyle(({ colorMode }) => ({
    container: {
      bg: "transparent",
      color: colorMode === "dark" ? "white" : "black",
      rounded: "md",
      border: "1px",
      borderColor: colorMode === "dark" ? "white" : "black",
      transition: "all 0.2s",
      _hover: {
        transform: "translate(-.25rem, -.25rem)",
        boxShadow:
          colorMode === "dark"
            ? ".25rem .25rem 0 white"
            : ".25rem .25rem 0 black",
      },
      _active: {
        transform: "none",
        boxShadow: "none",
      },
    },
  })),
};

export const cardTheme = defineMultiStyleConfig({ variants });
