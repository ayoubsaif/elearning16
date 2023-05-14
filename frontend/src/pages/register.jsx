import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  RadioGroup,
  HStack,
  Radio,
  Flex,
  Button,
  Stack,
  Heading
} from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export default function Register() {
  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Iniciar sesión en su cuenta</Heading>

          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input placeholder='Nombre' />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Apellidos</FormLabel>
            <Input placeholder='Apellidos ' />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" onChange={(e) => (email.current = e.target.value)} placeholder='Email' />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Contraseña</FormLabel>
            <Input placeholder='Contraseña' />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Confirma contraseña</FormLabel>
            <Input placeholder='ConfirmaContraseña' />
          </FormControl>

          <Button colorScheme={'blue'} variant={'solid'}>
            REGISTRARSE
          </Button>

    

        </Stack>
      </Flex>
    </Stack>



  );
}