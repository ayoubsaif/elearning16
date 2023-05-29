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
} from "@chakra-ui/react";
import Input from "@/components/forms/input";
import { useFormik } from "formik";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getUser, updateUser } from "@/services/courses";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function EditUser(props) {
  const { siteConfig, menuItems, initialData } = props;
  const router = useRouter();
  const [user, setUser] = useState({
    ...initialData
  });
  const { data: session } = useSession();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      surname: user?.surname || "",
      username: user?.username || "",
      email: user?.email || "",
      role: user?.role || "",
      active: user?.active || "",
      createdate: user?.createdate || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nombre es obligatorio"),
      surname: Yup.string().required("Apellido es obligatorio"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted!", values);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("surname", values.surname);
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("role", values.role);
        formData.append("active", values.active);
        formData.append("createdate", values.createdate);

        const newUser = await updateUser(
          user?.id,
          formData,
          session?.user?.accessToken
        );
        if (newUser) {
          router.push(`/admin/users`);
        }
      } catch (error) {
        console.error("Error creating course:", error);
      }
    },
  });

  return (
    <>
      <NextSeo
        title={`Editar ${user?.username} - ${siteConfig?.title}`}
        description="Editar los datos del usuario seleccionado"
        canonical={`${siteConfig?.siteUrl}/admin/users/${user?.id}/edit`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/admin/users/${user?.id}/edit`,
          title: `Editar ${user?.username}`,
          description: `Editar ${user?.username}`,
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
                Editar Usario {user?.username}
              </Heading>
            </Stack>
            <HStack>
              <Box rounded={"md"} border={"1px solid black"} p={8} w={800}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={8}>
                    <FormControl>
                      <FormLabel>Nombre del Usuario</FormLabel>
                      <Input
                        id="name"
                        name="name"
                        {...formik.getFieldProps("name")}
                      />
                      <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Apellido del Usuario</FormLabel>
                      <Input
                        id="surname"
                        name="surname"
                        {...formik.getFieldProps("surname")}
                      />
                      <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel>User Name</FormLabel>
                      <Input
                        id="username"
                        name="username"
                        {...formik.getFieldProps("username")}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email del usuario</FormLabel>
                      <Input
                        id="email"
                        name="email"
                        {...formik.getFieldProps("email")}
                      />
                    </FormControl>
                    <FormControl>
                      <Select
                        placeholder="Slecciona un rol"
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
                      <FormLabel htmlFor='isChecked'>Activo:</FormLabel>
                      <Switch 
                        id='active'
                        name='active'
                        isChecked={...formik.getFieldProps("active")} 
                      />
                    </FormControl>
                    <Stack spacing={10}>
                      <FormControl>
                        <FormLabel>Avatar del usuario</FormLabel>
                        <HStack>
                          <Box textAlign="center" position="relative">
                            <Image
                              size="xl"
                              name={user?.name}
                              src={user?.avatar_url}
                              width={270}
                              height={150}
                              objectFit="cover"
                              borderRadius="md"
                              aspectRatio={16 / 9}
                            />
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
  const initialData = await getUser(context?.query?.id ,session?.user?.accessToken);
  return {
    props: {
        initialData,
        categories,
        siteConfig,
        menuItems,
        profileInfo,
    },
  };
}
