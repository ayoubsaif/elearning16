import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
//import styles from '@/styles/Home.module.css'

import {
  Flex,
  Box,
  FormControl,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const backgroundImageUrl = "https://cdn.pixabay.com/photo/2017/09/05/10/20/business-2717066_1280.jpg";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bgImage={`url(${backgroundImageUrl})`}
      bgSize="cover"
      bgPosition="center">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} color={'white'}>
            REGISTRO
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('rgba(200,209,217,0.94)', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <Input type="text" placeholder='Nombre'/>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <Input type="text" placeholder='Apellidos'/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <Input type="email" placeholder='Email'/>
            </FormControl>
            <FormControl id="password" isRequired>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} placeholder='Contraseña'/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
            <Button
            >
              REGÍSTRATE
            </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                ¿Ya eres usuario? <Link color={'blue.400'}>Inicia sesión</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}


