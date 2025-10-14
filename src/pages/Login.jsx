import { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';
import usePageTitle from '../hooks/usePageTitle';

const Login = () => {
  // Set page title
  usePageTitle('Login');

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [passwordStrength, setPasswordStrength] = useState({ level: '', text: '' });
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Load Font Awesome
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
    faLink.crossOrigin = 'anonymous';
    document.head.appendChild(faLink);

    // Load remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }

    // Check rate limiting
    const attempts = parseInt(sessionStorage.getItem('loginAttempts') || '0');
    const lastAttempt = parseInt(sessionStorage.getItem('lastAttemptTime') || '0');
    const lockoutDuration = 15 * 60 * 1000; // 15 minutes

    if (attempts >= 5 && Date.now() - lastAttempt < lockoutDuration) {
      setIsLocked(true);
      const remainingTime = Math.ceil((lockoutDuration - (Date.now() - lastAttempt)) / 60000);
      showAlert(`Too many failed attempts. Please try again in ${remainingTime} minutes.`, 'error');
    }

    return () => {
      document.head.removeChild(faLink);
    };
  }, [isAuthenticated, navigate]);

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!validateEmail(value)) {
        error = 'Please enter a valid email address';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long';
      }
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { level: '', text: '' };
    }

    let score = 0;
    
    if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;
    
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2;
    
    if (/^\d+$/.test(password)) score -= 1;
    if (/^[a-zA-Z]+$/.test(password)) score -= 1;
    if (/123456|password|qwerty/i.test(password)) score -= 2;
    
    score = Math.max(0, Math.min(8, score));
    
    if (score <= 2) return { level: 'weak', text: 'Weak password' };
    if (score <= 4) return { level: 'medium', text: 'Medium password' };
    if (score <= 6) return { level: 'good', text: 'Good password' };
    return { level: 'strong', text: 'Strong password' };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const translateFirebaseError = (error) => {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/invalid-credential': 'Invalid email or password'
    };
    
    return errorMessages[error.code] || 'Login failed. Please try again';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      showAlert('Account temporarily locked. Please try again later.', 'error');
      return;
    }

    // Validate all fields
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);

    if (!isEmailValid || !isPasswordValid) {
      showAlert('Please fix the errors before submitting', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Sign in using AuthContext login method
      await login(formData.email, formData.password);

      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Clear attempt count on success
      sessionStorage.removeItem('loginAttempts');
      sessionStorage.removeItem('lastAttemptTime');

      // Log security event
      // console.log('Login successful:', {
      //   email: formData.email,
      //   timestamp: new Date().toISOString()
      // });

      showAlert('Login successful! Redirecting...', 'success');

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);

      // Increment attempt count
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      sessionStorage.setItem('loginAttempts', newAttemptCount.toString());
      sessionStorage.setItem('lastAttemptTime', Date.now().toString());

      if (newAttemptCount >= 5) {
        setIsLocked(true);
        showAlert('Too many failed attempts. Account locked for 15 minutes.', 'error');
      } else {
        showAlert(translateFirebaseError(error), 'error');
      }

      // Clear password on error
      setFormData(prev => ({ ...prev, password: '' }));
      setPasswordStrength({ level: '', text: '' });

    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      showAlert('Please enter your email address first', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      showAlert('Please enter a valid email address', 'error');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      showAlert('Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
      showAlert('Failed to send reset email. Please try again.', 'error');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            <span className={styles.highlight}>Transform</span> How You Manage
            Energy
          </h1>
          <p className={styles.heroDesc}>
            Access your intelligent dashboard featuring real-time monitoring,
            predictive analytics, and seamless dual-source integration—all in
            one place.
          </p>
        </div>
        <div className={styles.heroImage}>
          <img
            src={require("../assets/logo.png")}
            alt="Smart Meter Logo"
            style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </section>

      {/* Login Section */}
      <section className={styles.loginSection}>
        <div className={styles.loginContainer}>
          {/* Logo and Branding */}
          <div className={styles.loginHeader}>
            <div className={styles.logoContainer}>
              <img
                src={require("../assets/logo.png")}
                alt="Smart Energy Meter"
                onError={(e) =>
                  (e.target.style = {
                    background: "none",
                    boxShadow: "none",
                    borderRadius: 0,
                    width: "auto",
                    height: "auto",
                  })
                }
              />
            </div>
            <h1>Welcome Back</h1>
            <p className={styles.loginSubtitle}>
              Sign in to access your Smart Energy Meter Dashboard
            </p>
          </div>

          {/* Alert Messages */}
          {alert.show && (
            <div className={`${styles.alert} ${styles[alert.type]}`}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {alert.type === "error" && (
                  <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                )}
                {alert.type === "success" && (
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z" />
                )}
                {alert.type === "info" && (
                  <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                )}
              </svg>
              <span>{alert.message}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={
                    errors.email
                      ? styles.error
                      : formData.email
                      ? styles.success
                      : ""
                  }
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className={styles.errorMessage} role="alert">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.email}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                <i className="fas fa-lock"></i>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={
                    errors.password
                      ? styles.error
                      : formData.password
                      ? styles.success
                      : ""
                  }
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <div className={styles.errorMessage} role="alert">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.password}
                </div>
              )}
              {formData.password && passwordStrength.text && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBar}>
                    <div
                      className={`${styles.strengthFill} ${
                        styles[passwordStrength.level]
                      }`}
                    ></div>
                  </div>
                  <span className={styles.strengthText}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className={styles.formOptions}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="remember-me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot-password"
                className={styles.forgotPassword}
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading || isLocked}
            >
              <span className={styles.buttonText}>
                {isLoading ? "Signing in..." : "Sign In"}
              </span>
              {isLoading && (
                <span className={styles.buttonSpinner}>
                  <i className="fas fa-circle-notch fa-spin"></i>
                </span>
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className={styles.loginFooter}>
            <p className={styles.signupPrompt}>
              Don't have an account?{" "}
              <a href="#signup" className={styles.signupLink}>
                Contact administrator
              </a>
            </p>

            {/* Security Badge */}
            <div className={styles.securityBadge}>
              <i className="fas fa-shield-alt"></i>
              <span>Secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
