import { NextSeo } from 'next-seo';
import Button from "@/components/forms/Button";
import Layout from "@/layout/Layout";
import {
  Flex,
  Box,
  FormControl,
  Input,
  InputGroup,
  HStack,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Description,
  Select,
  FormLabel,
  Textarea
} from '@chakra-ui/react';

const backgroundImageUrl = "https://cdn.pixabay.com/photo/2015/06/24/15/45/hands-820272_1280.jpg";

export default function CreateCourse(props) {
  const { siteConfig, menuItems } = props;

  return (
    <>
      <NextSeo
        title={`${siteConfig?.title} - Crear curso`}
        description="Crea tu propio curso"
        canonical={`${siteConfig?.siteUrl}/create-course`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/create-course`,
          title: "Crear curso",
          description: "Crear curso",
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bgImage={`url(${backgroundImageUrl})`}
          bgSize="cover"
          bgPosition="center">

          <Stack spacing={4} mx={'auto'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'} color={'black'} mt={10} >
                CREA TU CURSO
              </Heading>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('rgba(200,209,217,0.94)', 'gray.700')}
              boxShadow={'lg'}
              p={8}
              w={800}
            >

              <Stack spacing={8}>

                <Box>
                  <FormControl id="courseName" isRequired>
                    <Input type="text" placeholder='Nombre del curso' />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="slug" isRequired>
                    <Input type="text" placeholder='Slug' />
                  </FormControl>
                </Box>
                <FormControl id="description" isRequired>
                  <Textarea type="text" placeholder='Descripción..'
                    id="descripcion"
                    value={Description}
                    style={{ width: "100%" }}
                  />
                </FormControl>

                <FormControl id="category" isRequired>
                  <Select placeholder="Categoría">
                   
                  </Select>
                </FormControl>

                <FormControl id="labels" isRequired>
                  <InputGroup>
                    <Input type="text" placeholder='Etiquetas' />
                  </InputGroup>
                </FormControl>
                <FormControl id="thumbnail" isRequired>
                  <FormLabel>Elige una miniatura</FormLabel>
                  <InputGroup>
                    <Input type="file" />
                  </InputGroup>
                </FormControl>

                <Box>
                  <Flex alignItems="center">
                    <FormControl>
                      <FormLabel>ESTUDIANTES</FormLabel>
                    </FormControl>
                    <Button colorScheme="green" variant="outline" mb={2}>
                      Añadir
                    </Button>
                  </Flex>

                  <Flex>
                    <FormControl>
                      <Input id='student' placeholder='Alumno' mt={2}></Input>
                    </FormControl>
                    <HStack mt={2}>
                      <Button colorScheme="blue" variant="outline" ml={2}>
                        Editar
                      </Button>
                      <Button colorScheme="red" variant="outline">
                        Borrar
                      </Button>
                    </HStack>
                  </Flex>
                </Box>

                <Stack spacing={10} pt={2}>
                  <Button
                    bg="black"
                    color="white"
                    _hover={{
                      color: "white",
                      bg: "blue.300",
                    }}
                  >
                    Crear curso
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Layout>
    </>
  );
}





