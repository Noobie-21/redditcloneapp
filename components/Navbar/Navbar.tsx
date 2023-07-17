"use client";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import Directory from "./Directory/Directory";
// import reddit from './'

function Navbar({}) {
  const [user, error, loading] = useAuthState(auth);
  return (
    <Flex
      bg={"white"}
      height={"50px"}
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        className="p-2"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
      >
        <Image src="/images/redditFace.svg" height="30px" alt="Reddit logo" />
        <Image
          src="/images/redditText.svg"
          height="30px"
          alt="Reddit logo"
          display={{
            base: "none",
            md: "unset",
          }}
        />
      </Flex>
      {user && <Directory />}

      <SearchInput user={user} />
      <RightContent user={user} loading={loading} />
    </Flex>
  );
}

export default Navbar;
