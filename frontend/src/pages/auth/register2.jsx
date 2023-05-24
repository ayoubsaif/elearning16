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
  Button,
  Box,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { FcGoogle } from "react-icons/fc";

import Input from "@/components/forms/input";

import { getSiteConfig } from "@/services/siteConfig";
import { Link } from "@chakra-ui/next-js";

export default function Register(props) {
  const { siteConfig, signInProviders } = props;
  const router = useRouter();
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
    const signInStatus = await signIn("google", {
      callbackUrl: "/courses",
    });
    if (signInStatus.error) {
      toast({
        title: "Error al iniciar sesión con Google",
        description: "Hemos modificado tu perfil.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else if (signInStatus.ok) {
      router.push(signInStatus.callbackUrl);
    }
  };

  return (
    <>
      <NextSeo
        title={`Crear cuenta de ${siteConfig?.title}`}
        description={siteConfig?.description}
        openGraph={{
          title: `Iniciar Sesión - ${siteConfig?.title}`,
          description: siteConfig?.description,
        }}
      />
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex flex={1}>
          <Image
            alt={"Register"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
            }
          />
        </Flex>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading fontSize={"2xl"}>Crear cuenta nueva</Heading>
            {signInProviders?.google && (
              <Stack spacing={6}>
                <Button
                  bg="white"
                  leftIcon={<FcGoogle />}
                  onClick={handleGoogleSignIn}
                >
                  <Center>
                    <Text>Registrate con Google</Text>
                  </Center>
                </Button>
              </Stack>
            )}

            <Divider />

            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values, actions) => {
                const signInStatus = await newUser("credentials", {
                  email: values.email,
                  password: values.password,
                  redirect: false,
                  callbackUrl: "/courses",
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
                  <HStack>
                    <Box>
                      <Field name="firstname">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.firstname && form.touched.firstname
                            }
                            isRequired
                          >
                            <FormLabel>Nombre</FormLabel>
                            <Input type="text" />
                            <FormErrorMessage>
                              {form.errors.firstname}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box>
                      <Field name="lastname">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.lastname && form.touched.lastname
                            }
                            isRequired
                          >
                            <FormLabel>Apellidos</FormLabel>
                            <Input type="text" />
                            <FormErrorMessage>
                              {form.errors.lastname}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                  </HStack>
                  <Field name="email" validate={validateEmail}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        isRequired
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
                        isRequired
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
                      bg="black"
                      color="white"
                      _hover={{
                        color: "white",
                        bg: "blue.300",
                      }}
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Crear cuenta
                    </Button>
                    <Text align={"center"}>
                      ¿Ya tienes cuenta?{" "}
                      <Link color={"blue.400"} href={"/auth/login"}>
                        Inicia sesión
                      </Link>
                    </Text>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </Flex>
      </Stack>
    </>
  );
}

export async function getStaticProps() {
  const siteConfig = await getSiteConfig();
  const signInProviders = await getProviders();
  return {
    props: {
      siteConfig,
      signInProviders,
    },
  };
}
