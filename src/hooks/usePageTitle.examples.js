/**
 * Example: How to use usePageTitle hook in different scenarios
 */

// ===========================
// EXAMPLE 1: Basic Usage
// ===========================
import usePageTitle from '../hooks/usePageTitle';

const HomePage = () => {
  // Sets title to: "Home - Smart Energy Meter"
  usePageTitle('Home');
  
  return <div>Home Page Content</div>;
};


// ===========================
// EXAMPLE 2: Custom Suffix
// ===========================
const AdminPage = () => {
  // Sets title to: "Admin Panel - My App"
  usePageTitle('Admin Panel', 'My App');
  
  return <div>Admin Content</div>;
};


// ===========================
// EXAMPLE 3: Dynamic Title
// ===========================
import { useState } from 'react';

const UserProfile = () => {
  const [userName, setUserName] = useState('John Doe');
  
  // Title updates when userName changes
  // Example: "John Doe's Profile - Smart Energy Meter"
  usePageTitle(`${userName}'s Profile`);
  
  return <div>Profile for {userName}</div>;
};


// ===========================
// EXAMPLE 4: Conditional Title
// ===========================
const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Shows different title based on state
  usePageTitle(isLoading ? 'Loading Dashboard...' : 'Dashboard');
  
  return <div>Dashboard Content</div>;
};


// ===========================
// EXAMPLE 5: No Suffix
// ===========================
const StandalonePage = () => {
  // Sets title to just: "Standalone Page"
  usePageTitle('Standalone Page', '');
  
  return <div>Content</div>;
};


// ===========================
// EXAMPLE 6: With User Data
// ===========================
import { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch user data
    fetchUserData().then(data => setUser(data));
  }, []);
  
  // Title updates when user data loads
  usePageTitle(user ? `${user.name}'s Dashboard` : 'Dashboard');
  
  return <div>Dashboard Content</div>;
};


// ===========================
// EXAMPLE 7: Notification Count
// ===========================
const Notifications = () => {
  const [unreadCount, setUnreadCount] = useState(5);
  
  // Shows notification count in title
  // Example: "(5) Notifications - Smart Energy Meter"
  usePageTitle(unreadCount > 0 ? `(${unreadCount}) Notifications` : 'Notifications');
  
  return <div>Notifications List</div>;
};


// ===========================
// EXAMPLE 8: Multilevel Pages
// ===========================
const ProductDetails = ({ productName }) => {
  // Example: "iPhone 15 Pro - Products - Smart Energy Meter"
  usePageTitle(`${productName} - Products`);
  
  return <div>Product Details</div>;
};


// ===========================
// EXAMPLE 9: Error Pages
// ===========================
const NotFound = () => {
  // Sets title to: "404 - Page Not Found - Smart Energy Meter"
  usePageTitle('404 - Page Not Found');
  
  return <div>Error 404</div>;
};


// ===========================
// EXAMPLE 10: Form Pages
// ===========================
const EditProfile = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Shows unsaved changes indicator
  usePageTitle(hasUnsavedChanges ? '* Edit Profile (Unsaved)' : 'Edit Profile');
  
  return <div>Edit Form</div>;
};


// ===========================
// BEST PRACTICES
// ===========================

/**
 * ✅ DO:
 * - Call usePageTitle at the top of your component
 * - Use descriptive, user-friendly titles
 * - Keep titles concise (under 60 characters for SEO)
 * - Update title based on meaningful state changes
 * - Use consistent naming patterns
 * 
 * ❌ DON'T:
 * - Call usePageTitle conditionally
 * - Call usePageTitle inside loops
 * - Use very long titles (over 70 characters)
 * - Update title too frequently (causes visual distraction)
 * - Forget to import the hook
 */

// ===========================
// COMMON PATTERNS
// ===========================

// Pattern 1: Page with filters
const ProductList = () => {
  const [filter, setFilter] = useState('all');
  usePageTitle(`Products - ${filter}`);
  return <div>Products</div>;
};

// Pattern 2: Step-by-step wizard
const Wizard = () => {
  const [step, setStep] = useState(1);
  usePageTitle(`Step ${step} of 3 - Setup Wizard`);
  return <div>Wizard</div>;
};

// Pattern 3: Real-time updates
const LiveData = () => {
  const [lastUpdate, setLastUpdate] = useState('');
  usePageTitle(`Live Data ${lastUpdate ? `(${lastUpdate})` : ''}`);
  return <div>Data</div>;
};
