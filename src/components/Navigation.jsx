import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import styles from './Navigation.module.css';

const navItems = [
  { path: '/', name: 'Home' },
  { path: '/download', name: 'Download' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/login', name: 'Login' },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside or on a link
  const closeMenu = () => setIsMenuOpen(false);
  
  // Toggle menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
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
          
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? styles.active : ''}
                aria-current={window.location.pathname === item.path ? 'page' : undefined}
                onClick={closeMenu}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;