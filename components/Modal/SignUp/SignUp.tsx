"use client";
import { authModalState } from "@/atoms/authModal";
import { Button, Input } from "@chakra-ui/react";
import React, { FormEvent, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { FIREBASE_ERROR } from "@/firebase/errors";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  setDoc,
} from "firebase/firestore";

type Props = {};

const SignUp = (props: Props) => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [formError, setFormError] = useState("");

  const [createUserWithEmailAndPassword, userCred, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = { [event.target.name]: event.target.value };
    setSignUpForm((prev) => ({
      ...prev,
      ...value,
    }));
  };

  // Firebase Logic of new User
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setFormError("");
    if (signUpForm.password !== signUpForm.confirm_password) {
      setFormError("password do not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "Users", user?.uid);
    await setDoc(userDocRef, {
      displayName: user.displayName,
      email: user.email,
      profileImage: user.photoURL,
      userId: user.uid,
    });
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
      // console.log(userCred.user);
    }
  }, [userCred]);
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
        placeholder="Password"
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
      <Input
        name="confirm_password"
        placeholder="Confirm Password"
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
        {formError ||
          FIREBASE_ERROR[error?.message as keyof typeof FIREBASE_ERROR]}
      </p>

      <Button
        className="w-full h-[36px] mt-2 mb-2 bg-blue-400"
        type="submit"
        isLoading={loading}
      >
        Sign Up
      </Button>
      <div className="flex text-[9pt] mt-3 justify-center">
        <span className="mr-1">
          Already have a Redditor?{" "}
          <span
            className="text-blue-500 font-bold cursor-pointer hover:underline"
            onClick={() => {
              setAuthModalState((prev) => ({
                ...prev,
                view: "login",
              }));
            }}
          >
            LOG IN
          </span>
        </span>
      </div>
    </form>
  );
};

export default SignUp;
