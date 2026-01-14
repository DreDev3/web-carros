import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB7NqxyRYEb3mKzI8Drcc97DQemY0murZo",
  authDomain: "webcarros-c2840.firebaseapp.com",
  projectId: "webcarros-c2840",
  storageBucket: "webcarros-c2840.firebasestorage.app",
  messagingSenderId: "811187107334",
  appId: "1:811187107334:web:14d60033423511d6cf3587"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);