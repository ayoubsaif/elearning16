import React from "react";
import {
    Tr,
    Td,
    IconButton,
    HStack,
    Avatar,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from '@chakra-ui/react';
import Link from "next/link";
import { BsTrash3, BsPencilSquare } from "react-icons/bs";


export default function userTableRow({ user, onDelete, onOpen, onClose, cancelRef, isOpen}) {
  return (
    <Tr>
      <Td>
        <Avatar size={"md"} name={user.name} src={user.image} />
      </Td>
      <Td>{user.firstname}</Td>
      <Td>{user.lastname}</Td>
      <Td>{user.username}</Td>
      <Td>{user.email}</Td>
      <Td>{user.firstname}</Td>
      <Td>{user.role}</Td>
      <Td>
        <HStack spacing={3}>
          <Link href={`/admin/user/${user?.id}/edit`}>
            <IconButton
              icon={<BsPencilSquare />}
              aria-label="Edit user"
              rounded={"full"}
              variant={"outlined"}
            />
          </Link>
          <IconButton
            icon={<BsTrash3 />}
            aria-label="Delete user"
            rounded={"full"}
            variant={"red"}
            onClick={onOpen}
          />
        </HStack>
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
                <Center>
                    <Avatar size={"md"} name={user.name} src={user.image} />
                    Eliminar {user.name}
                </Center>
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
                  onClick={() => onDelete(user?.id)}
                >
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Td>
    </Tr>
  );
}
