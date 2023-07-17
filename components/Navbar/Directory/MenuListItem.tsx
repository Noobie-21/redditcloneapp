import useDirectory from "@/hooks/useDirectory";
import { Flex, Icon, Image, MenuItem } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons/lib";

type MenuListItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

function MenuListItem({
  displayText,
  icon,
  iconColor,
  link,
  imageURL,
}: MenuListItemProps) {
  // console.log(imageURL, "+=====>+");
  const { onSelectMenuItem } = useDirectory();
  return (
    <MenuItem
      width={"100%"}
      fontSize={"10pt"}
      _hover={{ bg: "gray.100" }}
      onClick={() =>
        onSelectMenuItem({ displayText, icon, iconColor, link, imageURL })
      }
    >
      <Flex align={"center"}>
        {imageURL ? (
          <Image src={imageURL} borderRadius={"full"} boxSize={"18px"} mr={2} />
        ) : (
          <Icon as={icon} fontSize={20} color={iconColor} mr={2} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
}

export default MenuListItem;
