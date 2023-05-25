import { useState, useCallback } from "react";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsPlusCircle, BsPencilSquare } from "react-icons/bs";
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
} from "@chakra-ui/react";
import ChakraTagInput from "@/components/forms/ChakraTagInput";
import Input from "@/components/forms/input";
import { useFormik } from "formik";
import { createCourse } from "@/services/courses";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getCategories } from "@/services/category";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";

export default function CreateCourse(props) {
  const { siteConfig, menuItems, categories } = props;
  const [course, setCourse] = useState({
    ...Box,
    image: "/img/empty_course.png",
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
        formData.append("thumbnail", values.thumbnail);
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("category", values.category);
        formData.append("keywords", tags.join(","));

        const newCourse = await createCourse(
          formData,
          session?.user?.accessToken
        );
        if (newCourse) {
          Router.push(`/course/${newCourse.slug}-${newCourse.id}`);
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
        image: imageSrc,
      }));
    };
    reader.readAsDataURL(file);
    formik.setFieldValue("thumbnail", file);
  };

  return (
    <>
      <NextSeo
        title={`${siteConfig?.title} - Crear curso`}
        description="Crea tu propio curso"
        canonical={`${siteConfig?.siteUrl}/course/create`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/course/create`,
          title: "Crear curso",
          description: "Crear curso",
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Flex
          minH={"100%"}
          align={"start"}
          justify={"center"}
          bgSize="cover"
          bgPosition="center"
        >
          <Stack spacing={4} mx={"auto"} py={0} px={0}>
            <Stack align={"center"}>
              <Heading
                fontSize={"4xl"}
                textAlign={"center"}
                color={"black"}
                mt={10}
              >
                Crear un nuevo curso
              </Heading>
            </Stack>
            <HStack>
              <Box rounded={"md"} border={"1px solid black"} p={8} w={800}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={8}>
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
                      <FormLabel>Descripción del Curso</FormLabel>
                      <Textarea
                        type="text"
                        placeholder="Escriba una descripción del curso..."
                        id="description"
                        name="description"
                        {...formik.getFieldProps("description")}
                      />
                    </FormControl>

                    <FormControl>
                      <Select
                        placeholder="Selecciona una categoría"
                        style={{ width: "100%" }}
                        id="category"
                        name="category"
                        {...formik.getFieldProps("category")}
                      >
                        {categories?.map((category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {formik.errors.category}
                      </FormErrorMessage>
                    </FormControl>

                    <Box>
                      <FormControl>
                        <FormLabel>Etiquetas del curso</FormLabel>
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
                          id="keywords"
                          name="keywords"
                          tags={tags}
                          onTagsChange={handleTagsChange}
                        />
                        <FormErrorMessage>
                          {formik.errors.keywords}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Stack spacing={10}>
                      <FormControl isInvalid={formik.errors.image}>
                        <FormLabel>Imagen del curso</FormLabel>
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
                                id="thumbnail"
                                name="thumbnail"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => {
                                  handleImageChange(e);
                                }}
                                style={{ display: "none" }}
                              />
                              <IconButton
                                icon={<BsPencilSquare />}
                                aria-label="Change course Image"
                                rounded={"full"}
                                onClick={() =>
                                  document.getElementById("thumbnail").click()
                                }
                              />
                            </Box>
                            <FormErrorMessage>
                              {formik.errors.thumbnail}
                            </FormErrorMessage>
                          </Box>
                        </HStack>
                      </FormControl>
                    </Stack>
                    <Stack spacing={10} pt={2}>
                      <Button
                        leftIcon={<BsPlusCircle />}
                        variant="primary"
                        type="submit"
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
  const categories = await getCategories(session?.user?.accessToken);
  return {
    props: {
      categories,
      siteConfig,
      menuItems,
      profileInfo,
    },
  };
}
