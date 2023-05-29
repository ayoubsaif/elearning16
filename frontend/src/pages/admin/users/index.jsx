import { NextSeo } from "next-seo";
import Layout from "@/layout/Layout";
import { useEffect, useState, useRef } from "react";
import {
    Flex,
    Stack,
    Heading,
    Table,
    Thead,
    Tbody,
    TableContainer,
    Tr,
    Td,
    Th,
    IconButton,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure,
    HStack,
    Avatar,
} from '@chakra-ui/react';
import Link from "next/link";
import { getUsers, deleteUser } from "@/services/users";
import { BsTrash3, BsPencilSquare } from "react-icons/bs";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";
import { getCourse, updateCourse } from "@/services/courses";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getProfile } from "@/services/profile";
import { getCategories } from "@/services/category";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";


export default function CreateCourse(props) {
    const { siteConfig, menuItems, initialUsers } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [users] = useState(initialUsers || [])
    const cancelRef = useRef();

    const onDelete = async (id) => {
        await deleteUser(id, session?.user?.accessToken);
        router.push(`/admin/users`);
    }

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
                        <Stack align={'flex-start'} paddingBottom={10} >
                            <Heading fontSize={'4xl'} textAlign={'center'} color={'black'} mt={10} >
                                Administración de usuarios
                            </Heading>
                        </Stack>
                        {users && 
                            <TableContainer>
                                <Table variant='simple'>
                                    <Thead>
                                    <Tr>
                                        <Th>Avatar</Th>
                                        <Th>Nombre</Th>
                                        <Th>Apellido</Th>
                                        <Th>UserName</Th>
                                        <Th>Email</Th>
                                        <Th>Fecha de Creación</Th>
                                        <Th>Rol</Th>
                                        <Th>Acciones</Th>
                                    </Tr>
                                    </Thead>
                                    <Tbody>
                                        {users && users.map((user) => (
                                            <Tr>
                                                <Td>
                                                    <Avatar
                                                        size={'md'}
                                                        name={user.name}
                                                        src={user.image}
                                                    />
                                                </Td>
                                                <Td>{user.firstname}</Td>
                                                <Td>{user.lastname}</Td>
                                                <Td>{user.username}</Td>
                                                <Td>{user.email}</Td>
                                                <Td>{user.firstname}</Td>
                                                <Td>{user.role}</Td>
                                                <Td>
                                                    <HStack spacing={3}>
                                                        <Link href={`/admin/users/${user?.id}/edit`}>
                                                            <IconButton
                                                                icon={<BsPencilSquare />}
                                                                aria-label="Edit user"
                                                                rounded={"full"}
                                                                variant={'outlined'}
                                                            />
                                                        </Link>
                                                        <IconButton
                                                            icon={<BsTrash3 />}
                                                            aria-label="Delete user"
                                                            rounded={"full"}
                                                            variant={'red'}
                                                            onClick={onOpen}
                                                        />
                                                    </HStack>
                                                    <AlertDialog
                                                        isOpen={isOpen}
                                                        leastDestructiveRef={cancelRef}
                                                        onClose={onClose}
                                                    >
                                                        <AlertDialogOverlay>
                                                            <AlertDialogContent
                                                            border='1px solid black'
                                                            transform="translate(-.25rem, -.25rem)"
                                                            boxShadow=".25rem .25rem 0 black"
                                                            >
                                                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                                                    Eliminar usuario
                                                                </AlertDialogHeader>

                                                                <AlertDialogBody>
                                                                    ¿Estás seguro? No podrás revertir esta acción después.
                                                                </AlertDialogBody>

                                                                <AlertDialogFooter>
                                                                    <Button ref={cancelRef} onClick={onClose}>
                                                                        Cancelar
                                                                    </Button>
                                                                    <Button colorScheme='red' ml={3} onClick={() => onDelete(user?.id)}>
                                                                        Elimiar
                                                                    </Button>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialogOverlay>
                                                    </AlertDialog>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        }
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
    const initialUsers = await getUsers(session?.user?.accessToken);
    return {
        props: {
            initialUsers,
            siteConfig,
            menuItems,
            profileInfo,
        },
    };
  }
  