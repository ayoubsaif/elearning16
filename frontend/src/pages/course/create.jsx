import { useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsPlusLg, BsPencilSquare } from "react-icons/bs";
import {
  Flex,
  Box,
  FormControl,
  HStack,
  Stack,
  Heading,
  FormErrorMessage,
  Select,
  FormLabel,
  Textarea,
  Button,
  Image,
  IconButton,
  AspectRatio,
  FormHelperText,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import ChakraTagInput from "@/components/forms/ChakraTagInput";
import Input from "@/components/forms/input";
import { useFormik } from "formik";
import { createCourse } from "@/services/courses";
import { getMenuItems } from "@/services/menuItems";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getCategories } from "@/services/category";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CreateCourse(props) {
  const { siteConfig, menuItems, categories } = props;
  const router = useRouter();
  const [course, setCourse] = useState({
    ...Box,
  });
  const [tags, setTags] = useState([]);
  const { data: session } = useSession();

  const formik = useFormik({
    initialValues: {
      name: course?.name || "",
      slug: course?.slug || "",
      description: course?.description || "",
      category: course?.category || "",
      keywords: null,
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

        const newCourse = await createCourse(
          formData,
          session?.user?.accessToken
        );
        if (newCourse) {
          router.push(`/course/${newCourse.slug}-${newCourse.id}`);
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

  return (
    <>
      <NextSeo
        title={`Crear curso - ${siteConfig?.title}`}
        description="Crea tu propio curso"
        canonical={`${siteConfig?.siteUrl}/course/create`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/course/create`,
          title: "Crear curso",
          description: "Crear curso",
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
          Crear nuevo curso
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
                  <AspectRatio
                    ratio={16 / 9}
                    flexShrink={0}
                    overflow="hidden"
                    rounded="md"
                  >
                    <Box textAlign="center" position="relative">
                      {course.thumbnail ? (
                        <Image
                          name={course?.name}
                          src={course?.thumbnail}
                          bg="black"
                          objectFit="cover"
                          borderRadius="md"
                          w="full"
                        />
                      ) : (
                        <Box bg="gray.200" height="full" w="full" />
                      )}
                      <Box
                        position="absolute"
                        inset={4}
                        display="flex"
                        alignItems="end"
                        justifyContent="end"
                      >
                        <label htmlFor="thumbnail">
                          <input
                            id="thumbnail"
                            name="thumbnail"
                            style={{ display: "none" }}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageChange}
                          />
                          <IconButton
                            icon={<BsPencilSquare />}
                            aria-label="Change course Image"
                            rounded="full"
                            variant="outlined"
                            onClick={() =>
                              document.getElementById("thumbnail").click()
                            }
                          />
                        </label>
                      </Box>
                      <FormErrorMessage>
                        {formik.errors.thumbnail}
                      </FormErrorMessage>
                    </Box>
                  </AspectRatio>
                  <FormHelperText>
                    Imagen del curso (Aspect Ratio 16/9)
                  </FormHelperText>
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
                        onClick={() => generateSlug(formik.values.name)}
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
                      boxShadow: "0 0 0 1px blue.300",
                    }}
                    _focusWithin={{
                      outline: "2px solid",
                      outlineColor: "blue.100",
                      outlineOffset: "0px",
                    }}
                    id="keywords"
                    name="keywords"
                    tags={tags}
                    onTagsChange={handleTagsChange}
                  />
                  <FormErrorMessage>{formik.errors.keywords}</FormErrorMessage>
                </FormControl>
              </Box>
              <Stack spacing={10}>
                <Button leftIcon={<BsPlusLg />} variant="primary" type="submit">
                  Crear curso
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
  const profileInfo = await getProfile(session?.user?.accessToken);
  const categories = await getCategories(session?.user?.accessToken);
  return {
    props: {
      categories,
      menuItems,
      profileInfo,
    },
  };
}
