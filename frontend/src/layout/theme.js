import { extendTheme } from "@chakra-ui/react";
import { Input } from '@/components/forms/input';

const theme = extendTheme({
  colors: {
    blue: {
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
    Button: {
      baseStyle: ({ colorMode }) => ({
        bg: colorMode === "dark" ? "blue.300" : "blue.500",
        color: colorMode === "dark" ? "black" : "black",
        rounded: "md",
        border: "1px",
        borderColor: colorMode === "dark" ? "wihte" : "black",
        _hover: {
          transform: "translate(-.25rem, -.25rem)",
          boxShadow: colorMode === "dark" ? ".25rem .25rem 0 white" : ".25rem .25rem 0 black",
        },
        _active: {
          transform: "none",
          boxShadow: "none",
        },
      }),
      variants: {
        primary: ({ colorMode }) => ({
          color: "white",
          bg: "blue.300",
          _hover: {
            bg: "white",
            color: "black",
          },
          _active: {
            bg: "blue.400",
            color: "white",
          },
        }),
        secondary: {
          color: "white",
          bg: "blue.300",
          _hover: {
            bg: "blue.400",
          },
          _active: {
            bg: "black",
          },
        },
        outlined: ({ colorMode }) => ({
          color: "black",
          bg: colorMode === "dark" ? "blue.400" : "white",
          _hover: {
            bg: "blue.300",
            color: "white",
          },
          _active: {
            color: "white",
            bg: "blue.400",
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
      },
    },
    Input: {
      baseStyle: {
        rounded: "md",
        border: "1px",
        borderColor: "gray.300",
        _hover: {
            borderColor: "black",
            boxShadow: "0 0 0 1px blue.300",
        },
        _focusWithin: {
            border: "1px",
            borderColor: "blue.300",  
            outline: "2px solid",
            outlineColor: "blue.100",
            outlineOffset: "0px",
        }
      },
    },
    Select: {
      rounded:"md",
      border:"1px",
      borderColor:"gray.300",
      _hover:{
          borderColor: "black",
          boxShadow: "0 0 0 1px blue.300",
      },
      _focusWithin:{
          outline: "2px solid",
          outlineColor: "blue.100",
          outlineOffset: "0px",
      }
    },
  },
});

export default theme;