import { useEffect } from 'react';

/**
 * Custom hook to set page title dynamically
 * @param {string} title - The page title
 * @param {string} suffix - Optional suffix (defaults to "Smart Energy Meter")
 */
const usePageTitle = (title, suffix = 'Smart Energy Meter') => {
  useEffect(() => {
    const previousTitle = document.title;
    
    // Set new title
    document.title = title ? `${title} - ${suffix}` : suffix;
    
    // Cleanup: restore previous title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

export default usePageTitle;
