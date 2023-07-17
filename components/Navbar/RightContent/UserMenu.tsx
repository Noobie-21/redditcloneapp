"use client";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
} from "@chakra-ui/react";
import { User, signOut } from "firebase/auth";
import { FaRedditSquare } from "react-icons/fa";

import { BiChevronDown } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { IoSparkles } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { auth } from "@/firebase/clientApp";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModal";
import { communityStates } from "@/atoms/communitiesAtom";

type ChakraMenuProps = {
  user?: User | null;
};

const UserMenu = ({ user }: ChakraMenuProps) => {
  const resetCommunityState = useResetRecoilState(communityStates);
  const setAuthModalState = useSetRecoilState(authModalState);
  const logout = async () => {
    await signOut(auth);
    // clear the snippets
    // resetCommunityState();
  };
  return (
    <div>
      <Menu>
        <MenuButton
          className="cursor-pointer  "
          padding="8px 6px"
          borderRadius={4}
          _hover={{
            outline: "1px solid",
            outlineColor: "gray.200",
          }}
        >
          <Flex align="center">
            <Flex align="center">
              {user ? (
                <>
                  <Icon
                    as={FaRedditSquare}
                    fontSize={24}
                    mr={1}
                    color={"gray.300"}
                  />
                  <Flex
                    direction="column"
                    display={{ base: "none", md: "flex" }}
                    fontSize="8pt"
                    align="center"
                    mr={8}
                  >
                    <Text>
                      {user?.displayName || user?.email?.split("@")[0]}
                    </Text>
                    <Flex>
                      <Icon as={IoSparkles} color="brand.100" mr={1} />
                      <Text color="gray.400">1 Karma</Text>
                    </Flex>
                  </Flex>
                </>
              ) : (
                <div>
                  <Icon fontSize={24} color="gray.400" mr={1} as={VscAccount} />
                </div>
              )}
            </Flex>
            <BiChevronDown />
          </Flex>
        </MenuButton>
        <MenuList>
          {user ? (
            <>
              <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{
                  bg: "blue.500",
                  color: "white",
                }}
              >
                <Flex align={"center"}>
                  <Icon as={CgProfile} fontSize={20} mr={2} />
                  Profile
                </Flex>
              </MenuItem>
              <MenuDivider />
              <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{
                  bg: "blue.500",
                  color: "white",
                }}
                onClick={logout}
              >
                <Flex align={"center"}>
                  <Icon as={FiLogOut} fontSize={20} mr={2} />
                  Logout
                </Flex>
              </MenuItem>
            </>
          ) : (
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{
                bg: "blue.500",
                color: "white",
              }}
              onClick={() => {
                setAuthModalState({ open: true, view: "login" });
              }}
            >
              <Flex align={"center"} gap-2>
                <Icon as={FiLogIn} fontSize={20} mr={2} />
                Login / Sign Up
              </Flex>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </div>
  );
};

export default UserMenu;
