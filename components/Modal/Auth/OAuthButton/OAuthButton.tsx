import { auth, firestore } from "@/firebase/clientApp";
import { Button, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OAuthButton = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    const collectionRef = doc(firestore, "Users", user.uid);

    await setDoc(collectionRef, {
      displayName: user.displayName,
      email: user.email,
      profileImage: user.photoURL,
      userId: user.uid,
    });
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);
  return (
    <div className="flex justify-center w-full mb-4 ">
      <Button
        variant="oauth"
        className=""
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src={"/images/googlelogo.png"}
          height={"20px"}
          className="mr-2"
        />
        Continue with Google
      </Button>
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default OAuthButton;
