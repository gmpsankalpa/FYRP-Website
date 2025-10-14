import { useEffect, useState } from 'react';
import styles from './Download.module.css';
import usePageTitle from '../hooks/usePageTitle';
import { SkeletonCard } from '../components/SkeletonLoader';

const Download = () => {
  // Set page title
  usePageTitle('Download');

  const [selectedVersion, setSelectedVersion] = useState('v1.5.2');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [changelogs, setChangelogs] = useState({});
  const [isLoadingChangelogs, setIsLoadingChangelogs] = useState(true);
  const [changelogError, setChangelogError] = useState(null);
  const [latestRelease, setLatestRelease] = useState(null);

  // Fetch GitHub releases function
  const fetchGitHubReleases = async () => {
    try {
      setIsLoadingChangelogs(true);
      setChangelogError(null);
      const response = await fetch('https://api.github.com/repos/gmpsankalpa/smart_energy_meter/releases');
      
      if (!response.ok) {
        throw new Error('Failed to fetch releases');
      }
      
      const releases = await response.json();
      
      // Store the latest release details
      if (releases.length > 0) {
        const latest = releases[0];
        setLatestRelease({
          version: latest.tag_name.replace('v', ''), // Remove 'v' prefix
          tagName: latest.tag_name,
          date: new Date(latest.published_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          downloadUrl: latest.assets.find(asset => asset.name.endsWith('.apk'))?.browser_download_url || '/assets/app/app-release.apk',
          size: latest.assets.find(asset => asset.name.endsWith('.apk'))?.size 
            ? `${(latest.assets.find(asset => asset.name.endsWith('.apk')).size / (1024 * 1024)).toFixed(1)} MB`
            : '25 MB'
        });
      }
      
      // Transform GitHub releases to changelog format
      const transformedChangelogs = {};
      releases.forEach(release => {
        const version = release.tag_name;
        const date = new Date(release.published_at).toISOString().split('T')[0];
        
        // Parse release notes into changes array
        const changes = release.body
          ? release.body
              .split('\n')
              .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
              .map(line => line.replace(/^[-*]\s*/, '').trim())
              .filter(line => line.length > 0)
          : ['Release notes not available'];
        
        transformedChangelogs[version] = {
          date,
          changes: changes.length > 0 ? changes : ['No changes documented']
        };
      });
      
      // If no releases found, use fallback data
      if (Object.keys(transformedChangelogs).length === 0) {
        setChangelogs(getFallbackChangelogs());
        setLatestRelease({
          version: '1.5.2',
          tagName: 'v1.5.2',
          date: 'Sep 30, 2025',
          downloadUrl: '/assets/app/app-release.apk',
          size: '25 MB'
        });
      } else {
        setChangelogs(transformedChangelogs);
        // Set the latest version as selected
        if (releases.length > 0) {
          setSelectedVersion(releases[0].tag_name);
        }
      }
      
      setChangelogError(null);
    } catch (error) {
      console.error('Error fetching GitHub releases:', error);
      setChangelogError('Unable to fetch latest releases. Showing cached data.');
      setChangelogs(getFallbackChangelogs());
      setLatestRelease({
        version: '1.5.2',
        tagName: 'v1.5.2',
        date: 'Sep 30, 2025',
        downloadUrl: '/assets/app/app-release.apk',
        size: '25 MB'
      });
    } finally {
      setIsLoadingChangelogs(false);
    }
  };

  // Fetch GitHub releases on mount
  useEffect(() => {
    fetchGitHubReleases();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback changelog data
  const getFallbackChangelogs = () => ({
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
  });

  useEffect(() => {
    // Load Font Awesome
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
    faLink.crossOrigin = 'anonymous';
    document.head.appendChild(faLink);
    
    // Set initial load to false after a short delay
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 800);
    
    return () => {
      document.head.removeChild(faLink);
      clearTimeout(timer);
    };
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
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
          <img 
            src={require('../assets/app_icon.png')} 
            alt="Smart Meter App Icon" 
            loading="lazy"
            decoding="async"
            onError={e => e.target.style.display = 'none'} 
          />
        </div>
      </section>

      {/* Download Options Section */}
      <section id="download-section" className={styles.downloadSection}>
        <h2>Download for Your Platform</h2>
        <p className={styles.sectionSubtitle}>Choose your device to get started with Smart Energy Meter</p>
        
        {isInitialLoad ? (
          <div className={styles.downloadGrid}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
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
                  <span className={styles.specValue}>
                    {isLoadingChangelogs ? (
                      <i className="fas fa-spinner fa-pulse"></i>
                    ) : (
                      latestRelease?.version || '1.5.2'
                    )}
                  </span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Size:</span>
                  <span className={styles.specValue}>
                    {isLoadingChangelogs ? (
                      <i className="fas fa-spinner fa-pulse"></i>
                    ) : (
                      latestRelease?.size || '25 MB'
                    )}
                  </span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Min. Android:</span>
                  <span className={styles.specValue}>5.0 (Lollipop)</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Last Updated:</span>
                  <span className={styles.specValue}>
                    {isLoadingChangelogs ? (
                      <i className="fas fa-spinner fa-pulse"></i>
                    ) : (
                      latestRelease?.date || 'Sep 30, 2025'
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <a 
                href={latestRelease?.downloadUrl || '/assets/app/app-release.apk'} 
                className={`${styles.downloadButton} ${styles.androidBtn}`} 
                download
              >
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
        )}
      </section>

      {/* App Features Section */}
      <section className={styles.featuresModern}>
        <h2>App Features</h2>
        {isInitialLoad ? (
          <div className={styles.featuresGrid}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><i className="fas fa-bolt"></i></div>
              <h3>Real-Time Monitoring</h3>
              <p>Track your energy consumption in real-time with live updates and detailed analytics.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><i className="fas fa-chart-line"></i></div>
              <h3>Usage Analytics</h3>
              <p>Visualize your energy patterns with interactive charts and comprehensive reports.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><i className="fas fa-bell"></i></div>
              <h3>Smart Alerts</h3>
              <p>Receive instant notifications about unusual consumption or system anomalies.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><i className="fas fa-sliders-h"></i></div>
              <h3>Remote Control</h3>
              <p>Control your energy system remotely from anywhere with secure access.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><i className="fas fa-shield-alt"></i></div>
              <h3>Theft Detection</h3>
              <p>Advanced algorithms detect tampering and unauthorized energy usage.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}><i className="fas fa-file-export"></i></div>
              <h3>Data Export</h3>
              <p>Export your energy data for record-keeping and further analysis.</p>
            </div>
          </div>
        )}
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
        
        {changelogError && (
          <div className={styles.changelogError}>
            <i className="fas fa-exclamation-triangle"></i>
            <span>{changelogError}</span>
          </div>
        )}
        
        {isLoadingChangelogs ? (
          <div className={styles.changelogLoading}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading releases from GitHub...</p>
          </div>
        ) : (
          <>
            <div className={styles.changelogHeader}>
              <label htmlFor="changelog-version-select">Select Version:</label>
              <button 
                className={styles.refreshButton}
                onClick={fetchGitHubReleases}
                title="Refresh releases"
                disabled={isLoadingChangelogs}
              >
                <i className={`fas fa-sync-alt ${isLoadingChangelogs ? 'fa-spin' : ''}`}></i>
              </button>
            </div>
            
            <select 
              id="changelog-version-select" 
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
            >
              {Object.keys(changelogs).map(version => (
                <option key={version} value={version}>
                  {version} ({changelogs[version].date})
                </option>
              ))}
            </select>
            
            <div className={styles.changelogList}>
              {changelogs[selectedVersion] && (
                <div className={styles.changelogVersion}>
                  <h3>
                    {selectedVersion}
                    {selectedVersion === Object.keys(changelogs)[0] && (
                      <span className={styles.latestBadge}>Latest</span>
                    )}
                    <span className={styles.changelogDate}>
                      {changelogs[selectedVersion].date}
                    </span>
                  </h3>
                  <ul>
                    {changelogs[selectedVersion].changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                  <div className={styles.githubLink}>
                    <a 
                      href={`https://github.com/gmpsankalpa/smart_energy_meter/releases/tag/${selectedVersion}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-github"></i>
                      View on GitHub
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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
    </main>
  );
};

export default Download;
