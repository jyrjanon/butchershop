// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); // This will remain true until we check everything

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // If a user is logged in, fetch their profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data());
        } else {
          // Explicitly set profile to null if it doesn't exist
          setUserProfile(null);
        }
      } else {
        // No user, so no profile
        setUserProfile(null);
      }
      // Only set loading to false AFTER we have checked for a user and their profile
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = () => {
    const auth = getAuth();
    setCurrentUser(null);
    setUserProfile(null);
    return firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    userProfile,
    signOut,
    loading,
  };

  // We still wait for the initial check to complete before rendering the app
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}