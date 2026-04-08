import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCFngyej_je8IrleizBVtgJErRLkE9V8zI",
  authDomain: "netflix-clone-99ee8.firebaseapp.com",
  projectId: "netflix-clone-99ee8",
  storageBucket: "netflix-clone-99ee8.firebasestorage.app",
  messagingSenderId: "1068316017008",
  appId: "1:1068316017008:web:f9c3aed77d35c319afcfb5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await addDoc(collection(db, "user"), {
      uid: user.uid,
      username,
      authProvider: "local",
      email,
    });

    return user;
  } catch (error) {
    console.log(error);
    alert(error.message);
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }
};

const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "))
    
  }
};

const logout = async () => {
  await signOut(auth);
};

export { auth, db, login, signup, logout };
