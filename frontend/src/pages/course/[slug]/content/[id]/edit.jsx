import { useState, useCallback, useRef, useEffect } from "react";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsSave, BsPencilSquare } from "react-icons/bs";
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
} from "@chakra-ui/react";
import Input from "@/components/forms/input";
import { useFormik } from "formik";
import { createContent } from "@/services/courseContent";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getCourse } from "@/services/courses";
import { getCourseContentById } from "@/services/courseContent";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function EditCourseContent(props) {
  const { siteConfig, menuItems, course, initialValues  } = props;

  const router = useRouter();
  const [content, setContent] = useState({
    ...initialValues
  });

  const { data: session } = useSession();

  const playerRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      name: content?.name || "",
      description: content?.description || "",
      course: course?.id || "",
      iframe: content?.iframe || "",
      thumbnail: content?.thumbnail || "",
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
        title={`Editar contenido para ${course?.name} - ${siteConfig?.title}`}
        description={`${initialValues?.description}`}
        canonical={`${siteConfig?.siteUrl}/course/${course?.slug}/content/${initialValues?.id}/edit`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/course/${course?.slug}/content/${initialValues?.id}/edit`,
          title: `${initialValues?.name}`,
          description: `${initialValues?.description}`
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Flex
          minH={"100%"}
          align={"start"}
          justify={"center"}
          bgSize="cover"
          bgPosition="center"
          paddingBottom={10}
        >
          <Stack spacing={4} mx={"auto"} py={0} px={0}>
            <Stack align={"center"}>
              <Heading
                fontSize={"4xl"}
                textAlign={"center"}
                color={"black"}
                mt={10}
              >
                Editar contenido para "{course?.name}"
              </Heading>
            </Stack>
            <HStack>
              <Box rounded={"md"} border={"1px solid black"} p={8} w={800}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={8}>
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
                      <FormLabel>Descripción del contenido</FormLabel>
                      <Textarea
                        type="text"
                        placeholder="Escriba una descripción del curso..."
                        id="description"
                        name="description"
                        {...formik.getFieldProps("description")}
                      />
                      <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Curso del Contenido</FormLabel>
                      <Input
                        id="course"
                        name="course"
                        disabled
                        {...formik.getFieldProps("course")}
                      />
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
                    {formik.getFieldProps("iframe").value && 
                      <AspectRatio maxW="100%" ratio={16 / 9}>
                        <ReactPlayer
                          ref={playerRef}
                          url={formik.getFieldProps("iframe").value}
                          controls
                          width={"full"}
                          height={"full"}
                        />
                      </AspectRatio>
                    }
                    <Stack spacing={10}>
                      <FormControl>
                        <FormLabel>Miniatrura del contenido (Usar Imágenes en 16/9)</FormLabel>
                        <HStack>
                          <Box textAlign="center" position="relative">
                            <Image
                              size="xl"
                              name={content?.name}
                              src={content?.image}
                              width={270}
                              height={150}
                              objectFit="cover"
                              borderRadius="md"
                              aspectRatio={16 / 9}
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
                                aria-label="Change content Image"
                                rounded={"full"}
                                onClick={() =>
                                  document.getElementById("thumbnail").click()
                                }
                              />
                            </Box>
                          </Box>
                        </HStack>
                      </FormControl>
                    </Stack>
                    <Stack spacing={10} pt={2}>
                      <Button
                        leftIcon={<BsSave />}
                        variant="primary"
                        type="submit"
                      >
                        Guardar cambios
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
  const course = await getCourse(context?.query?.slug ,session?.user?.accessToken);
  const initialValues = await getCourseContentById(context?.query?.id ,session?.user?.accessToken)
  return {
    props: {
        initialValues,
        course,
        siteConfig,
        menuItems,
        profileInfo,
    },
  };
}
