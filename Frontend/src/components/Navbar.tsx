import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SignIn from './SignIn';

const Navbar: React.FC = () => {
  const { user, signOutUser } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  // Add effect to log auth state changes
  useEffect(() => {
    console.log('Auth state changed:', user ? 'User logged in' : 'No user');
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowSignIn(false); // Ensure sign in dialog is closed after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close sign in dialog when user successfully signs in
  useEffect(() => {
    if (user && !user.isAnonymous) {
      setShowSignIn(false);
    }
  }, [user]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Note & Journal</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">
                  {user.isAnonymous ? 'Guest User' : user.email}
                </span>
                {user.isAnonymous ? (
                  <button
                    onClick={() => setShowSignIn(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.isAnonymous ? 'Sign In to Save Your Notes' : 'Sign In'}
              </h2>
              <button
                onClick={() => setShowSignIn(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {user?.isAnonymous && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                Sign in to save your notes permanently and access them across devices.
              </div>
            )}
            <SignIn onClose={() => setShowSignIn(false)} isUpgrading={user?.isAnonymous || false} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 