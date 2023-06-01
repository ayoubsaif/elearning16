import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    List,
    ListItem,
    Stack,
    Text,
    useBreakpointValue,
    } from "@chakra-ui/react";
import React from 'react'
import { AddIcon } from '@chakra-ui/icons';


export default function CategoryDrawer({categories, isOpen, onOpen, onClose}) {
  return (
    function DrawerExample() {
        const firstField = React.useRef()
      
        return (
          <>
            <Button leftIcon={<AddIcon />} colorScheme='teal' onClick={onOpen}>
              Categorias
            </Button>
            <Drawer
              isOpen={isOpen}
              placement='left'
              initialFocusRef={firstField}
              onClose={onClose}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth='1px'>
                  Categorías
                </DrawerHeader>
      
                <DrawerBody>
                  <Stack spacing='24px'>
                    <List spacing={3}>

                    </List>
                  </Stack>
                </DrawerBody>
      
                <DrawerFooter borderTopWidth='1px'>
                  <Button variant='outline' mr={3} onClick={onClose}>
                    Cerrar
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        )
      }
  )
}
