import { Community, communityStates } from "@/atoms/communitiesAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useRecoilValue, useSetRecoilState } from "recoil";
type Props = {
  communityData: any;
};

const About = ({ communityData }: Props) => {
  const params = useParams();
  const selectedFileRef = useRef<HTMLInputElement>(null);
  // console.log(communityData, "😁");
  const [user] = useAuthState(auth);
  const { onSelectedFile, selectedFile, setSelectedFile } = useSelectFile();
  const [loadingImage, setLoadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(communityStates);

  const communityStateValue = useRecoilValue(communityStates);

  const onUpadteImage = async () => {
    if (!selectedFile) return;
    setLoadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunities: {
          ...prev.currentCommunities,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log(error.message);
    }
    setLoadingImage(false);
  };
  // console.log(communityStateValue, "======>");
  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex
        direction={"column"}
        bg="white"
        borderRadius="0px 0px 4px 4px"
        p={3}
      >
        <Stack>
          <Flex width="100%" p={2} fontSize={"10pt"} fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMember?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align={"center"}
            width="100%"
            p={1}
            fontWeight={500}
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            <Text>
              Created At{" "}
              {communityData.CreateAt &&
                moment(new Date(communityData.CreateAt!.seconds * 1000)).format(
                  "DD MM , YYYY"
                )}
            </Text>
          </Flex>
          <Link href={`/r/${params.communityId}/submit`}>
            <Button variant="outline" mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.CreateId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin/Moderator</Text>
                <Flex align={"center"} justify="space-between">
                  <Text
                    _hover={{
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      selectedFileRef.current?.click();
                    }}
                    color="blue.500"
                    cursor="pointer"
                  >
                    Change Image
                  </Text>
                  {communityData?.imageURl || selectedFile ? (
                    <>
                      {/* {
                      !selectedFile 
                    } */}
                      <Image
                        src={selectedFile || communityData?.imageUrl}
                        borderRadius="full"
                        boxSize="40px"
                      />
                    </>
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={48}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (loadingImage ? (
                    <Spinner size="sm" />
                  ) : (
                    <Text cursor="pointer" onClick={onUpadteImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  type="file"
                  accept="image/x-png , image/gif , image/jpeg"
                  ref={selectedFileRef}
                  onChange={onSelectedFile}
                  hidden
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default About;
