import { extendTheme } from "@chakra-ui/react";
import { cardTheme } from "./components/Card";
import { buttonTheme } from "./components/Button";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#cbe0f3",
      100: "#98c1e7",
      200: "#65a1da",
      300: "#3182ce",
      400: "#1f5181",
      500: "#194167",
      600: "#12314d",
      800: "#06101a",
    },
  },
  components: {
    Button: buttonTheme,
    Card: cardTheme,
    Input: {
      baseStyle: {
        rounded: "md",
        border: "1px",
        borderColor: "gray.300",
        _hover: {
          borderColor: "black",
          boxShadow: "0 0 0 1px brand.300",
        },
        _focusWithin: {
          border: "1px",
          borderColor: "brand.300",
          outline: "2px solid",
          outlineColor: "brand.100",
          outlineOffset: "0px",
        },
      },
    },
    Select: {
      baseStyle: {
        rounded: "md",
        border: "1px",
        borderColor: "gray.300",
        _hover: {
          borderColor: "black",
          boxShadow: "0 0 0 1px brand.300",
        },
        _focusWithin: {
          outline: "2px solid",
          outlineColor: "brand.100",
          outlineOffset: "0px",
        },
      },
    },
  },
});

export default theme;
