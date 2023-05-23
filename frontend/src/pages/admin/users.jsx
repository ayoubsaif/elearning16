import { NextSeo } from "next-seo";
import Layout from "@/layout/Layout";
import { useEffect, useState } from "react";
import {
    Flex,
    Box,
    FormControl,
    Input,
    InputGroup,
    HStack,
    Stack,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Description,
    Select,
    FormLabel,
    Textarea,
    formData,
    Avatar,
    Button
} from '@chakra-ui/react';


export default function CreateCourse(props) {
    const { siteConfig, menuItems } = props;

    const [formData, setFormData] = useState({
        contenido: "",
        correo: "",
        profesor: "",
    });

    // Simulación de obtención de datos desde la base de datos
    useEffect(() => {
        /* Aquí lógica para obtener los datos desde la base de datos
        y asignarlos a la variable formData*/
        const dataFromDatabase = {
            nombre: "Nombre de ejemplo",
            correo: "correo@gmail.com",
            profesor: "Nombre profesr",
        };
        setFormData(dataFromDatabase);
    }, []);


    return (
        <>
            <NextSeo
                title={`${siteConfig?.title} - Editar Curso`}
                description="Editar un curso"
                canonical={`${siteConfig?.siteUrl}/edit-course`}
                openGraph={{
                    url: `${siteConfig?.siteUrl}/edit-course`,
                    title: "Editar Curso",
                    description: "Editar un curso",
                }}
            />
            <Layout siteConfig={siteConfig} menuItems={menuItems}>

                <Flex
                    minH={'40vh'}
                    align={'center'}
                    justify={'center'}
                    bgSize="cover"
                    bgPosition="center">

                    <Stack spacing={4} mx={'auto'} py={12} px={6}>
                        <Stack align={'center'}>
                            <Heading fontSize={'4xl'} textAlign={'center'} color={'black'} mt={10} >
                                Administración de usuarios
                            </Heading>
                        </Stack>
                        <Box
                            rounded={'lg'}
                            bg={useColorModeValue('rgba(200,209,217,0.94)', 'gray.700')}
                            boxShadow={'lg'}
                            p={8}
                            w={800}
                        >

                            <Stack spacing={8}>

                                <Box>
                                    <Flex alignItems="center">
                                        <FormControl>
                                            <FormLabel>USUARIOS</FormLabel>
                                        </FormControl>
                                        <Button colorScheme="green" variant="outline" mb={2}>
                                            Crear usuario
                                        </Button>
                                    </Flex>

                                    

                                    <Flex>

                                        <FormControl>
                                            <Flex sx={{ alignItems: "center" }}>
                                                <Avatar
                                                    src={"https://i.pinimg.com/236x/35/f3/22/35f322cd8e659126311b9fad295c4645.jpg"}
                                                    alt="Avatar"
                                                    mr={2}
                                                />
                                                <Text border="1px"
                                                    borderRadius="8px"
                                                    borderColor="black"
                                                    p={2}
                                                    w={"90%"}>
                                                    <span style={{ margin: "0 8px" }}>
                                                        Nombre: {formData.nombre}
                                                    </span>
                                                    <br />
                                                    <span style={{ margin: "0 8px" }}>
                                                        Correo: {formData.correo}
                                                    </span>
                                                    <span style={{ margin: "0 8px" }}>
                                                        Profesor: {formData.profesor}
                                                    </span>
                                                </Text>
                                            </Flex>
                                        </FormControl>


                                        <HStack mt={2}>
                                            <Button colorScheme="blue" variant="outline" ml={2}>
                                                Editar
                                            </Button>
                                            <Button colorScheme="red" variant="outline">
                                                Borrar
                                            </Button>
                                        </HStack>

                                        
                                    </Flex>

                                    
                                </Box>

                                <Stack spacing={10} pt={2}>
                                    <Button
                                        bg="black"
                                        color="white"
                                        _hover={{
                                            color: "white",
                                            bg: "blue.300",
                                        }}
                                    >
                                        Guardar cambios
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </Flex>
            </Layout>
        </>
    );
}