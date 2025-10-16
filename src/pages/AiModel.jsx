import { useEffect, useState } from 'react';
import styles from './AiModel.module.css';
import usePageTitle from '../hooks/usePageTitle';
import { SkeletonCard } from '../components/SkeletonLoader';

const AiModel = () => {
    // Set page title
    usePageTitle('AI Model - Theft Detection');

    const [selectedVersion, setSelectedVersion] = useState('');
    const [changelogs, setChangelogs] = useState({});
    const [isLoadingChangelogs, setIsLoadingChangelogs] = useState(true);
    const [changelogError, setChangelogError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Fetch GitHub releases function
    const fetchGitHubReleases = async () => {
        try {
            setIsLoadingChangelogs(true);
            setChangelogError(null);
            const response = await fetch('https://api.github.com/repos/gmpsankalpa/FYRP-AI-Model/releases');

            if (!response.ok) {
                // Handle specific GitHub API responses
                if (response.status === 403) {
                    // Rate limit or forbidden
                    const reset = response.headers.get('X-RateLimit-Reset');
                    let msg = 'Rate limit exceeded when accessing GitHub API. Please try again later.';
                    if (reset) {
                        const resetTime = new Date(parseInt(reset, 10) * 1000);
                        msg = `GitHub rate limit reached. Try again after ${resetTime.toLocaleTimeString()}.`;
                    }
                    setChangelogs({});
                    setChangelogError(msg);
                    setIsLoadingChangelogs(false);
                    return;
                }

                if (response.status === 404) {
                    setChangelogs({});
                    setChangelogError('Repository not found on GitHub.');
                    setIsLoadingChangelogs(false);
                    return;
                }

                throw new Error(`Failed to fetch releases (status ${response.status})`);
            }

            const releases = await response.json();

            // No APK logic needed for AI Model changelog

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

            // If no releases found, show empty state (no fallback data)
            if (Object.keys(transformedChangelogs).length === 0) {
                setChangelogs({});
                setChangelogError('No releases found for this repository.');
            } else {
                setChangelogs(transformedChangelogs);
                // Set the latest version as selected
                if (releases.length > 0) {
                    setSelectedVersion(releases[0].tag_name);
                }
            }
        } catch (error) {
            console.error('Error fetching GitHub releases:', error?.message || error);
            setChangelogs({});
            setChangelogError('Unable to fetch latest releases. Please check your connection and try again.');
        } finally {
            setIsLoadingChangelogs(false);
        }
    };

    // Fetch GitHub releases on mount
    useEffect(() => {
        fetchGitHubReleases();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load Font Awesome
    useEffect(() => {
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

    return (
        <main>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>
                        <span className={styles.highlight}>Energy</span> Theft Detection
                        <br />
                        <span className={styles.highlight}>AI</span> Model
                    </h1>
                    <p className={styles.heroDesc}>
                        Advanced deep learning system for intelligent energy monitoring, detecting theft and waste in smart grid systems using neural networks.
                    </p>
                    <div className={styles.heroBadges}>
                        <span className={styles.badge}>
                            <i className="fas fa-shield-alt"></i> Theft Detection AI
                        </span>
                        <span className={styles.badge}>
                            <i className="fas fa-check-circle"></i> 95%+ Accuracy
                        </span>
                        <span className={styles.badge}>
                            <i className="fas fa-database"></i> 200K+ Samples
                        </span>
                    </div>
                </div>
                <div className={styles.heroImage}>
                    <img
                        src={require('../assets/logo.png')}
                        alt="Smart Meter Logo"
                        loading="lazy"
                        decoding="async"
                        style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }}
                        onError={e => e.target.style.display = 'none'}
                    />
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.contentSection}>
                {/* Overview */}
                {isInitialLoad ? (
                    <>
                        <SkeletonCard />
                        <div className={styles.featuresGrid}>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : (
                    <>
                <div className={styles.overviewCard}>
                    <h2>
                        <i className="fas fa-brain"></i> What This AI Model Does
                    </h2>
                    <p>
                        The Energy Theft Detection AI Model is an advanced machine learning solution designed specifically for detecting electricity theft in smart energy monitoring systems.
                        It works in conjunction with IoT-based smart energy meters to provide real-time fraud detection, analyzing consumption patterns with over 95% accuracy.
                        The model identifies anomalies and suspicious activities that indicate meter tampering or unauthorized energy usage, helping utilities prevent revenue loss and ensure fair billing for all consumers.
                    </p>
                </div>

                {/* Key Features */}
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <h3>Real-time Theft Detection</h3>
                        <p>Binary classification model to identify electricity theft based on discrepancies between actual and metered power with 95%+ accuracy</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fas fa-brain"></i>
                        </div>
                        <h3>Deep Neural Network</h3>
                        <p>Multi-layer architecture with BatchNormalization and LeakyReLU for superior pattern recognition and fraud detection</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fas fa-cog"></i>
                        </div>
                        <h3>Hyperparameter Optimization</h3>
                        <p>Uses Keras Tuner (Hyperband) for automatic model tuning and optimal performance configuration</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fas fa-database"></i>
                        </div>
                        <h3>Robust Training Dataset</h3>
                        <p>Trained on 200K+ synthetic samples with balanced normal and theft patterns for reliable detection</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fas fa-chart-bar"></i>
                        </div>
                        <h3>High Precision Detection</h3>
                        <p>Minimizes false positives with precision-optimized training for dependable fraud identification</p>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <i className="fas fa-desktop"></i>
                        </div>
                        <h3>Interactive Testing Interface</h3>
                        <p>User-friendly Google Colab interface for instant predictions and custom input testing</p>
                    </div>
                </div>

                {/* Model Architecture */}
                <div className={styles.architectureCard}>
                    <h2>
                        <i className="fas fa-project-diagram"></i> Model Architecture
                    </h2>
                    <div className={styles.architectureGrid}>
                        <div className={styles.archSection}>
                            <h3>
                                <i className="fas fa-network-wired"></i> Energy Theft Detection Model
                            </h3>
                            <p className={styles.archSubtitle}>(Binary Classification Neural Network)</p>
                            <ul>
                                <li><strong>Input Layer:</strong> 3 features (Voltage, Current, Power Consumption)</li>
                                <li><strong>Dense Layer 1:</strong> 32-128 units with BatchNormalization and LeakyReLU (α=0.1)</li>
                                <li><strong>Regularization:</strong> Dropout (0.2-0.4) to prevent overfitting</li>
                                <li><strong>Dense Layer 2:</strong> 16-64 units with BatchNormalization and LeakyReLU</li>
                                <li><strong>Output Layer:</strong> Dense (1 unit) with Sigmoid activation</li>
                                <li><strong>Loss Function:</strong> Binary Crossentropy</li>
                                <li><strong>Optimizer:</strong> Adam with learning rate scheduling</li>
                                <li><strong>Metrics:</strong> Accuracy, Precision, Recall, F1-Score</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className={styles.performanceCard}>
                    <h2>
                        <i className="fas fa-chart-bar"></i> Model Performance
                    </h2>
                    <div className={styles.performanceTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Training</th>
                                    <th>Validation</th>
                                    <th>Test</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Accuracy</strong></td>
                                    <td><span className={styles.success}>96.2%</span></td>
                                    <td><span className={styles.success}>95.8%</span></td>
                                    <td><span className={styles.success}>95.5%</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Precision</strong></td>
                                    <td><span className={styles.success}>94.7%</span></td>
                                    <td><span className={styles.success}>94.3%</span></td>
                                    <td><span className={styles.success}>94.1%</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Recall</strong></td>
                                    <td><span className={styles.success}>97.1%</span></td>
                                    <td><span className={styles.success}>96.8%</span></td>
                                    <td><span className={styles.success}>96.5%</span></td>
                                </tr>
                                <tr>
                                    <td><strong>F1-Score</strong></td>
                                    <td><span className={styles.success}>95.9%</span></td>
                                    <td><span className={styles.success}>95.5%</span></td>
                                    <td><span className={styles.success}>95.3%</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className={styles.techCard}>
                    <h2>
                        <i className="fas fa-code"></i> Technologies Used
                    </h2>
                    <div className={styles.techGrid}>
                        <div className={styles.techBadge}>
                            <i className="fab fa-python"></i>
                            <span>Python 3.8+</span>
                        </div>
                        <div className={styles.techBadge}>
                            <i className="fas fa-brain"></i>
                            <span>TensorFlow/Keras</span>
                        </div>
                        <div className={styles.techBadge}>
                            <i className="fas fa-chart-area"></i>
                            <span>Scikit-learn</span>
                        </div>
                        <div className={styles.techBadge}>
                            <i className="fas fa-table"></i>
                            <span>Pandas & NumPy</span>
                        </div>
                        <div className={styles.techBadge}>
                            <i className="fas fa-sliders-h"></i>
                            <span>Keras Tuner</span>
                        </div>
                        <div className={styles.techBadge}>
                            <i className="fab fa-google"></i>
                            <span>Google Colab</span>
                        </div>
                    </div>
                </div>

                {/* Ai Model Change Log Section */}
                <section className={styles.changelogSection}>
                    <h2>Ai Model Change Log</h2>
                    {changelogError && (
                        <div className={styles.changelogError} role="status" aria-live="polite">
                            <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
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
                            {Object.keys(changelogs).length === 0 ? (
                                <div className={styles.changelogEmpty}>
                                    <i className="fas fa-ban" style={{ fontSize: '1.6rem' }}></i>
                                    <h3>No releases found</h3>
                                    <p>We couldn't find any releases for this repository.</p>
                                    <div className={styles.changelogEmptyActions}>
                                        <button
                                            className={styles.refreshButton}
                                            type="button"
                                            aria-label="Retry fetching releases"
                                            onClick={fetchGitHubReleases}
                                            disabled={isLoadingChangelogs}
                                            title="Retry fetching releases"
                                        >
                                            <i className={`fas fa-sync-alt ${isLoadingChangelogs ? 'fa-spin' : ''}`}></i>
                                            <span style={{ marginLeft: 8 }}>Retry</span>
                                        </button>
                                        <a
                                            href="https://github.com/gmpsankalpa/FYRP-AI-Model/releases"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.btnSecondary}
                                        >
                                            View on GitHub
                                        </a>
                                    </div>
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
                                                        href={`https://github.com/gmpsankalpa/FYRP-AI-Model/releases/tag/${selectedVersion}`}
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
                        </>
                    )}
                </section>

                {/* Use Cases */}
                <div className={styles.useCasesCard}>
                    <h2>
                        <i className="fas fa-lightbulb"></i> Use Cases
                    </h2>
                    <div className={styles.useCasesList}>
                        <div className={styles.useCase}>
                            <i className="fas fa-user-shield"></i>
                            <div>
                                <h4>Electricity Theft Prevention</h4>
                                <p>Detect and prevent electricity theft in real-time to reduce revenue loss for utility companies</p>
                            </div>
                        </div>
                        <div className={styles.useCase}>
                            <i className="fas fa-city"></i>
                            <div>
                                <h4>Smart Grid Security</h4>
                                <p>Enhance smart grid security by identifying fraudulent consumption patterns and meter tampering</p>
                            </div>
                        </div>
                        <div className={styles.useCase}>
                            <i className="fas fa-chart-line"></i>
                            <div>
                                <h4>Anomaly Detection</h4>
                                <p>Monitor consumption patterns to detect unusual activity that may indicate theft or meter malfunction</p>
                            </div>
                        </div>
                        <div className={styles.useCase}>
                            <i className="fas fa-balance-scale"></i>
                            <div>
                                <h4>Fair Billing System</h4>
                                <p>Ensure accurate billing by detecting and preventing manipulation of energy consumption data</p>
                            </div>
                        </div>
                        <div className={styles.useCase}>
                            <i className="fas fa-network-wired"></i>
                            <div>
                                <h4>IoT Integration</h4>
                                <p>Seamlessly integrate with IoT-enabled smart meters for automated theft detection and alerts</p>
                            </div>
                        </div>
                        <div className={styles.useCase}>
                            <i className="fas fa-graduation-cap"></i>
                            <div>
                                <h4>Research & Education</h4>
                                <p>Educational tool for machine learning applications in energy fraud detection and analytics</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className={styles.ctaCard}>
                    <h2>
                        <i className="fas fa-rocket"></i> Get Started with the AI Model
                    </h2>
                    <p>
                        Explore the Energy Theft Detection AI Model source code on GitHub or try it live on Google Colab.
                        Contribute to the project, report issues, or integrate it into your smart energy monitoring system.
                    </p>
                    <div className={styles.ctaButtons}>
                        <a
                            href="https://github.com/gmpsankalpa/FYRP-AI-Model"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnLarge}
                        >
                            <i className="fab fa-github"></i>
                            View on GitHub
                        </a>
                        <a
                            href="https://colab.research.google.com/github/gmpsankalpa/FYRP-AI-Model/blob/main/FYRP_AI_Model.ipynb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnLargeSecondary}
                        >
                            <i className="fab fa-google"></i>
                            Open in Colab
                        </a>
                    </div>
                </div>
                </>
                )}
            </section>
        </main>
    );
};

export default AiModel;
