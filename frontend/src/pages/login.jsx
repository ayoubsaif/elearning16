import {
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Link,
  Stack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import Button from "@/components/forms/Button";
import Input from "@/components/forms/Input";

export default function Login() {
  const email = useRef("");
  const password = useRef("");

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Bienvenido de nuevo</Heading>
          <FormControl>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              attributes={{
                type: "email",
                autoComplete: "email",
              }}
              onChange={(e) => (email.current = e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contraseña</FormLabel>
            <Input
              attributes={{ 
                type: "password",
                autoComplete: "current-password",
               }}
              onChange={(e) => (password.current = e.target.value)}
            />
          </FormControl>
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
              onClick={() => {
                console.log(email.current, password.current);
              }}
            >
              Iniciar Sesión
            </Button>
          </Stack>
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
