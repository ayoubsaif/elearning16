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
  Th,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Center,
  Avatar,
  HStack,
  useToast
} from "@chakra-ui/react";
import { getUsers, deleteUser } from "@/services/users";
import { getMenuItems } from "@/services/menuItems";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

import { getProfile } from "@/services/profile";
import UserTableRow from "@/components/users/userTableRow";

export default function CreateCourse(props) {
  const { siteConfig, menuItems, initialUsers } = props;
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ onDeleteUser, setOnDeleteUser ] = useState();
  const [ users, setUsers ] = useState(initialUsers || []);
  const cancelRef = useRef();
  const toast = useToast({
    containerStyle: {
      borderColor: "black",
      border: "1px",
      borderRadius: "md",
      boxShadow: ".25rem .25rem 0 black",
    },
  });

  const onDelete = async (id) => {
    const deleteResponse = await deleteUser(id, session?.user?.accessToken);
    if (deleteResponse) {
      const initialUsers = await getUsers(session?.user?.accessToken);
      setUsers(initialUsers);
      onClose();
      toast({
        title: "Usuario eliminado",
        description: `El usuario  ${onDeleteUser?.name} ha sido eliminado correctamente`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setOnDeleteUser(null);
    }
  };

  return (
    <>
      <NextSeo
        title={`Usuarios - ${siteConfig?.title}`}
        description="Administración de usuarios"
        canonical={`${siteConfig?.siteUrl}/edit-course`}
        openGraph={{
          url: `${siteConfig?.siteUrl}/admin/users`,
          title: "Usuarios",
          description: "Administración de usuarios",
        }}
      />
      <Layout siteConfig={siteConfig} menuItems={menuItems}>
        <Flex
          minH={"40vh"}
          align={"center"}
          justify={"center"}
          bgSize="cover"
          bgPosition="center"
        >
          <Stack spacing={4} mx={"auto"} py={12} px={6}>
            <Stack align={"flex-start"} paddingBottom={10}>
              <Heading
                fontSize={"4xl"}
                textAlign={"center"}
                mt={10}
              >
                Administración de usuarios
              </Heading>
            </Stack>
            {users && (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Avatar</Th>
                      <Th>Nombre</Th>
                      <Th>Apellido</Th>
                      <Th>Nombre de usuario</Th>
                      <Th>Email</Th>
                      <Th>Desde</Th>
                      <Th>Rol</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users &&
                      users.map((user) => (
                        <UserTableRow
                          {...{
                            user,
                            onDelete,
                            onOpen,
                            onClose,
                            cancelRef,
                            isOpen,
                            onDeleteUser,
                            setOnDeleteUser,
                          }}
                        />
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        </Flex>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay bg={"blackAlpha.400"}>
            <AlertDialogContent
              border="1px solid black"
              transform="translate(-.25rem, -.25rem)"
              boxShadow=".25rem .25rem 0 black"
            >
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                <HStack>
                  <Avatar
                    size={"md"}
                    name={onDeleteUser?.name}
                    src={onDeleteUser?.image}
                  />
                  <Heading as="h4" size="sm">
                    Eliminar {onDeleteUser?.name}
                  </Heading>
                </HStack>
              </AlertDialogHeader>

              <AlertDialogBody>
                ¿Estás seguro? No podrás revertir esta acción después.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  ml={3}
                  onClick={() => onDelete(onDeleteUser?.id)}
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
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

  const menuItems = await getMenuItems(session?.user?.accessToken);
  const profileInfo = await getProfile(session?.user?.accessToken);
  const initialUsers = await getUsers(session?.user?.accessToken);
  return {
    props: {
      initialUsers,
      menuItems,
      profileInfo,
    },
  };
}
