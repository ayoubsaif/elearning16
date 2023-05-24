import { NextSeo } from 'next-seo';
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
  Button,
} from '@chakra-ui/react';


export default function CreateCourse(props) {
  const { siteConfig, menuItems } = props;

  return (
    <>
          <NextSeo
        title={`${siteConfig?.title} - Crear contenido`}
        description="Crear contenido"
        canonical={`${siteConfig?.siteUrl}/create-course`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/create-course`,
          title: "Crear contenido",
          description: "Crear contenido",
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
            CREA EL CONTENIDO DEL CURSO
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
                <Input type="text" placeholder='Nombre del contenido' />
              </FormControl>
            </Box>

            <FormControl id="myCourses" isRequired>
              <Select placeholder='Curso asociado'>
            
              </Select>
            </FormControl>

            <FormControl id="description" isRequired>
              <Textarea type="text" placeholder='Descripción..'
                id="descripcion"
                value={""}
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

            <FormControl>
              <FormLabel htmlFor="videoUrl">URL del video (iframe)</FormLabel>
              <Textarea
                id="videoUrl"
                placeholder="Pega aquí el iframe del video"
              />
            </FormControl>

            <FormControl id="thumbnail" isRequired>
              <FormLabel>Subir documentos</FormLabel>
              <InputGroup>
                <Input type="file" />
              </InputGroup>
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                bg="black"
                color="white"
                _hover={{
                  color: "white",
                  bg: "blue.300",
                }}
              >
                Crear contenido
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