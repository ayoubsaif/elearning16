import { Avatar, Flex, ListItem } from "@chakra-ui/react";

export default function CategoryListItem() {
  return (
    <ListItem>
      <Link href="#software">
        <Flex gap={2} alignItems="center">
          <Avatar
            size="md"
            src="https://cdn.pixabay.com/photo/2015/06/24/15/45/code-820275_960_720.jpg"
          />
          Desarrollo de software
        </Flex>
      </Link>
    </ListItem>
  );
}
