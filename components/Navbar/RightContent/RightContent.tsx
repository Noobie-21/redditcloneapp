import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import AuthButton from "./AuthButton";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import { User, signOut } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import Icons from "./icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
  loading: any;
};

function RightContent({ user, loading }: RightContentProps) {
  return (
    <>
      <AuthModal />

      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButton />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
}

export default RightContent;
