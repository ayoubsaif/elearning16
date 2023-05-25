import { useState } from "react";
import { NextSeo } from 'next-seo';
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import {
  Flex,
  Box,
  FormControl,
  InputGroup,
  HStack,
  Stack,
  Heading,
  FormErrorMessage,
  Select,
  FormLabel,
  Textarea,
  Button
} from '@chakra-ui/react';
import Input from "@/components/forms/input";
import { useFormik } from "formik";
import { createCourse } from "@/services/courses";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getServerSession } from "next-auth/next";


export default function CreateCourse(props) {
  const { siteConfig, menuItems } = props;
  const [course, setCourse] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: course?.name || "",
      description: course?.description || "",
      category: course?.category || "",
      keywords: course?.keywords || "",
      thumbnail_url: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Nombre es obligatorio"),
      description: Yup.string()
        .required("Descripción es obligatorio"),
      category: Yup.number()
        .required("Categoría es obligatorio"),
      keywords: Yup.array()
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("image", values.thumbnail_url);
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("category", values.category);
        formData.append("keywords", values.keywords);

        const createCourse = await createCourse(
          formData,
          session?.user?.accessToken
        );
        if (createCourse) {
          setCourse({
            ...course,
            name: createCourse?.name,
            description: createCourse?.description,
            category: createCourse?.category,
            keywords: createCourse?.keywords,
            image: createCourse?.image,
          });
          toast({
            title: "Curso creado.",
            description: "Hemos creado el curso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
        setEditMode(false);
      } catch (error) {
        console.error("Error creating course:", error);
      }
    },
  });

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
          bgSize="cover"
          bgPosition="center">

          <Stack spacing={4} mx={'auto'} py={0} px={0}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'} textAlign={'center'} color={'black'} mt={10} >
                CREA TU CURSO
              </Heading>
            </Stack>
            <HStack>
              <Box
                rounded={'lg'}
                boxShadow={'lg'}
                p={8}
                w={800}
              >
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={8}>
                    <FormControl>
                      <FormLabel>Nombre del Curso</FormLabel>
                      <Input
                        id="name"
                        name="name"
                        {...formik.getFieldProps("name")}
                      />
                      <FormErrorMessage>
                        {formik.errors.firstname}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl id="description" isRequired>
                      <FormLabel>Descripción del Curso</FormLabel>
                      <Textarea type="text" placeholder='Descripción..'
                        id="descripcion"
                        name="descripcion"
                        style={{ width: "100%" }}
                        {...formik.getFieldProps("descripcion")}
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

                    {/* Añadir Usuarios
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
                    */}

                    <Stack spacing={10} pt={2}>
                      <Button
                        bg="black"
                        color="white"
                        _hover={{
                          color: "white",
                          bg: "blue.300",
                          transform: "translate(-.25rem, -.25rem)",
                          boxShadow: ".25rem .25rem 0 black",
                        }}
                      >
                        Crear curso
                      </Button>
                    </Stack>
                  </Stack>
                </form>
              </Box>
            </HStack>
          </Stack>
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  const siteConfig = await getSiteConfig();
  const menuItems = await getMenuItems(session?.user?.accessToken);
  const profileInfo = await getProfile(session?.user?.accessToken);
  return {
    props: {
      siteConfig,
      menuItems,
      profileInfo,
    },
  };
}