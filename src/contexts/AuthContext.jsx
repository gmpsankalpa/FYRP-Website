import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */
const AuthContext = createContext({});

/**
 * Custom hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Wraps the app to provide authentication state
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function (defined early for use in checkSessionExpiry)
  const logout = useCallback(async () => {
    const auth = getAuth();
    await signOut(auth);
    
    // Clear all session data
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  // Check if session has expired
  const checkSessionExpiry = useCallback(() => {
    const expiryTime = localStorage.getItem('sessionExpiry');
    if (expiryTime) {
      const now = new Date().getTime();
      if (now > parseInt(expiryTime)) {
        // Session expired - logout
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    const auth = getAuth();
    
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Update localStorage for session persistence
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        
        // Set session expiry (24 hours)
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('sessionExpiry', expiryTime.toString());
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('sessionExpiry');
      }
    });

    // Check session expiry on mount
    checkSessionExpiry();

    return unsubscribe;
  }, [checkSessionExpiry]);

  // Login function
  const login = async (email, password) => {
    const auth = getAuth();
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Refresh session expiry
  const refreshSession = () => {
    if (currentUser) {
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem('sessionExpiry', expiryTime.toString());
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    refreshSession,
    isAuthenticated: !!currentUser,
    userEmail: currentUser?.email || null,
    userId: currentUser?.uid || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
