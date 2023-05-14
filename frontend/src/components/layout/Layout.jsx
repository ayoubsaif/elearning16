import React from 'react'
import { Box, Flex, Text, IconButton, Button, Stack, Collapse, Icon, Link, Popover, PopoverTrigger, PopoverContent, useColorModeValue, useBreakpointValue, useDisclosure, Container, } from '@chakra-ui/react';

import NavBar from '@/components/layout/NavBar';

export default function Layout({ children }) {
  return (
    <>
        <NavBar />
        <Container centerContent maxW="1200px">
          {children}
        </Container>
    </>
  )
}
