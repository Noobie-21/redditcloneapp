"use client";
import { authModalState } from "@/atoms/authModal";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import AuthInput from "./AuthInput/AuthInput";
import OAuthButton from "./OAuthButton/OAuthButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useEffect } from "react";
import ResetPassword from "../ResetPassword/ResetPassword";

const AuthModal = () => {
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, error, loading] = useAuthState(auth);
  const handleAuthModal = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (user) handleAuthModal();
    console.log("Users :", user);
  }, [user]);
  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleAuthModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center justify-center">
            <Flex className="flex-col items-center justify-center w-[70%]">
              {modalState.view === "login" || modalState.view === "signup" ? (
                <>
                  <OAuthButton />
                  <p className="text-gray-500 font-bold">OR</p>
                  <AuthInput />{" "}
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
