import { useState, useCallback, useRef, useEffect } from "react";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsPlusLg, BsPencilSquare } from "react-icons/bs";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import {
  Flex,
  Box,
  FormControl,
  HStack,
  Stack,
  Heading,
  FormErrorMessage,
  AspectRatio,
  FormLabel,
  Textarea,
  Button,
  Image,
  IconButton,
  FormHelperText
} from "@chakra-ui/react";
import Input from "@/components/forms/input";
import { useFormik } from "formik";
import { createContent } from "@/services/courseContent";
import { getMenuItems } from "@/services/menuItems";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getCourse } from "@/services/courses";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function CreateCourseContent(props) {
  const { siteConfig, menuItems, course } = props;

  const router = useRouter();
  const [content, setContent] = useState({
    ...Box,
  });

  const { data: session } = useSession();

  const playerRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: content?.name || "",
      description: content?.description || "",
      course: course?.id || "",
      iframe: content?.iframe || "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nombre es obligatorio"),
      description: Yup.string().required("Descripción es obligatorio"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted!", values);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("course", course?.id);
        formData.append("iframe", values.iframe);
        formData.append("thumbnail", values.thumbnail);

        const newContent = await createContent(
          formData,
          session?.user?.accessToken
        );
        if (newContent) {
          router.push(`/course/${course?.slug}/content/${newContent.id}`);
        }
      } catch (error) {
        console.error("Error creating content:", error);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target.result;
      setContent((prevProfile) => ({
        ...prevProfile,
        image: imageSrc,
      }));
      console.log(content?.image)
    };
    reader.readAsDataURL(file);
    formik.setFieldValue("thumbnail", file);
  };

  useEffect(() => {
    if (session && course) {
      formik.setFieldValue("course", course?.name);
    }
  }, [course, session]);

  return (
    <>
      <NextSeo
        title={`Crear contenido para ${course?.name} - ${siteConfig?.title}`}
        description="Crea tu propio curso"
        canonical={`${siteConfig?.siteUrl}/course/${course?.slug}/content/create`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/course/${course?.slug}/content/create`,
          title: "Crear contenido para el curso de " + course?.name,
          description: "Crear contenido para el curso de " + course?.name,
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <HStack
          w={"full"}
          mx="auto"
          border={"1px"}
          borderColor={"black"}
          rounded={"md"}
          my={5}
          p={{ base: 5, md: 10 }}
        >
          <Box w="full" mx="auto" rounded="md">
            <Heading as="h3" fontSize="lg" textAlign="center" color="black">
              Nuevo contenido
            </Heading>
            <Heading
              as="h4"
              fontSize="md"
              textAlign="center"
              color="gray.500"
              mb={10}
            >
              {course?.name}
            </Heading>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={5}>
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
                      <Box
                        textAlign="center"
                        position="relative"
                      >
                        {content.image ? (
                          <Image
                            name={content?.name}
                            src={content?.image}
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
                              aria-label="Cambiar la imagen del contenido del curso"
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
                  <Box w="full">
                    <FormControl>
                      <FormLabel>Nombre del Contenido</FormLabel>
                      <Input
                        id="name"
                        name="name"
                        {...formik.getFieldProps("name")}
                      />
                      <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Curso</FormLabel>
                      <Input
                        id="course"
                        name="course"
                        disabled
                        {...formik.getFieldProps("course")}
                      />
                    </FormControl>
                  </Box>
                </Box>
                <FormControl>
                  <FormLabel>Descripción del contenido</FormLabel>
                  <Textarea
                    type="text"
                    placeholder="Escriba una descripción del curso..."
                    id="description"
                    name="description"
                    {...formik.getFieldProps("description")}
                  />
                  <FormErrorMessage>
                    {formik.errors.description}
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Url del video</FormLabel>
                  <Input
                    id="iframe"
                    name="iframe"
                    {...formik.getFieldProps("iframe")}
                  />
                  <FormErrorMessage>{formik.errors.iframe}</FormErrorMessage>
                </FormControl>
                {formik.getFieldProps("iframe").value && (
                  <AspectRatio maxW="100%" ratio={16 / 9}>
                    <ReactPlayer
                      ref={playerRef}
                      url={formik.getFieldProps("iframe").value}
                      controls
                      width={"full"}
                      height={"full"}
                    />
                  </AspectRatio>
                )}
                <Stack spacing={10} pt={2}>
                  <Button
                    leftIcon={<BsPlusLg />}
                    variant="primary"
                    type="submit"
                  >
                    Crear contenido
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </HStack>
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
  const course = await getCourse(
    context?.query?.slug,
    session?.user?.accessToken
  );
  return {
    props: {
      course,
      menuItems,
      profileInfo,
    },
  };
}
