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
  useToast,
  Button,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import Input from "@/components/forms/input";

import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getProfile, updateProfile } from "@/services/profile";

import Layout from "@/layout/Layout";
import CropImageModal from "@/components/modals/cropImageModal";

import { useFormik } from "formik";

export default function Profile(props) {
  const { siteConfig, menuItems, profileInfo } = props;
  const [profile, setProfile] = useState(profileInfo);
  const [editMode, setEditMode] = useState(false);
  const { data: session, update } = useSession();
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

  const toast = useToast({
    containerStyle: {
      borderColor: "black",
      border: "1px",
      borderRadius: "md",
      boxShadow: ".25rem .25rem 0 black",
    },
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      firstname: profile?.firstname || "",
      lastname: profile?.lastname || "",
      username: profile?.username || "",
      bio: profile?.bio || "",
      avatar: null, // Add the avatar field with initial value as null
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
        const formData = new FormData();
        formData.append("image", values.avatar);
        formData.append("firstname", values.firstname);
        formData.append("lastname", values.lastname);
        formData.append("username", values.username);
        formData.append("bio", values.bio);

        const updatedProfile = await updateProfile(
          formData,
          session?.user?.accessToken
        );
        if (updatedProfile) {
          setProfile({
            ...profile,
            name: updatedProfile?.name,
            firstname: updatedProfile?.firstname,
            lastname: updatedProfile?.lastname,
            username: updatedProfile?.username,
            bio: updatedProfile?.bio,
            image: updatedProfile?.image,
          });
          update({
            user: {
              name: updatedProfile?.name,
              username: updatedProfile?.username,
              image: updatedProfile?.image,
            },
          });
          toast({
            title: "Perfil actualizado",
            description: "Hemos modificado tu perfil.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
        setEditMode(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
  });

  const handleAvatarChange = (e) => {
    setSelectedAvatarFile(e.target.files[0]);
  };

  const handleAvatarSave = (croppedImage) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target.result;
      setProfile((prevProfile) => ({
        ...prevProfile,
        image: imageSrc, // Update the avatar field in the profile state
      }));
    };
    reader.readAsDataURL(croppedImage);
    formik.setFieldValue("avatar", croppedImage);
    setSelectedAvatarFile(null);
  };

  const handleAvatarButtonClick = () => {
    // Trigger the hidden file input when the button is clicked
    const fileInput = document.getElementById("avatar");
    fileInput.click();
  };

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
          rounded={"md"}
          overflow={"hidden"}
          my={5}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box p={4} bg={"blue.100"}>
              {editMode ? (
                <Stack spacing={4}>
                  <HStack>
                    <Avatar
                      size="xl"
                      name={profile?.name}
                      src={profile?.image}
                    />
                    <FormControl isInvalid={formik.errors.avatar}>
                      <FormLabel htmlFor="avatar">Avatar</FormLabel>
                      <div>
                        <input
                          id="avatar"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => {
                            handleAvatarChange(e);
                            formik.setFieldValue(
                              "avatar",
                              e.currentTarget.files[0]
                            );
                          }}
                          style={{ display: "none" }}
                        />

                        <Button
                          onClick={() =>
                            document.getElementById("avatar").click()
                          }
                        >
                          Seleccione una imagen...
                        </Button>
                      </div>
                      <FormErrorMessage>
                        {formik.errors.avatar}
                      </FormErrorMessage>
                    </FormControl>
                  </HStack>
                  <CropImageModal
                    isOpen={Boolean(selectedAvatarFile)}
                    onClose={() => setSelectedAvatarFile(null)}
                    onSave={(croppedImage) => handleAvatarSave(croppedImage)}
                    selectedAvatarFile={selectedAvatarFile}
                  />
                </Stack>
              ) : (
                <Avatar size="xl" name={profile?.name} src={profile?.image} />
              )}
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
                  <Button variant={"primary"} type="submit" colorScheme="blue">
                    Guardar
                  </Button>
                ) : (
                  <Button
                    variant={"primary"}
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
