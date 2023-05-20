import { useState } from "react";
import * as Yup from "yup";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  HStack,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import Button from "@/components/forms/button";
import Input from "@/components/forms/input";

import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getProfile, updateProfile } from "@/services/profile";
import Layout from "@/layout/Layout";

import { Formik, Form, useFormik } from "formik";

export default function Profile(props) {
  const { siteConfig, menuItems, profileInfo } = props;
  const [profile, setProfile] = useState(profileInfo);
  const [editMode, setEditMode] = useState(false);
  const { data:session, update } = useSession();

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      firstname: profile?.firstname || "",
      lastname: profile?.lastname || "",
      username: profile?.username || "",
      bio: profile?.bio || "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .max(15, "Debe tener 20 caracteres o menos")
        .required("Nombre es obligatorio"),
      lastname: Yup.string()
        .max(20, "Debe tener 20 caracteres o menos")
        .required("Apellido es obligatorio"),
      username: Yup.string().required("Nombre de usuario es obligatorio"),
      bio: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const updatedProfile = await updateProfile(values);
        if (updatedProfile) {
          setProfile({
            ...profile,
            name: updatedProfile?.name,
            firstname: updatedProfile?.firstname,
            lastname: updatedProfile?.lastname,
            username: updatedProfile?.username,
            bio: updatedProfile?.bio,
          });
          console.log("Session:", session)
          update({
            user: {
              name: updatedProfile?.name,
              username: updatedProfile?.username,
            }
          });
          console.log("Session updated:", session)
        }
        setEditMode(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
  });

  return (
    <>
      <NextSeo
        title={`${profile?.name} - ${siteConfig?.title}`}
        description={`${profile?.bio}`}
        canonical={`${siteConfig?.siteUrl}/profile`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/profile`,
          title: "Profile",
          description: "Profile page",
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Box
          width={"full"}
          mx="auto"
          border={"1px"}
          borderColor={"black"}
          rounded={".25em"}
          my={5}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box p={4} bg={"blue.100"}>
              <Avatar size="xl" name={profile?.name} src={profile?.image} />
            </Box>
            <Box p={4}>
              <Flex
                align="center"
                alignItems={"start"}
                justify="space-between"
                mb={2}
              >
                <Box>
                  {editMode ? (
                    <>
                      <Stack spacing={4}>
                        <HStack>
                          <FormControl>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                              id="firstname"
                              name="firstname"
                              {...formik.getFieldProps("firstname")}
                            />
                            <FormErrorMessage>
                              {formik.errors.firstname}
                            </FormErrorMessage>
                          </FormControl>

                          <FormControl>
                            <FormLabel>Apellido/s</FormLabel>
                            <Input
                              id="lastname"
                              name="lastname"
                              {...formik.getFieldProps("lastname")}
                            />
                            <FormErrorMessage>
                              {formik.errors.lastname}
                            </FormErrorMessage>
                          </FormControl>
                        </HStack>
                      </Stack>

                      <FormControl>
                        <FormLabel>Nombre de usuario</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            color="gray.500"
                            pointerEvents="none"
                          >
                            @
                          </InputLeftElement>
                          <Input
                            pl={7}
                            id="username"
                            name="username"
                            {...formik.getFieldProps("username")}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {formik.errors.username}
                        </FormErrorMessage>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        {profile?.name}
                      </Text>
                      <Text fontSize="md" color="gray.500" mb={4}>
                        @{profile?.username}
                      </Text>
                    </>
                  )}
                </Box>
                {editMode ? (
                  <Button type="submit" colorScheme="blue">
                    Guardar
                  </Button>
                ) : (
                  <Button
                    bg={"white"}
                    color={"black"}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditMode(true);
                    }}
                    colorScheme="blue"
                  >
                    Editar perfil
                  </Button>
                )}
              </Flex>
              {editMode ? (
                <FormControl>
                  <FormLabel>Biografía</FormLabel>
                  <Textarea
                    id="bio"
                    name="bio"
                    {...formik.getFieldProps("bio")}
                  />
                  <FormErrorMessage>{formik.errors.bio}</FormErrorMessage>
                </FormControl>
              ) : (
                profile?.bio && (
                  <>
                    <Text fontWeight="bold" mb={2}>
                      Biografía
                    </Text>
                    <Text mb={4}>{profile?.bio}</Text>
                  </>
                )
              )}
            </Box>
          </form>
        </Box>
      </Layout>
    </>
  );
}

// get static props with page info from backend
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
