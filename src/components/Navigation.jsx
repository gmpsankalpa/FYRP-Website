import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '../assets/logo.png';
import styles from './Navigation.module.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  // Minimum swipe distance (in px) to trigger close
  const minSwipeDistance = 50;

  // Check authentication status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email);
        // Store session in localStorage for persistence
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        // Clear session from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
      }
    });
    return () => unsubscribe();
  }, []);

  // Load Font Awesome for icons
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }
  }, []);

  // Show Toast Notification
  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Clear all session data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      sessionStorage.clear();
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      displayToast('Failed to logout. Please try again.');
    }
  };

  // Dynamic navigation items based on login status
  const navItems = isLoggedIn
    ? [
        { path: '/', name: 'Home', icon: 'fas fa-home' },
        { path: '/download', name: 'Download', icon: 'fas fa-download' },
        { path: '/about', name: 'About', icon: 'fas fa-info-circle' },
        { path: '/contact', name: 'Contact', icon: 'fas fa-envelope' },
        { path: '/dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      ]
    : [
        { path: '/', name: 'Home', icon: 'fas fa-home' },
        { path: '/download', name: 'Download', icon: 'fas fa-download' },
        { path: '/about', name: 'About', icon: 'fas fa-info-circle' },
        { path: '/contact', name: 'Contact', icon: 'fas fa-envelope' },
        { path: '/login', name: 'Login', icon: 'fas fa-sign-in-alt' },
      ];

  // Quick links for additional pagesquickLinks
  const quickLinks = [
    { path: '/faq', name: 'FAQ', icon: 'fas fa-question-circle' },
    { path: '/help', name: 'Help Center', icon: 'fas fa-life-ring' },
    { path: '/ai-model', name: 'AI Model', icon: 'fas fa-robot' },
    { path: '/change-log', name: 'Change Log', icon: 'fas fa-list-alt' },
    { path: '/source', name: 'Source Code', icon: 'fas fa-code' },
  ];

  // Close menu when clicking outside or on a link
  const closeMenu = () => setIsMenuOpen(false);
  
  // Toggle menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Scroll to top when navigating
  const handleNavClick = () => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle touch start
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end - detect swipe
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Close menu on right swipe (swipe away)
    if (isRightSwipe && isMenuOpen) {
      closeMenu();
    }
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.navOverlay} ${isMenuOpen ? styles.active : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      
      <nav className={styles.modernNav}>
        <div className={styles.navLogo}>
          <img 
            src={logo} 
            alt="Smart Energy Meter" 
            style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }} 
          />
          <span>Smart Energy Meter</span>
        </div>

        {/* Hamburger Toggle Button */}
        <button
          className={`${styles.navToggle} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.navToggleIcon}></span>
        </button>

        {/* Navigation Links */}
        <ul 
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Menu Header with Logo */}
          <li className={styles.navMenuHeader}>
            <div className={styles.navMenuLogo}>
              <img 
                src={logo} 
                alt="Smart Meter Logo" 
                style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }} 
              />
              <span>Smart Energy Meter</span>
            </div>
          </li>
          
          {/* Main Navigation */}
          <li className={styles.menuSectionTitle}>
            <i className="fas fa-bars"></i> Main Menu
          </li>
          
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? styles.active : ''}
                aria-current={window.location.pathname === item.path ? 'page' : undefined}
                onClick={handleNavClick}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}

          {/* Quick Links Section */}
          <li className={styles.navDivider}></li>
          <li className={styles.menuSectionTitle}>
            <i className="fas fa-link"></i> Quick Links
          </li>
          
          {quickLinks.map(link => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => isActive ? styles.active : ''}
                onClick={handleNavClick}
              >
                <i className={link.icon}></i>
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}

          {/* User Info & Logout Button (only shown when logged in) */}
          {isLoggedIn && (
            <>
              <li className={styles.navDivider}></li>
              <li className={styles.navUserInfo}>
                <span className={styles.userEmail}>
                  <i className="fas fa-user-circle"></i> {userEmail}
                </span>
              </li>
              <li>
                <button
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Toast Notification */}
      {showToast && (
        <div className={styles.toast}>
          <i className="fas fa-exclamation-circle"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default Navigation;