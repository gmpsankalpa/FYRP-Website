import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Error404.module.css';

const Error404 = () => {
  useEffect(() => {
    // Load Font Awesome
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
    faLink.crossOrigin = 'anonymous';
    document.head.appendChild(faLink);
    return () => {
      document.head.removeChild(faLink);
    };
  }, []);

  return (
    <main>
      {/* 404 Error Section */}
      <section className={styles.errorSection}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Page Not Found</h2>
          <p className={styles.errorDesc}>
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <div className={styles.errorActions}>
            <Link to="/" className={styles.homeBtn}>
              <i className="fas fa-home"></i> Go to Homepage
            </Link>
            <Link to="/contact" className={styles.contactBtn}>
              <i className="fas fa-envelope"></i> Contact Support
            </Link>
          </div>
        </div>
        <div className={styles.errorVisual}>
          <div className={styles.notFoundGraphic}>
            <div className={styles.graphicCircle}></div>
            <div className={styles.graphicText}>404</div>
          </div>
        </div>
      </section>

      {/* Helpful Links Section */}
      <section className={styles.helpfulLinks}>
        <h2>You might be looking for:</h2>
        <div className={styles.linksGrid}>
          <Link to="/" className={styles.linkCard}>
            <i className="fas fa-home"></i>
            <h3>Home</h3>
            <p>Return to the homepage</p>
          </Link>
          <Link to="/download" className={styles.linkCard}>
            <i className="fas fa-download"></i>
            <h3>Download</h3>
            <p>Get the Smart Energy Meter app</p>
          </Link>
          <Link to="/about" className={styles.linkCard}>
            <i className="fas fa-info-circle"></i>
            <h3>About</h3>
            <p>Learn more about the project</p>
          </Link>
          <Link to="/contact" className={styles.linkCard}>
            <i className="fas fa-envelope"></i>
            <h3>Contact</h3>
            <p>Get in touch with us</p>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Error404;
