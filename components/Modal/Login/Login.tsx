"use client";
import { authModalState } from "@/atoms/authModal";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERROR } from "@/firebase/errors";
import { Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

type Props = {};

const Login = (props: Props) => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = { [event.target.name]: event.target.value };
    setLoginForm((prev) => ({
      ...prev,
      ...value,
    }));
  };

  // Firebase Logic
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };
  return (
    <form onSubmit={onSubmit}>
      <Input
        name="email"
        placeholder="john@email.com"
        type="email"
        onChange={onChange}
        required
        className="mb-4 text-[10pt] bg-gray-50 placeholder:text-gray-500 placeholder:font-bold "
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <Input
        name="password"
        placeholder="***********"
        onChange={onChange}
        required
        type="password"
        className="mb-4 text-[10pt] bg-gray-50 placeholder:text-gray-500 placeholder:font-bold "
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <p className="text-center text-red-500 text-sm ">
        {FIREBASE_ERROR[error?.message as keyof typeof FIREBASE_ERROR]}
      </p>
      <Button
        className="w-full h-[36px] mt-2 mb-2 bg-blue-400"
        type="submit"
        isLoading={loading}
      >
        LOG IN
      </Button>

      <div className="flex text-[9pt] mt-3 justify-center text-center flex-col gap-2">
        <span className="mr-1">
          Forgot Password?{" "}
          <span
            className="text-blue-500 font-bold cursor-pointer hover:underline"
            onClick={() => {
              setAuthModalState((prev) => ({
                ...prev,
                view: "resetPassword",
              }));
            }}
          >
            Click Here
          </span>
        </span>
        <span className="mr-1 mb-2">
          Dont't have an Account?{" "}
          <span
            className="text-blue-500 font-bold cursor-pointer hover:underline"
            onClick={() => {
              setAuthModalState((prev) => ({
                ...prev,
                view: "signup",
              }));
            }}
          >
            SIGN UP
          </span>
        </span>
      </div>
    </form>
  );
};
export default Login;
