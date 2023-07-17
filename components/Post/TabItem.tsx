"use client";
import React from "react";
import { TabItems } from "./NewPostForm";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { selector } from "recoil";

type Props = {
  item: TabItems;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem = ({ item, selected, setSelectedTab }: Props) => {
  return (
    <Flex
      className="items-center font-bold justify-center cursor-pointer "
      flexGrow={1}
      padding="14px 0px"
      _hover={{
        bg: "gray.50",
      }}
      color={selected ? "blue.500" : "gray.500"}
      borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selected ? "blue.500" : "gray.200"}
      borderRightColor="gray.200"
      onClick={() => setSelectedTab(item.title)}
    >
      <Flex className="items-center mr-2 h-[20px]">
        <Icon as={item.icon} />
      </Flex>
      <Text fontSize={"10pt"}>{item.title}</Text>
    </Flex>
  );
};

export default TabItem;
