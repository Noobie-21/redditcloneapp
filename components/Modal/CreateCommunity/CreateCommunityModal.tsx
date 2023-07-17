"use client";
import { auth, firestore } from "@/firebase/clientApp";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
  userId: string;
};

const CreateCommunityModal = ({
  open,
  handleClose,
  userId,
}: CreateCommunityModalProps) => {
  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [CommunityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    // recalculated how many chars have left
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommuntityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError("");
    //validate the community
    const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        "Community name must be between 3-12 characters and can only contains letter , no special character"
      );
      return;
    }
    setLoading(true);
    try {
      const communityDocRef = doc(firestore, "communities", communityName);
      await runTransaction(firestore, async (transiction) => {
        const communityDoc = await transiction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(
            `Sorry, r/${communityName} already taken, Try another.`
          );
        }
        transiction.set(communityDocRef, {
          CreateId: userId,
          CreateAt: serverTimestamp(),
          numberOfMember: 1,
          privacyType: CommunityType,
          // Privacy Type
        });
        // Create to community User
        transiction.set(
          doc(firestore, `Users/${userId}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
    } catch (error: any) {
      console.log("handleCommunity Error : ", error);
      setError(error.message);
    }

    setLoading(false);
    handleClose();
  };
  return (
    <>
      <Modal isOpen={open} size="lg" onClose={handleClose}>
        <ModalOverlay />
        <ModalContent padding={5}>
          <ModalHeader className="flex flex-col p-3" fontSize={15}>
            Create a Community
          </ModalHeader>
          <Box className="pl-3 pr-3">
            <Divider />
            <ModalCloseButton />
            <ModalBody className="flex flex-col" padding="10px 0px ">
              <Text fontWeight={600} fontSize={15}>
                Home
              </Text>
              <Text>
                Community names including capitalize cannot be changed
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                /r
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                fontSize="9pt"
                className="mt-1"
                color={charsRemaining === 0 ? "red" : "gray.500"}
              >
                {" "}
                {charsRemaining} Characters Remaining
              </Text>
              <Text fontSize={"9pt"} color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text className="font-bold" fontSize={15}>
                  Community Type
                </Text>
                {/* CheckBox */}
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={CommunityType === "public"}
                    onChange={onCommuntityTypeChange}
                  >
                    <Flex align={"center"}>
                      <Icon as={BsFillPersonFill} fontSize={18} mr={2} />
                      <Text fontSize="10pt" mr={2}>
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view, post , and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={CommunityType === "private"}
                    onChange={onCommuntityTypeChange}
                  >
                    <Flex align={"center"}>
                      <Icon as={HiLockClosed} fontSize={18} mr={2} />
                      <Text fontSize="10pt" mr={2}>
                        Private
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view, post , but only approved user can view
                        and submit to this them
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={CommunityType === "restricted"}
                    onChange={onCommuntityTypeChange}
                  >
                    <Flex align={"center"}>
                      <Icon as={BsFillEyeFill} fontSize={18} mr={2} />
                      <Text fontSize="10pt" mr={2}>
                        Restricted
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view, post , but only approved user can join
                        them
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>
          <ModalFooter className="gray-100" border="8px 8px 10px 10px">
            <Button
              height="30px"
              onClick={handleClose}
              mr={3}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              mr={3}
              bg={"blue.400"}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunityModal;
