import {
  directoryMenuState,
  directoryMenuItem,
} from "@/atoms/DirectoryMenuAtom";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/navigation";
import { communityStates } from "@/atoms/communitiesAtom";
import { FaReddit } from "react-icons/fa";
const useDirectory = () => {
  const communityStateValue = useRecoilValue(communityStates);
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();
  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  const onSelectMenuItem = (menuItem: directoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };
  useEffect(() => {
    const { currentCommunities } = communityStateValue;
    // console.log(currentCommunities?.imageURL);
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: {
        displayText: `r/${currentCommunities?.id}`,
        link: `/r/${currentCommunities?.id}`,
        imageURL: currentCommunities?.imageURL,
        icon: FaReddit,
        iconColor: "blue.500",
      },
    }));
  }, [communityStateValue.currentCommunities]);
  return { directoryState, toggleMenuOpen, onSelectMenuItem };
};

export default useDirectory;
