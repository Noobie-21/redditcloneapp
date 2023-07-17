"use client";
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";

import { AiOutlineHome } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import Communities from "./Communities/Communities";
import useDirectory from "@/hooks/useDirectory";

const Directory = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();
  // console.log(directoryState.selectedMenuItem.imageURL, "hello");

  return (
    <div>
      <Menu isOpen={directoryState.isOpen}>
        <MenuButton
          className="cursor-pointer  "
          padding="8px 6px"
          borderRadius={4}
          _hover={{
            outline: "1px solid",
            outlineColor: "gray.200",
          }}
          onClick={toggleMenuOpen}
        >
          <Flex
            align="center"
            justify="space-between"
            width={{ base: "auto", lg: "200px" }}
          >
            <Flex align="center">
              {directoryState.selectedMenuItem.imageURL ? (
                <Image
                  src={directoryState.selectedMenuItem.imageURL}
                  borderRadius={"full"}
                  boxSize={"24px"}
                  mr={2}
                />
              ) : (
                <Icon
                  as={directoryState.selectedMenuItem.icon}
                  fontSize={20}
                  color={directoryState.selectedMenuItem.iconColor}
                  mr={{ base: 1, md: 2 }}
                />
              )}
              <Flex display={{ base: "none", lg: "flex" }}>
                <Text fontWeight={500}>
                  {directoryState.selectedMenuItem.displayText}
                </Text>
              </Flex>
            </Flex>
            <BiChevronDown />
          </Flex>
        </MenuButton>
        <MenuList>
          <Communities />
        </MenuList>
      </Menu>
    </div>
  );
};

export default Directory;
