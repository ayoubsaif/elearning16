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
} from "@chakra-ui/react";
import { getUsers, deleteUser } from "@/services/users";
import { getSiteConfig } from "@/services/siteConfig";
import { getMenuItems } from "@/services/menuItems";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

import { getProfile } from "@/services/profile";
import UserTableRow from "@/components/users/userTableRow"

export default function CreateCourse(props) {
  const { siteConfig, menuItems, initialUsers } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users] = useState(initialUsers || []);
  const cancelRef = useRef();

  const onDelete = async (id) => {
    await deleteUser(id, session?.user?.accessToken);
    router.push(`/admin/users`);
  };

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
                color={"black"}
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
                      <Th>UserName</Th>
                      <Th>Email</Th>
                      <Th>Fecha de Creación</Th>
                      <Th>Rol</Th>
                      <Th>Acciones</Th>
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
                          }}
                        />
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
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
