import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
  id: string;
  CreateId: string;
  numberOfMember: number;
  privacyType: "public" | "private" | "restricted";
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippets {
  communityId: string;
  isModerator: boolean;
  imageURL: string;
}

export interface CommunityState {
  mySnippets: CommunitySnippets[];
  // visited Communities
  currentCommunities?: Community;
}
export const defaultCommunityState: CommunityState = {
  mySnippets: [],
};
export const communityStates = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
