export const theme = {
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
  variants: {
    primary: {
      color: "white",
      bg: "blue.500",
      _hover: {
        bg: "blue.600",
      },
      _active: {
        bg: "blue.800",
      },
    },
    secondary: {
      color: "blue.500",
      bg: "white",
      _hover: {
        bg: "blue.50",
      },
      _active: {
        bg: "blue.100",
      },
    },
  },
};
