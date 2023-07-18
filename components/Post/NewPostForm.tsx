"use client";
import { CloseButton, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from "./TabItem";
import TextInput from "./PostForm/TextInput";
import ImageUpload from "./PostForm/ImageUpload";
import { Post, postState } from "@/atoms/postAtoms";
import { User } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/hooks/useSelectFile";
import { useSetRecoilState } from "recoil";

type Props = {
  user: User;
  communityImageURL?: string;
};

const formTabs: TabItems[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Videos",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItems = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm = ({ user, communityImageURL }: Props) => {
  const params = useParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInput, setTextInput] = useState({
    title: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String>("");
  const setPostStateValue = useSetRecoilState(postState);
  // const [selectedFile, setSelectedFile] = useState<string>();
  const { selectedFile, onSelectedFile, setSelectedFile } = useSelectFile();
  const handleCreatePost = async () => {
    // create a new post object
    const newPost: Post = {
      communityId: params.communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user?.email!.split("@")[0],
      title: textInput.title,
      body: textInput.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
      communityImageURL: communityImageURL || "",
    };

    // store the post in db
    setLoading(true);
    try {
      const postDocumentRef = await addDoc(
        collection(firestore, "Posts"),
        newPost
      );

      // Image Process for storing data
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocumentRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // Update doc ref

        await updateDoc(postDocumentRef, {
          imageURL: downloadURL,
        });
      }

      router.back();
    } catch (error: any) {
      console.log("Handle Post Error : ", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // console.log(textInput, "hello");
  return (
    <Flex className=" flex-col bg-white mt-2 " borderRadius={4}>
      <Flex width="100%">
        {formTabs.map((item: any) => {
          return (
            <TabItem
              item={item}
              selected={item.title === selectedTab}
              key={item.title}
              setSelectedTab={setSelectedTab}
            />
          );
        })}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInput
            textInput={textInput}
            onChange={onChangeInput}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Videos" && (
          <ImageUpload
            onSelectedImage={onSelectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectedFile={selectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error while creating post</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
