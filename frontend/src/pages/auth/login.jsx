import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { signIn, getProviders } from "next-auth/react";

import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Image,
  FormErrorMessage,
  Center,
  Text,
  Divider,
  useToast,
  Button
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/forms/input";

import { Link } from "@chakra-ui/next-js";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default function Login(props) {
  const router = useRouter();
  const { error } = router.query;
  const { siteConfig, signInProviders } = props;
  const toast = useToast({
    containerStyle: {
      borderColor: "black",
      border: "1px",
      borderRadius: "md",
      boxShadow: ".25rem .25rem 0 black",
    },
  });

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Correo electrónico requerido";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) &&
      value !== " "
    ) {
      error = "Correo electrónico inválido";
    }
    return error;
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
    if (error) {
      toast({
        title: "Error al iniciar sesión con Google",
        description: `Hemos modificado tu perfil. Error: ${error}`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <NextSeo
        title={`Iniciar Sesión - ${siteConfig?.title}`}
        description={siteConfig?.description}
        openGraph={{
          title: `Iniciar Sesión - ${siteConfig?.title}`,
          description: siteConfig?.description,
        }}
      />
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading fontSize={"2xl"}>Bienvenid@ de nuevo</Heading>
            {signInProviders?.google && (
              <Stack spacing={6}>
                <Button
                  bg="white"
                  leftIcon={<FcGoogle />}
                  onClick={handleGoogleSignIn}
                >
                  <Center>
                    <Text>Inicia sesión con Google</Text>
                  </Center>
                </Button>
              </Stack>
            )}

            <Divider />

            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values, actions) => {
                const signInStatus = await signIn("credentials", {
                  email: values.email,
                  password: values.password,
                  redirect: false,
                  callbackUrl: "/",
                });
                if (signInStatus?.error) {
                  actions.setErrors({
                    email: "Correo electrónico o contraseña incorrectos",
                  });
                } else if (signInStatus?.ok) {
                  router.push(signInStatus?.url);
                }
                actions.setSubmitting(false);
              }}
            >
              {(props) => (
                <Form>
                  <Field name="email" validate={validateEmail}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <FormLabel>Correo electrónico</FormLabel>
                        <Input {...field} />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="password">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel>Contraseña</FormLabel>
                        <Input {...field} type="password" />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Stack spacing={6}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"space-between"}
                    ></Stack>
                    <Button
                      variant={"primary"}
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Iniciar Sesión
                    </Button>
                    <Text align={"center"}>
                      ¿No tienes cuenta?{" "}
                      <Link color={"brand.400"} href={"/auth/register"}>
                        ¡Registrate ahora!
                      </Link>
                    </Text>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
            }
          />
        </Flex>
      </Stack>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const signInProviders = await getProviders();
  return {
    props: {
      signInProviders,
    },
  };
}
