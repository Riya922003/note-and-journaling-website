import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { linkWithCredential, EmailAuthProvider, linkWithPopup, signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, googleProvider } from '../config/firebase';

interface SignInProps {
  onClose: () => void;
  isUpgrading?: boolean;
}

const SignIn: React.FC<SignInProps> = ({ onClose, isUpgrading = false }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signInWithEmail, signUpWithEmail, signInAnonymouslyUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isUpgrading) {
        if (!auth.currentUser) throw new Error('No user found');
        
        if (isRegistering) {
          // Create new account and link it
          const credential = EmailAuthProvider.credential(email, password);
          await linkWithCredential(auth.currentUser, credential);
        } else {
          // Link existing account
          const credential = EmailAuthProvider.credential(email, password);
          await linkWithCredential(auth.currentUser, credential);
        }
      } else {
        if (isRegistering) {
          await signUpWithEmail(email, password);
        } else {
          await signInWithEmail(email, password);
        }
      }
      onClose();
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (isUpgrading && auth.currentUser) {
        // Link Google account using linkWithPopup
        await linkWithPopup(auth.currentUser, googleProvider);
      } else {
        // For regular sign in, we'll use signInWithPopup directly
        // This will handle both new sign-ins and re-sign-ins
        const result = await signInWithPopup(auth, googleProvider);
        
        // If we get here, sign in was successful
        if (result.user) {
          console.log('Successfully signed in with Google:', result.user.email);
          onClose();
        }
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Google sign in error:', error.code, error.message);
        
        // Handle specific error cases
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            setError('An account already exists with this email. Please sign in with your original method first.');
            break;
          case 'auth/popup-closed-by-user':
            setError('Sign in was cancelled. Please try again.');
            break;
          case 'auth/cancelled-popup-request':
            // This is normal when multiple popups are triggered, we can ignore it
            break;
          case 'auth/popup-blocked':
            setError('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
            break;
          default:
            setError(error.message);
        }
      } else {
        console.error('Unexpected error during Google sign in:', error);
        setError('An unexpected error occurred during sign in');
      }
    }
  };

  const handleAnonymousSignIn = async () => {
    if (isUpgrading) {
      onClose();
      return;
    }
    try {
      await signInAnonymouslyUser();
      onClose();
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isUpgrading
            ? (isRegistering ? 'Create Account & Upgrade' : 'Link Existing Account')
            : (isRegistering ? 'Register' : 'Sign In')}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>

        {!isUpgrading && (
          <button
            onClick={handleAnonymousSignIn}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Continue as Guest
          </button>
        )}
      </div>

      {!isUpgrading && (
        <div className="text-center text-sm">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-500 hover:text-blue-600"
          >
            {isRegistering
              ? 'Already have an account? Sign in'
              : "Don't have an account? Register"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SignIn; 