import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { userApi, User as BackendUser } from '../services/api';

interface AuthContextType {
  user: FirebaseUser | null;
  backendUser: BackendUser | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  signInAnonymouslyUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch backend user profile when Firebase auth state changes
  useEffect(() => {
    const fetchBackendUser = async (firebaseUser: FirebaseUser) => {
      try {
        if (!firebaseUser.isAnonymous) {
          const profile = await userApi.getProfile();
          setBackendUser(profile);
        } else {
          setBackendUser(null);
        }
      } catch (error) {
        console.error('Error fetching backend user profile:', error);
        setBackendUser(null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', {
        isAuthenticated: !!firebaseUser,
        authMethod: firebaseUser?.providerData[0]?.providerId || 'anonymous',
        email: firebaseUser?.email || 'no email',
        isAnonymous: firebaseUser?.isAnonymous || false,
        timestamp: new Date().toISOString()
      });
      
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchBackendUser(firebaseUser);
      } else {
        setBackendUser(null);
      }
      setLoading(false);
      setAuthError(null);
    }, (error) => {
      console.error('Auth state change error:', {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      setAuthError(error.message);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateProfile = async (name: string) => {
    try {
      if (!user || user.isAnonymous) {
        throw new Error('Must be signed in to update profile');
      }
      const updatedProfile = await userApi.updateProfile({ name });
      setBackendUser(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // If the user is anonymous, delete the account
        if (currentUser.isAnonymous) {
          await deleteUser(currentUser);
        } else {
          // For non-anonymous users, just sign out
          await signOut(auth);
        }
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  const signInAnonymouslyUser = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const value = {
    user,
    backendUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOutUser,
    signInAnonymouslyUser,
    deleteAccount,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 