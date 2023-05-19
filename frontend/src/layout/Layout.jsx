import React from 'react'
import { Container, Box } from '@chakra-ui/react';

import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout({ children, siteConfig, menuItems }) {
  return (
    <Box minHeight="100vh" position="relative">
        <NavBar siteConfig={siteConfig} menuItems={menuItems}/>
        <Container centerContent maxW="1200px">
          {children}
        </Container>
        <Footer />
    </Box>
  )
}
