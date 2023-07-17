"use client";
import { authModalState } from "@/atoms/authModal";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import Login from "../../Login/Login";
import SignUp from "../../SignUp/SignUp";

type Props = {};

const AuthInput = (props: Props) => {
  const modalState = useRecoilValue(authModalState);
  return (
    <>
      <Flex className="flex-col items-center w-full mt-8">
        {modalState.view === "login" && <Login />}
        {modalState.view === "signup" && <SignUp />}
      </Flex>
    </>
  );
};

export default AuthInput;
