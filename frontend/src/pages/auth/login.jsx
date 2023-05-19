import { useRouter } from "next/router";
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
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import { FcGoogle } from "react-icons/fc";

import Button from "@/components/forms/Button";
import Input from "@/components/forms/Input";

export default function Login() {
  const router = useRouter();
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
      console.log(signInStatus.error);
    } else if (signInStatus.ok) {
      router.push(signInStatus.callbackUrl);
    }
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Bienvenid@ de nuevo</Heading>

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

          <Divider />

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values, actions) => {
              const signInStatus = await signIn("credentials", {
                email: values.email,
                password: values.password,
                callbackUrl: "/courses",
              });
              if (signInStatus.error) {
                actions.setErrors({
                  email: "Correo electrónico o contraseña incorrectos",
                });
              } else if (signInStatus.ok) {
                router.push(signInStatus.callbackUrl);
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
                      isInvalid={form.errors.password && form.touched.password}
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
                    Iniciar Sesión
                  </Button>
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
  );
}
