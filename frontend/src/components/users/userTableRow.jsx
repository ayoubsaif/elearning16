import React from "react";
import { Tr, Td, IconButton, HStack, Avatar } from "@chakra-ui/react";
import Link from "next/link";
import { BsTrash3, BsPencilSquare } from "react-icons/bs";

export default function userTableRow({
  user,
  onOpen,
  onDeleteUser,
  setOnDeleteUser,
}) {
  return (
    <Tr>
      <Td>
        <Avatar size={"md"} name={user.name} src={user.image} />
      </Td>
      <Td>{user.firstname}</Td>
      <Td>{user.lastname}</Td>
      <Td>{user.username}</Td>
      <Td>{user.email}</Td>
      <Td>{user.create_date}</Td>
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
            onClick={() => {
              setOnDeleteUser(user);
              onOpen();
            }}
          />
        </HStack>
      </Td>
    </Tr>
  );
}
