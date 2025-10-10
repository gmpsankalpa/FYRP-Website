import { useEffect, useState } from 'react';
import styles from './Download.module.css';

const Download = () => {
  const [selectedVersion, setSelectedVersion] = useState('v1.5.2');
  const [activeFaq, setActiveFaq] = useState(null);

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

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const changelogs = {
    'v1.5.2': {
      date: '2025-09-30',
      changes: [
        'Enhanced real-time monitoring with improved accuracy',
        'Added support for multiple devices',
        'Improved notification system',
        'Bug fixes and performance improvements'
      ]
    },
    'v1.5.1': {
      date: '2025-09-29',
      changes: [
        'Fixed critical security vulnerability',
        'Improved battery optimization',
        'Enhanced UI/UX design',
        'Minor bug fixes'
      ]
    },
    'v1.4.1': {
      date: '2025-03-17',
      changes: [
        'Added dark mode support',
        'Improved data synchronization',
        'Performance enhancements'
      ]
    },
    'v1.0.0': {
      date: '2024-03-11',
      changes: [
        'Initial release',
        'Basic energy monitoring features',
        'Real-time alerts'
      ]
    }
  };

  const faqs = [
    {
      question: 'Is the app free to use?',
      answer: 'Yes, the Smart Energy Meter app is completely free to download and use with all features included.'
    },
    {
      question: 'What are the minimum requirements?',
      answer: 'For Android: Version 5.0 (Lollipop) or higher. The app requires approximately 25MB of storage space.'
    },
    {
      question: 'How do I install the APK file?',
      answer: 'Download the APK file, enable "Install from Unknown Sources" in your device settings, then tap the downloaded file to install.'
    },
    {
      question: 'When will the iOS version be available?',
      answer: 'The iOS version is currently in development. Sign up for notifications to be informed when it becomes available.'
    }
  ];

  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1><span className={styles.highlight}>Download</span> Smart Energy Meter App</h1>
          <p className={styles.heroDesc}>Get our powerful mobile application to monitor and control your energy consumption from anywhere.</p>
          <a href="#download-section" className={styles.ctaBtn}>Download Now</a>
        </div>
        <div className={styles.heroImage}>
          <img src={require('../assets/app_icon.png')} alt="Smart Meter App Icon" onError={e => e.target.style.display = 'none'} />
        </div>
      </section>

      {/* Download Options Section */}
      <section id="download-section" className={styles.downloadSection}>
        <h2>Download for Your Platform</h2>
        <p className={styles.sectionSubtitle}>Choose your device to get started with Smart Energy Meter</p>
        
        <div className={styles.downloadGrid}>
          {/* Android Download Card */}
          <div className={styles.downloadCard}>
            <div className={styles.cardHeader}>
              <div className={styles.platformIcon}>
                <i className="fab fa-android"></i>
              </div>
              <div className={`${styles.availabilityBadge} ${styles.available}`}>
                <i className="fas fa-check-circle"></i>
                <span>Available</span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <h3>Android App</h3>
              <p className={styles.platformDescription}>
                Download our full-featured Android application for comprehensive energy monitoring on the go.
              </p>
              
              <div className={styles.appSpecs}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Version:</span>
                  <span className={styles.specValue}>1.5.2</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Size:</span>
                  <span className={styles.specValue}>25 MB</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Min. Android:</span>
                  <span className={styles.specValue}>5.0 (Lollipop)</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Last Updated:</span>
                  <span className={styles.specValue}>Sep 30, 2025</span>
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <a href="/assets/app/app-release.apk" className={`${styles.downloadButton} ${styles.androidBtn}`} download>
                <i className="fas fa-download"></i>
                <span>Download APK</span>
              </a>
              <p className={styles.securityNote}>
                <i className="fas fa-shield-alt"></i>
                Safe & Secure Download
              </p>
            </div>
          </div>

          {/* iOS Download Card */}
          <div className={`${styles.downloadCard} ${styles.unavailable}`}>
            <div className={styles.cardHeader}>
              <div className={styles.platformIcon}>
                <i className="fab fa-apple"></i>
              </div>
              <div className={`${styles.availabilityBadge} ${styles.unavailable}`}>
                <i className="fas fa-clock"></i>
                <span>Coming Soon</span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <h3>iOS App</h3>
              <p className={styles.platformDescription}>
                Our iOS application is currently in development. Get notified when it's ready for download.
              </p>
              
              <div className={styles.progressInfo}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '75%' }}></div>
                </div>
                <p className={styles.progressText}>Development Progress: 75%</p>
              </div>
              
              <div className={styles.appSpecs}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Est. Release:</span>
                  <span className={styles.specValue}>Q1 2026</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Min. iOS:</span>
                  <span className={styles.specValue}>14.0+</span>
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <button className={`${styles.downloadButton} ${styles.iosBtn} ${styles.disabled}`} disabled>
                <i className="far fa-bell"></i>
                <span>Notify Me</span>
              </button>
              <p className={styles.releaseInfo}>
                <i className="fas fa-info-circle"></i>
                App Store release pending
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className={styles.featuresModern}>
        <h2>App Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>⚡</span>
            <h3>Real-Time Monitoring</h3>
            <p>Track your energy consumption in real-time with live updates and detailed analytics.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📊</span>
            <h3>Usage Analytics</h3>
            <p>Visualize your energy patterns with interactive charts and comprehensive reports.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🔔</span>
            <h3>Smart Alerts</h3>
            <p>Receive instant notifications about unusual consumption or system anomalies.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🛠️</span>
            <h3>Remote Control</h3>
            <p>Control your energy system remotely from anywhere with secure access.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🔒</span>
            <h3>Theft Detection</h3>
            <p>Advanced algorithms detect tampering and unauthorized energy usage.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>💾</span>
            <h3>Data Export</h3>
            <p>Export your energy data for record-keeping and further analysis.</p>
          </div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className={styles.screenshotsSection}>
        <h2>App Screenshots</h2>
        <p className={styles.sectionSubtitle}>See the app in action on mobile devices</p>
        <div className={styles.deviceShowcase}>
          <div className={styles.deviceMockup}>
            <div className={styles.deviceFrame}>
              <div className={styles.deviceScreen}>
                <div className={styles.screenshotsSlider}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className={styles.slideItem}>
                      <img 
                        src={require(`../assets/img/Screenshot_175916${num === 1 ? '0335' : num === 2 ? '0574' : num === 3 ? '0723' : num === 4 ? '0734' : '0755'}.png`)} 
                        alt={`App Screenshot ${num}`} 
                        loading="lazy"
                        onError={e => e.target.style.display = 'none'}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Device Details */}
              <div className={styles.deviceNotch}></div>
              <div className={styles.deviceButton}></div>
            </div>
          </div>
          <div className={styles.screenshotThumbnails}>
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className={styles.thumbnailItem}>
                <img 
                  src={require(`../assets/img/Screenshot_175916${num === 1 ? '0335' : num === 2 ? '0574' : num === 3 ? '0723' : num === 4 ? '0734' : '0755'}.png`)} 
                  alt={`Thumbnail ${num}`}
                  loading="lazy"
                  onError={e => e.target.style.display = 'none'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide Section */}
      <section className={styles.guideSection}>
        <h2>Installation Guide</h2>
        <div className={styles.guideSteps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Download APK</h3>
              <p>Click the download button above to get the latest version of the app.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Enable Unknown Sources</h3>
              <p>Go to Settings → Security → Enable "Install from Unknown Sources"</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Install App</h3>
              <p>Tap the downloaded APK file and follow the installation prompts.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Start Monitoring</h3>
              <p>Open the app, log in, and start monitoring your energy consumption!</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Change Log Section */}
      <section className={styles.changelogSection}>
        <h2>App Change Log</h2>
        <label htmlFor="changelog-version-select">Select Version:</label>
        <select 
          id="changelog-version-select" 
          value={selectedVersion}
          onChange={(e) => setSelectedVersion(e.target.value)}
        >
          <option value="v1.5.2">v1.5.2 (2025-09-30)</option>
          <option value="v1.5.1">v1.5.1 (2025-09-29)</option>
          <option value="v1.4.1">v1.4.1 (2025-03-17)</option>
          <option value="v1.0.0">v1.0.0 (2024-03-11)</option>
        </select>
        <div className={styles.changelogList}>
          <div className={styles.changelogVersion}>
            <h3>
              {selectedVersion}
              {selectedVersion === 'v1.5.2' && <span className={styles.latestBadge}>Latest</span>}
              <span className={styles.changelogDate}>{changelogs[selectedVersion].date}</span>
            </h3>
            <ul>
              {changelogs[selectedVersion].changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={`${styles.faqItem} ${activeFaq === index ? styles.active : ''}`}>
              <button className={styles.faqQuestion} onClick={() => toggleFaq(index)}>
                {faq.question}
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Section */}
      <section className={styles.socialModern}>
        <h2>Connect with the Developer</h2>
        <div className={styles.socialIcons}>
          <a href="https://github.com/gmpsankalpa" target="_blank" rel="noopener noreferrer" title="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://linkedin.com/in/gmpsankalpa" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://twitter.com/gmpsankalpa" target="_blank" rel="noopener noreferrer" title="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://facebook.com/gmpsankalpa" target="_blank" rel="noopener noreferrer" title="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
        <p className={styles.devCredit}>Developed by <strong>GMP Sankalpa</strong> | Final Year Project</p>
      </section>
    </main>
  );
};

export default Download;
