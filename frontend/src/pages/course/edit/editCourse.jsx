import { NextSeo } from "next-seo";
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
  Textarea,
  Button
} from '@chakra-ui/react';


export default function CreateCourse(props) {
  const { siteConfig, menuItems } = props;


  return (
    <>
      <NextSeo
        title={`${siteConfig?.title} - Editar Curso`}
        description="Editar un curso"
        canonical={`${siteConfig?.siteUrl}/edit-course`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/edit-course`,
          title: "Editar Curso",
          description: "Editar un curso",
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>

        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bgSize="cover"
          bgPosition="center">

          <Stack spacing={4} mx={'auto'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'} color={'black'} mt={10} >
                EDITAR CURSO
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
                <FormControl id="myCourses">
                  <Select placeholder='Mis cursos'>

                  </Select>
                </FormControl>

                <Box>
                  <FormControl id="courseName">
                    <Input type="text" placeholder='Nombre del curso' />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="slug">
                    <Input type="text" placeholder='Slug' />
                  </FormControl>
                </Box>
                <FormControl id="description">
                  <Textarea type="text" placeholder='Descripción..'
                    id="descripcion"
                    value={Description}
                    style={{ width: "100%" }}
                  />
                </FormControl>
                <FormControl id="category">
                  <Select placeholder="Categoría">
  
                  </Select>
                </FormControl>
                <FormControl id="labels">
                  <InputGroup>
                    <Input type="text" placeholder='Etiquetas' />
                  </InputGroup>
                </FormControl>
                <FormControl id="thumbnail">
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
                      <Input id='student' placeholder='Alumno 1' mt={2}></Input>
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

                <Box>
                  <Flex alignItems="center">
                    <FormControl>
                      <FormLabel>CONTENIDO DE CURSOS</FormLabel>
                    </FormControl>
                    <Button colorScheme="green" variant="outline" mb={2}>
                      Crear contenido
                    </Button>
                  </Flex>

                  <Flex>
                    <FormControl>
                      <Input id='student' placeholder='Contenido 1' mt={2}></Input>
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
                    Guardar cambios
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