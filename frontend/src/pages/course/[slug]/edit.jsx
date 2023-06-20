import { useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsSave } from "react-icons/bs";
import {
  Box,
  FormControl,
  FormHelperText,
  HStack,
  Stack,
  VStack,
  Heading,
  FormErrorMessage,
  FormLabel,
  Textarea,
  Button,
  Avatar,
  Text,
  Select
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

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

export default function EditCourse(props) {
  const { siteConfig, menuItems, categories, initialData } = props;
  const router = useRouter();
  const [course, setCourse] = useState({
    ...initialData,
  });
  const [tags, setTags] = useState(course?.keywords || []);
  const { data: session } = useSession();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: course?.name || "",
      slug: course?.slug || "",
      description: course?.description || "",
      category: course?.category?.id || "",
      keywords: tags,
      thumbnail: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nombre es obligatorio"),
      description: Yup.string().required("Descripción es obligatorio"),
      category: Yup.number().required("Categoría es obligatorio"),
      keywords: Yup.array(),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted!", values);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("slug", values.slug);
        formData.append("description", values.description);
        formData.append("category", values.category);
        formData.append("keywords", tags.join(","));
        formData.append("thumbnail", values.thumbnail);

        const newCourse = await updateCourse(
          course?.id,
          formData,
          session?.user?.accessToken
        );
        if (newCourse) {
          router.push(`/course/${course?.slug}`);
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

  const generateSlug = (name) => {
    let slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    formik.setFieldValue("slug", slug);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target.result;
      setCourse((prevProfile) => ({
        ...prevProfile,
        thumbnail: imageSrc,
      }));
    };
    reader.readAsDataURL(file);
    formik.setFieldValue("thumbnail", file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageSrc = e.target.result;
      setCourse((prevProfile) => ({
        ...prevProfile,
        thumbnail: imageSrc,
      }));
    };
    reader.readAsDataURL(file);
    formik.setFieldValue("thumbnail", file);
  };

  const handleCategoryChange = (value) => {
    formik.setFieldValue("category", value);
  };
  const getValue = (item) => item.name;

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
        <Heading as="h3" fontSize="lg" textAlign={"center"} my={10}>
          Editar curso
        </Heading>
        <Box
          w={"full"}
          mx="auto"
          rounded={"md"}
          border={"1px"}
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
                    image={{ image: course?.thumbnail, name: course?.name }}
                    handleImageChange={handleImageChange}
                    isDraggingOver={isDraggingOver}
                    setIsDraggingOver={setIsDraggingOver}
                    handleDrop={handleDrop}
                  />
                  <FormHelperText>
                    Imagen del curso (Aspect Ratio 16/9)
                  </FormHelperText>
                  <FormErrorMessage>{formik.errors.thumbnail}</FormErrorMessage>
                </FormControl>

                <VStack w="full">
                  <FormControl>
                    <FormLabel>Nombre del Curso</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      {...formik.getFieldProps("name")}
                    />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Slug del Curso</FormLabel>
                    <HStack>
                      <Input
                        id="slug"
                        name="slug"
                        {...formik.getFieldProps("slug")}
                      />
                      <Button
                        onClick={() => generateSlug(formik.values.slug)}
                        variant="primary"
                      >
                        Generar
                      </Button>
                    </HStack>
                    <FormErrorMessage>{formik.errors.slug}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      placeholder="Selecciona una categoría"
                      id="category"
                      name="category"
                      {...formik.getFieldProps("category")}
                    >
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      {formik.errors.category}
                    </FormErrorMessage>
                  </FormControl>
                </VStack>
              </Box>

              <FormControl>
                <FormLabel>Descripción del Curso</FormLabel>
                <Textarea
                  type="text"
                  placeholder="Escriba una descripción del curso..."
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
                  <FormLabel>Etiquetas del curso</FormLabel>
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
  const categories = await getCategories(session?.user?.accessToken);
  const initialData = await getCourse(
    context?.query?.slug,
    session?.user?.accessToken
  );
  return {
    props: {
      initialData,
      categories: categories?.categories,
      menuItems,
    },
  };
}
