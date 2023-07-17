"use client";
import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { BsArrowRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoNotificationsCircleOutline,
  IoVideocamOutline,
} from "react-icons/io5";

const Icons = () => {
  return (
    <Flex align={"center"}>
      <Flex
        className="items-center border-r border-solid border-gray-200 p-2"
        display={{
          base: "none",
          md: "flex",
        }}
      >
        <Flex
          className="mr-1.5  ml-1.5  p-1 cursor-pointer "
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={BsArrowRightCircle} fontSize={20} />
        </Flex>
        <Flex
          className="mr-1.5  ml-1.5 p-1 cursor-pointer "
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={IoFilterCircleOutline} fontSize={22} />
        </Flex>
        <Flex
          className="mr-1.5  ml-1.5 p-1 cursor-pointer "
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={IoVideocamOutline} fontSize={22} />
        </Flex>
      </Flex>
      <>
        <Flex
          className="mr-1.5  ml-1.5 p-1 cursor-pointer "
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={BsChatDots} fontSize={22} />
        </Flex>
        <Flex
          className="mr-1.5  ml-1.5 p-1 cursor-pointer "
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={IoNotificationsCircleOutline} fontSize={22} />
        </Flex>
        <Flex
          className="mr-1.5  ml-1.5 p-1 cursor-pointer "
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
          display={{ base: "none ", md: "flex" }}
        >
          <Icon as={GrAdd} fontSize={22} />
        </Flex>
      </>
    </Flex>
  );
};

export default Icons;
