import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React from "react";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from "react-icons/io5";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayName: string;
  communityId: string;
  postId: string;
  text: string;
  postTitle: string;
  createdAt: Timestamp;
};
type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  userId: string;
};
const CommentItem = ({
  comment,
  loadingDelete,
  onDeleteComment,
  userId,
}: CommentItemProps) => {
  return (
    <Flex>
      <Box mr={1}>
        <Icon as={FaReddit} fontSize={30} color={"gray.300"} />
      </Box>
      <Stack spacing={1}>
        <Stack direction={"row"} align={"center"} fontSize={"8pt"}>
          <Text fontWeight={700}>{comment.creatorDisplayName}</Text>
          <Text color={"gray.600"}>
            {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {loadingDelete && <Spinner size="sm" />}
        </Stack>
        <Text fontSize={"10pt"}>{comment.text}</Text>
        <Stack
          direction={"row"}
          align={"center"}
          cursor={"pointer"}
          color={"gray.500"}
        >
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {userId === comment.creatorId && (
            <>
              <Text className="text-[9pt] hover:text-blue-500">Edit</Text>
              <Text
                className="text-[9pt] hover:text-red-500"
                onClick={() => onDeleteComment(comment)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};

export default CommentItem;
