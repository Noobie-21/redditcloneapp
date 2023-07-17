"use client";
import { Button, Flex, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import React from "react";

type Props = {
  textInput: {
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInput = ({
  textInput,
  onChange,
  handleCreatePost,
  loading,
}: Props) => {
  return (
    <Stack spacing={3} width={"100%"} p={4}>
      <Input
        name="title"
        value={textInput.title}
        onChange={onChange}
        borderRadius={4}
        fontSize="10pt"
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Textarea
        name="body"
        value={textInput.body}
        onChange={onChange}
        height="100px"
        borderRadius={4}
        fontSize="10pt"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
      />
      <Flex p={4} justify="flex-end">
        <Button
          height="34px"
          padding="8px 30px"
          className="bg-blue-500 text-white "
          disabled={!textInput.title}
          onClick={handleCreatePost}
          isLoading={loading}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInput;
