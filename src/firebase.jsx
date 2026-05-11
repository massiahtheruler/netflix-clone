import { initializeApp } from "firebase/app";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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

const formatAuthError = (error) => {
  if (!error?.code) {
    return "Something went wrong";
  }

  return error.code.split("/")[1].split("-").join(" ");
};

const syncUserDocument = async (updates) => {
  if (!auth.currentUser) {
    return;
  }

  const userQuery = query(collection(db, "user"), where("uid", "==", auth.currentUser.uid));
  const snapshot = await getDocs(userQuery);

  await Promise.all(
    snapshot.docs.map((docSnapshot) => updateDoc(docSnapshot.ref, updates)),
  );
};

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await updateProfile(user, {
      displayName: username,
    });

    await addDoc(collection(db, "user"), {
      uid: user.uid,
      username,
      authProvider: "local",
      email,
    });

    return user;
  } catch (error) {
    console.log(error);
    toast.error(formatAuthError(error));
  }
};

const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    console.error(error);
    toast.error(formatAuthError(error));
  }
};

const logout = async () => {
  await signOut(auth);
};

const updateAccountProfile = async ({ displayName, photoURL }) => {
  try {
    if (!auth.currentUser) {
      throw new Error("No authenticated user");
    }

    await updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });

    await syncUserDocument({
      username: displayName,
      photoURL,
    });

    toast.success("Profile updated");
    return true;
  } catch (error) {
    console.error(error);
    toast.error(formatAuthError(error));
    return false;
  }
};

const updateAccountEmail = async ({ newEmail, currentPassword }) => {
  try {
    if (!auth.currentUser?.email) {
      throw new Error("No authenticated user");
    }

    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

    await reauthenticateWithCredential(auth.currentUser, credential);
    await updateEmail(auth.currentUser, newEmail);
    await syncUserDocument({
      email: newEmail,
    });

    toast.success("Email updated");
    return true;
  } catch (error) {
    console.error(error);
    toast.error(formatAuthError(error));
    return false;
  }
};

const updateAccountPassword = async ({ currentPassword, newPassword }) => {
  try {
    if (!auth.currentUser?.email) {
      throw new Error("No authenticated user");
    }

    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);

    toast.success("Password updated");
    return true;
  } catch (error) {
    console.error(error);
    toast.error(formatAuthError(error));
    return false;
  }
};

export {
  auth,
  db,
  login,
  logout,
  signup,
  updateAccountEmail,
  updateAccountPassword,
  updateAccountProfile,
};
