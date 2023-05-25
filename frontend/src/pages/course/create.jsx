import { useState, useCallback } from "react";
import { NextSeo } from 'next-seo';
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsPlusCircle, BsPencilSquare } from "react-icons/bs";
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
  Button,
  Center,
  InputRightElement,
  Image,
  IconButton
} from '@chakra-ui/react';
import ChakraTagInput from "@/components/forms/ChakraTagInput";
import Input from "@/components/forms/input";
import CropImageModal from "@/components/modals/cropImageModal";
import { useFormik } from "formik";
import { createCourse } from "@/services/courses";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getServerSession } from "next-auth/next";


export default function CreateCourse(props) {
  const { siteConfig, menuItems, categories } = props;
  const [course, setCourse] = useState({...Box, image: '/img/empty_course.png'});
  const [tags, setTags] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const handleTagsChange = useCallback((event, tags) => {
    setTags(tags)
  }, [])

  const generateSlug = (name) => {
    let slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")
    formik.setFieldValue("slug", slug);
  }

  const formik = useFormik({
    initialValues: {
      name: course?.name || "",
      slug: course?.slug || "",
      description: course?.description || "",
      category: course?.category || "",
      keywords: null,
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
        formData.append("keywords", tags);

        const createCourse = await createCourse(
          formData,
          session?.user?.accessToken
        );
        if (createCourse) {
          setCourse({
            ...course,
            name: createCourse?.name,
            slug: createCourse?.slug,
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

  const handleImageChange = (e) => {
    e.preventDefault();
    setSelectedImageFile(e.target.files[0]);
    handleImageSave(e.target.files[0]);
  };

  const handleImageSave = (croppedImage) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target.result;
      console.log(imageSrc);
      setCourse((prevProfile) => ({
        ...prevProfile,
        image: imageSrc,
      }));
    };
    reader.readAsDataURL(croppedImage);
    formik.setFieldValue("thumbnail_url", croppedImage);
    setSelectedImageFile(null);
  };

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
          minH={'100%'}
          align={'start'}
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
                    <FormControl isRequired>
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
                    <FormControl isRequired>
                      <FormLabel>Slug del Curso</FormLabel>
                      <InputGroup
                        style={{ paddingRight: "5.5rem" }}
                      >
                        <Input
                          id="slug"
                          name="slug"
                          {...formik.getFieldProps("slug")}
                        />
                        <InputRightElement width='4.5rem'>
                          <Button onClick={() => generateSlug(formik.values.name)} variant="primary">
                            Generar
                          </Button>
                        </InputRightElement>
                      </InputGroup>
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
                        rounded={".25em"}
                        border={"1px"}
                        borderColor="gray.300"
                        _hover={{
                            borderColor: "black",
                            boxShadow: "0 0 0 1px blue.300",
                        }}
                        _focusWithin={{
                            outline: "2px solid",
                            outlineColor: "blue.100",
                            outlineOffset: "0px",
                        }}
                        {...formik.getFieldProps("descripcion")}
                      />
                    </FormControl>

                    <FormControl id="category" isRequired>
                      <Select placeholder='Selecciona una categoría'
                        style={{ width: "100%" }}
                        rounded={".25em"}
                        border={"1px"}
                        borderColor="gray.300"
                        _hover={{
                            borderColor: "black",
                            boxShadow: "0 0 0 1px blue.300",
                        }}
                        _focusWithin={{
                            outline: "2px solid",
                            outlineColor: "blue.100",
                            outlineOffset: "0px",
                        }}
                      >
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <Box>
                      <FormControl id="keywords" isRequired>
                        <FormLabel>Etiquetas del Curso</FormLabel>
                        <ChakraTagInput
                          style={{ width: "100%" }}
                          rounded={".25em"}
                          border={"1px"}
                          borderColor="gray.300"
                          _hover={{
                              borderColor: "black",
                              boxShadow: "0 0 0 1px blue.300",
                          }}
                          _focusWithin={{
                              outline: "2px solid",
                              outlineColor: "blue.100",
                              outlineOffset: "0px",
                          }}
                          tags={tags}
                          onTagsChange={handleTagsChange}
                        />
                      </FormControl>
                    </Box>
                    <Stack spacing={10}>
                      <FormControl isInvalid={formik.errors.image}>
                        <FormLabel>Imagen del Curso</FormLabel>
                        <HStack>
                          <Box textAlign="center" position="relative">
                            <Image
                              size="xl"
                              name={course?.name}
                              src={course?.image}
                              width={270}
                              height={150}
                              objectFit="cover"
                              borderRadius="md"
                            />
                            <Box
                              position="absolute"
                              inset={-2}
                              display="flex"
                              alignItems="end"
                              justifyContent="end"
                            >
                              <input
                                id="thumbnail_url"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => {
                                  handleImageChange(e);
                                  formik.setFieldValue(
                                    "thumbnail_url",
                                    e.currentTarget.files[0]
                                  );
                                }}
                                style={{ display: "none" }}
                              />
                              <IconButton
                                icon={<BsPencilSquare />}
                                aria-label="Change course Image"
                                rounded={"full"}
                                onClick={() =>
                                  document.getElementById("thumbnail_url").click()
                                }
                              />
                            </Box>
                            <FormErrorMessage>
                              {formik.errors.avatar}
                            </FormErrorMessage>
                          </Box>
                        </HStack>
                      </FormControl>
                    </Stack>

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
                        leftIcon={<BsPlusCircle />}
                        variant="primary"
                      >
                        <Center>
                          Crear curso
                        </Center>
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

  const categories = [
    {
      id: 1,
      name: "Programación",
    },
    {
      id: 2,
      name: "Diseño",
    },
    {
      id: 3,
      name: "Marketing",
    },
  ]

  const siteConfig = await getSiteConfig();
  const menuItems = await getMenuItems(session?.user?.accessToken);
  const profileInfo = await getProfile(session?.user?.accessToken);
  return {
    props: {
      categories,
      siteConfig,
      menuItems,
      profileInfo,
    },
  };
}