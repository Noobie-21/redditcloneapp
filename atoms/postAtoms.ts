import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
  id?: string;
  communityId: string;
  creatorDisplayName: string;
  creatorId: string;
  title: string;
  body: string;
  numberOfComments: number;
  imageURL?: string;
  communityImageURL?: string;
  createdAt: Timestamp;
  voteStatus: number;
};
export type PostVotes = {
  id?: string;
  postId: string;
  communityId: string;
  votesValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVotes[];
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postState = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});
