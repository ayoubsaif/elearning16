import { useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsSave } from "react-icons/bs";
import {
  Flex,
  Box,
  FormControl,
  FormHelperText,
  HStack,
  Stack,
  VStack,
  Heading,
  FormErrorMessage,
  Select,
  FormLabel,
  Textarea,
  Button,
  Image,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import ChakraTagInput from "@/components/forms/ChakraTagInput";
import Input from "@/components/forms/input";
import ImageDragAndDrop from "@/components/forms/imageDragAndDrop";

import { getMenuItems } from "@/services/menuItems";
import { getCourse, updateCourse } from "@/services/courses";
import { getCategories } from "@/services/category";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default function EditSiteConfig(props) {
  const { siteConfig, menuItems } = props;
  const router = useRouter();
  const [tags, setTags] = useState(siteConfig?.keywords || []);
  const { data: session } = useSession();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: siteConfig?.name || "",
      description: siteConfig?.description || "",
      keywords: tags,
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Nombre es obligatorio"),
      description: Yup.string().required("Descripción es obligatorio"),
      keywords: Yup.array(),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted!", values);
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("keywords", tags.join(","));
        formData.append("image", values.image);

        const siteConfigReq = await updateSiteConfig(
          formData,
          session?.user?.accessToken
        );
        if (siteConfigReq) {
          router.push(`/`);
        }
      } catch (error) {
        console.error("Error creating course:", error);
      }
    },
  });

  const handleTagsChange = useCallback((event, tags) => {
    setTags(tags);
    formik.setFieldValue("keywords", tags);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target.result;
      setCourse((prevProfile) => ({
        ...prevProfile,
        image: imageSrc,
      }));
    };
    reader.readAsDataURL(file);
    formik.setFieldValue("image", file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageSrc = e.target.result;
      setCourse((prevProfile) => ({
        ...prevProfile,
        image: imageSrc,
      }));
    };
    reader.readAsDataURL(file);
    formik.setFieldValue("image", file);
  };

  return (
    <>
      <NextSeo
        title={`Editar ${course?.name} - ${siteConfig?.title}`}
        description="Crea tu propio curso"
        canonical={`${siteConfig?.siteUrl}/course/${course?.slug}/edit`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/course/${course?.slug}/edit`,
          title: `Editar ${course?.name}`,
          description: `Editar ${course?.name}`,
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Heading
          as="h3"
          fontSize="lg"
          textAlign={"center"}
          color={"black"}
          my={10}
        >
          Editar curso
        </Heading>
        <Box
          w={"full"}
          mx="auto"
          rounded={"md"}
          border={"1px"}
          borderColor={"black"}
          mb={5}
          p={{ base: 5, md: 10 }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={8}>
              <Box display={{ md: "flex" }} gap={5}>
                <FormControl
                  width={{ md: 80 }}
                  flexShrink={0}
                  mb={{ base: 5, md: 0 }}
                >
                  <ImageDragAndDrop 
                    course={course}
                    handleImageChange={handleImageChange}
                    isDraggingOver={isDraggingOver}
                    setIsDraggingOver={setIsDraggingOver}
                    handleDrop={handleDrop}
                  />
                  <FormHelperText>
                    Imagen del Sitio
                  </FormHelperText>
                  <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
                </FormControl>

                <VStack w="full">
                  <FormControl>
                    <FormLabel>Titulo del sitio</FormLabel>
                    <Input
                      id="title"
                      name="title"
                      {...formik.getFieldProps("name")}
                    />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </Box>

              <FormControl>
                <FormLabel>Descripción SEO</FormLabel>
                <Textarea
                  type="text"
                  placeholder="Escriba una descripción del sitio para SEO..."
                  id="description"
                  name="description"
                  rows={5}
                  {...formik.getFieldProps("description")}
                />
                <FormErrorMessage>
                  {formik.touched.description && formik.errors.description}
                </FormErrorMessage>
              </FormControl>

              <Box>
                <FormControl>
                  <FormLabel>Etiquetas del sitio</FormLabel>
                  <ChakraTagInput
                    rounded={".25em"}
                    border={"1px"}
                    borderColor="gray.300"
                    _hover={{
                      borderColor: "black",
                      boxShadow: "0 0 0 1px brand.300",
                    }}
                    _focusWithin={{
                      outline: "2px solid",
                      outlineColor: "brand.100",
                      outlineOffset: "0px",
                    }}
                    id="keywords"
                    name="keywords"
                    tags={tags}
                    onTagsChange={handleTagsChange}
                  />
                  <FormErrorMessage>
                    {formik.touched.keywords && formik.errors.keywords}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Stack spacing={10} pt={2} p={1}>
                <Button leftIcon={<BsSave />} variant="primary" type="submit">
                  Guardar cambios
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
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
  const menuItems = await getMenuItems(session?.user?.accessToken);
  return {
    props: {
      menuItems,
    },
  };
}
