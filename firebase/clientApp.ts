// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbY5R_kC3G1Hi9VWo5o3EsHBNWS8xHei0",
  authDomain: "redditclone-8a639.firebaseapp.com",
  projectId: "redditclone-8a639",
  storageBucket: "redditclone-8a639.appspot.com",
  messagingSenderId: "850289150688",
  appId: "1:850289150688:web:5a8cf6a95958c8ae6ade85"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const firestore = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export {app , firestore , auth , storage};