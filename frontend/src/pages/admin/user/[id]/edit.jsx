import { useState } from "react";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import Layout from "@/layout/Layout";
import { BsSave } from "react-icons/bs";
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
  Switch,
  Button,
  SimpleGrid,
  Text,
  Avatar,
  Center
} from "@chakra-ui/react";
import Input from "@/components/forms/input";
import { useFormik } from "formik";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getUserById, updateUser } from "@/services/users";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function EditUser(props) {
  const { siteConfig, menuItems, initialData } = props;
  const [user, setUser] = useState({
    ...initialData
  });
  const { data: session } = useSession();

  const roles = [
    {name: 'admin'},
    {name: 'teacher'},
    {name: 'student'},
  ]

  const formik = useFormik({
    initialValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "",
      active: user?.active || true,
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Nombre es obligatorio"),
      lastname: Yup.string().required("Apellido es obligatorio"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted!", values);
      try {
        const formData = new FormData();
        formData.append("firstname", values.firstname);
        formData.append("lastname", values.lastname);
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("role", values.role);
        formData.append("active", values.active);

        const newUserData = await updateUser(
          user?.id,
          formData,
          session?.user?.accessToken
        );
        if (newUserData) {
          console.log("User updated:", newUserData);
          //router.push(`/admin/users`);
        }
      } catch (error) {
        console.error("Error creating course:", error);
      }
    },
  });

  return (
    <>
      <NextSeo
        title={`Editar ${user?.name} - ${siteConfig?.title}`}
        description="Editar los datos del usuario seleccionado"
        canonical={`${siteConfig?.siteUrl}/admin/user/${user?.id}/edit`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/admin/user/${user?.id}/edit`,
          title: `Editar ${user?.name}`,
          description: `Editar ${user?.name}`,
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Flex
          minH={"full"}
          align={"start"}
          justify={"center"}
          bgSize="cover"
          bgPosition="center"
          paddingBottom={10}
        >
          <Stack spacing={4} mx={"auto"} py={0} px={0}>
            <Stack align={"center"}>
              <Heading
                as={"h3"}
                fontSize={"lg"}
                textAlign={"center"}
                color={"black"}
                mt={10}
              >
                Editar usuario {user?.name}
              </Heading>
            </Stack>
            <HStack>
              <Box rounded={"md"} border={"1px solid black"} p={8} w={800}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={8}>
                    <Center>
                      <Avatar
                        size={"xl"}
                        name={user?.name}
                        src={user?.image}
                        width={150}
                        height={150}
                        objectFit="cover"
                      />
                    </Center>
                    {user?.bio &&
                      <Text fontSize={"md"} textAlign={"center"} color={"gray.500"}>
                        {user?.bio}
                      </Text>
                    }
                    <FormControl>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        id="firstname"
                        name="firstname"
                        {...formik.getFieldProps("firstname")}
                      />
                      <FormErrorMessage>{formik.errors.firstname}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Apellido/s</FormLabel>
                      <Input
                        id="lastname"
                        name="lastname"
                        {...formik.getFieldProps("lastname")}
                      />
                      <FormErrorMessage>{formik.errors.lastname}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Nombre de usuario</FormLabel>
                      <Input
                        id="username"
                        name="username"
                        {...formik.getFieldProps("username")}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        id="email"
                        name="email"
                        {...formik.getFieldProps("email")}
                      />
                    </FormControl>
                    <FormControl>
                      <Select
                        placeholder="Selecciona un rol"
                        style={{ width: "100%" }}
                        id="role"
                        name="role"
                        {...formik.getFieldProps("role")}
                      >
                        {roles?.map((rol) => (
                          <option
                            key={rol.name}
                            value={rol.name}
                          >
                            {rol.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl as={SimpleGrid} columns={{ base: 2, lg: 4 }}>
                      <FormLabel htmlFor='isChecked'>Activo</FormLabel>
                      <Switch 
                        id='active'
                        name='active'
                        {...formik.getFieldProps("active")} 
                      />
                    </FormControl>
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
  const initialData = await getUserById(context?.query?.id ,session?.user?.accessToken);
  return {
    props: {
        initialData,
        siteConfig,
        menuItems,
        profileInfo,
    },
  };
}
