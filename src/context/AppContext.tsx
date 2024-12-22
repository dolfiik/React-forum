import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc, arrayUnion, deleteDoc} from 'firebase/firestore';

interface User {
  uid: string;
  email: string | null;
  username: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  likes: string[];
  createAt: Date;
  comments: { userId: string, content: string, username?: string }[];
}

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null >>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  createPost: (title: string, content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  fetchPosts: () => Promise<Post[]>;
  loading: boolean;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, commentContent: string) => Promise<void>;
  posts: Post[];
  usersMap: Map<string, string>
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersMap, setUsersMap] = useState<Map<string, string>>(new Map());

  const fetchPosts = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "posts"));

    const usersDb = getFirestore();
    const userSnapshot = await getDocs(collection(usersDb, "users"));
    const usersMap = new Map(
      userSnapshot.docs.map(doc => [doc.id, doc.data().username])
    );

    setUsersMap(usersMap);
    const fetchedPosts = await Promise.all(querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();

      const usernameComments = (postData.comments || []).map((comment: any) => ({
        ...comment,
        username: usersMap.get(comment.userId) || comment.userId
      }));

      return {
        id: postDoc.id,
        ...postData,
        likes: postData.likes || [],
        comments: usernameComments,
        createAt: postData.createAt?.toDate() || new Date()
      } as Post;
    }));

    setPosts(fetchedPosts);
    return fetchedPosts;
  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setLoading(true);
    try {
      if (currentUser) {
        const db = getFirestore();
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({uid: currentUser.uid, email: currentUser.email, username: docSnap.data().username});
          await fetchPosts();
        } else {
        console.warn("No user document found for authenticated user");
        setUser(null);
        setPosts([]);
      }
    } else {
      setUser(null);
      setPosts([]);
    }
  } catch (error) {
    console.log("Authentication state check error: ", error);
    setUser(null);
    setPosts([]);
  } finally {
    setLoading(false);
  }
 });
    return () => unsubscribe();
}, []);

  //  const login = async (email: string, password: string) => {
  //  console.log("Authenticating with Firebase");
  //  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //  console.log("Firebase authentication successful", userCredential.user.uid);
  //};

  const login = async (email: string, password: string) => {
    try {
      console.log("Authenticating with Firebase");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase authentication successful", userCredential.user.uid);

      const db = getFirestore();
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if(userDoc.exists()) {
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          username:userDoc.data().username,
        });
      } else { 
        console.warn("No user document found for authenicated user");
      } 
    } catch (error) {
      console.error("Login process error: ", error);
      throw error;
    }
  };
  
  const signup = async (username: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const db = getFirestore();
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
    });
  };

  const logout = async () => {
    try {
      setLoading(true);
      await auth.signOut();
      setUser(null);
      setPosts([]);
      console.log("stan zresetowany");
    } catch (error) {
      console.error("logout error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, content: string) => {
    if(!user) return;

    const db = getFirestore();
    await addDoc(collection(db, "posts"), {
      title,
      content,
      userId: user.uid,
      createAt: new Date(),
      likes: [],
      comments: [],
    });

    await fetchPosts();
  };

  const deletePost = async (postId: string) => {
    if(!user) return;

    const db = getFirestore();
    const postRef = doc(db, 'posts', postId);

    try {
      const postSnapshot = await getDoc(postRef);

      if (!postSnapshot.exists()) {
        console.error('Post does not exist');
        return;
      }

      const postData = postSnapshot.data() as Post;

      if (postData.userId !== user.uid) {
        console.error('You are not authorized to delete this post');
        return;
      }

      await deleteDoc(postRef);
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }


  const likePost = async (postId: string) => {
    if (!user) return;

    const db = getFirestore();
    const postRef = doc(db, "posts", postId);
    const postSnapshot = await getDoc(postRef);

    if(postSnapshot.exists()) {
      const postData = postSnapshot.data() as Post;
      let updatedLikes: string[];

      if (postData.likes && postData.likes.includes(user.uid)) {
        updatedLikes = postData.likes.filter(uid => uid !== user.uid);
      } else {
        updatedLikes = [...(postData.likes || []), user.uid];
      }

      await updateDoc(postRef, { likes: updatedLikes });
      await fetchPosts(); // refresh postow po lajkowaniu/odlajkowaniu
    } else {
      console.error("Post nie istnieje");
    }
  };


  const addComment = async (postId: string , commentContent: string) => {
    if (!user) return; 

    const db = getFirestore();
    const postRef = doc(db, "posts", postId);

    await updateDoc(postRef, {
      comments: arrayUnion({
        userId: user.uid,
        content: commentContent,
        username: user.username
      })
    });
    await fetchPosts(); // refresh po dodaniu komentarza
  };

  return (
    <AppContext.Provider value = {{ user, setUser, login, signup, logout, createPost, fetchPosts, loading, likePost, addComment, posts, deletePost, usersMap }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext musi byc uzyte w AppProvider'rze");
  return context;
};

