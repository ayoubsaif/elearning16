import React from "react";
import { Container, Grid, GridItem } from "@chakra-ui/react";

import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children, siteConfig, menuItems }) {
  return (
    <Grid
      templateAreas={`"header" "main" "footer"`}
      minHeight="100vh"
      templateRows="auto 1fr auto"
    >
      <GridItem area={"header"}>
        <NavBar siteConfig={siteConfig} menuItems={menuItems} />
      </GridItem>

      <GridItem area={"main"} pt={16}>
        <Container centerContent maxW="1200px">
          {children}
        </Container>
      </GridItem>

      <GridItem area={"footer"}>
        <Footer siteConfig={siteConfig} />
      </GridItem>
    </Grid>
  );
}
