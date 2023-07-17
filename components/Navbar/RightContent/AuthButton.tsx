"use client";
import { authModalState } from "@/atoms/authModal";
import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";

const AuthButton = () => {
  const setAuthModlaState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{
          base: "none",
          sm: "flex",
        }}
        width={{
          base: "78px",
          md: "110px",
        }}
        onClick={() => {
          setAuthModlaState({ open: true, view: "login" });
        }}
      >
        LOG IN
      </Button>
      <Button
        variant={"solid"}
        height="28px"
        display={{
          base: "none",
          sm: "flex",
        }}
        width={{
          base: "78px",
          md: "110px",
        }}
        className="bg-blue-500 text-slate-100"
        onClick={() => {
          setAuthModlaState({ open: true, view: "signup" });
        }}
      >
        SIGN UP
      </Button>
    </>
  );
};

export default AuthButton;
