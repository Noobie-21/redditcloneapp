"use client";
import { Flex, Button, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type Props = {
  selectedFile?: string;
  onSelectedImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload = ({
  onSelectedImage,
  selectedFile,
  setSelectedFile,
  setSelectedTab,
}: Props) => {
  // console.log(selectedFile, "sfsdf");
  const selectedFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex justify="center" direction="column" align="center" width="100%">
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxWidth="400px" maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button
              height="28px"
              className="bg-blue-500 p-2 text-white"
              onClick={() => setSelectedTab("Post")}
            >
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          width={"100%"}
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => {
              selectedFileRef.current?.click();
            }}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type="file"
            hidden
            onChange={onSelectedImage}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
