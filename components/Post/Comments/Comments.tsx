"use client";
import { Post, postState } from "@/atoms/postAtoms";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import CommentInput from "./CommentDirectory/CommentInput";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { useRecoilState, useSetRecoilState } from "recoil";
import CommentItem, { Comment } from "./CommentDirectory/CommentItem";
import { log } from "console";

type CommentProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments = ({ communityId, selectedPost, user }: CommentProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState("");

  const setPostState = useSetRecoilState(postState);
  const number = [1, 2, 3];
  const onCreateComments = async (commentText: string) => {
    setCreateLoading(true);
    try {
      // create a comment Document
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "Comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user?.uid,
        creatorDisplayName: user.email!?.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;
      // update the numberOfComment in post (+1)
      const postDocRef = doc(firestore, "Posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();
      // update the recoil state
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error: any) {
      console.log("Error ", error.message);
    }
    setCreateLoading(false);
  };
  const onDeleteComment = async (comment: Comment) => {
    setLoadingDelete(comment.id);
    try {
      // Delete the comment
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "Comments", comment.id);
      batch.delete(commentDocRef);
      // update the number of comment -1
      const postDocRef = doc(firestore, "Posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });
      await batch.commit();
      // update the client recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log("Error : ", error.message);
    }
    setLoadingDelete("");
  };
  const getPostComment = async () => {
    try {
      const commentQuery = query(
        collection(firestore, "Comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("Erro :", error.message);
    }
    setFetchLoading(false);
  };
  console.log(comments, "☆*: .｡. o(≧▽≦)o .｡.:*☆");
  useEffect(() => {
    if (!selectedPost) return;
    getPostComment();
  }, [selectedPost]);
  return (
    <Box bg="white " borderRadius={"0px 4px 0px 4px "} p={2}>
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize={"10pt"}
        width={"100%"}
      >
        <CommentInput
          //   comment={comment}
          commentText={commentText}
          createLoading={createLoading}
          onCreateComments={onCreateComments}
          user={user}
          setCommentText={setCommentText}
          //   setComment={setComment}
        />
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          number.map((item) => (
            <Box key={item} p={6} bg="white">
              <SkeletonCircle size="10" />
              <SkeletonText mt={4} noOfLines={2} spacing={4} />
            </Box>
          ))
        ) : (
          <>
            {comments.length === 0 ? (
              <>
                <Flex
                  direction={"column"}
                  justify="center"
                  align="cneter"
                  borderTop="1px solid"
                  borderColor="gray.100"
                  p={20}
                >
                  <Text fontWeight={700} opacity={0.3}>
                    No Comments Yet
                  </Text>
                </Flex>
              </>
            ) : (
              <>
                {comments.map((comment) => {
                  return (
                    <CommentItem
                      comment={comment}
                      loadingDelete={loadingDelete === comment.id}
                      onDeleteComment={onDeleteComment}
                      userId={user?.uid}
                      key={comment.id}
                    />
                  );
                })}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
