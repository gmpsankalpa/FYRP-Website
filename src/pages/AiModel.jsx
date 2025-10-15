import { useEffect, useState } from 'react';
import styles from './AiModel.module.css';
import usePageTitle from '../hooks/usePageTitle';

const AiModel = () => {
    // Set page title
    usePageTitle('AI Model - Theft Detection');

    const [repoData, setRepoData] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState('');
    const [releases, setReleases] = useState({});
    const [loading, setLoading] = useState(true);
    const [changelogError, setChangelogError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch repository data and releases from GitHub API
    const fetchGitHubData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setIsRefreshing(true);
            } else {
                setLoading(true);
            }
            setChangelogError(null);
                const repoResponse = await fetch('https://api.github.com/repos/gmpsankalpa/FYRP-AI-Model');
                const repoJson = await repoResponse.json();
                setRepoData(repoJson);

                // Fetch releases
                const releasesResponse = await fetch('https://api.github.com/repos/gmpsankalpa/FYRP-AI-Model/releases');
                const releasesJson = await releasesResponse.json();
                
                if (releasesJson && releasesJson.length > 0) {
                    const releasesData = {};
                    releasesJson.forEach(release => {
                        const version = release.tag_name;
                        const date = new Date(release.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        });
                        
                        // Parse release notes into bullet points
                        const body = release.body || '';
                        const changes = body
                            .split('\n')
                            .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
                            .map(line => line.replace(/^[-*]\s*/, '').trim())
                            .filter(line => line.length > 0);
                        
                        releasesData[version] = {
                            date,
                            changes: changes.length > 0 ? changes : ['Release notes not available']
                        };
                    });
                    
                    setReleases(releasesData);
                    setSelectedVersion(Object.keys(releasesData)[0] || '');
                } else {
                    // Fallback data
                    const fallbackReleases = {
                        'v1.0.0': {
                            date: 'Mar 11, 2024',
                            changes: [
                                'Initial release of Energy Theft Detection AI Model',
                                'Binary classification with 95%+ accuracy',
                                'Deep neural network with BatchNormalization',
                                'Hyperparameter optimization using Keras Tuner',
                                'Trained on 200K+ synthetic samples',
                                'Google Colab integration for interactive testing'
                            ]
                        }
                    };
                    setReleases(fallbackReleases);
                    setSelectedVersion('v1.0.0');
                }

                setLoading(false);
                setIsRefreshing(false);
            } catch (error) {
                console.error('Error fetching GitHub data:', error);
                setChangelogError('Failed to load releases from GitHub. Showing fallback data.');
                
                // Fallback data on error
                const fallbackReleases = {
                    'v1.0.0': {
                        date: 'Mar 11, 2024',
                        changes: [
                            'Initial release of Energy Theft Detection AI Model',
                            'Binary classification with 95%+ accuracy',
                            'Deep neural network with BatchNormalization',
                            'Hyperparameter optimization using Keras Tuner',
                            'Trained on 200K+ synthetic samples',
                            'Google Colab integration for interactive testing'
                        ]
                    }
                };
                setReleases(fallbackReleases);
                setSelectedVersion('v1.0.0');
                setLoading(false);
                setIsRefreshing(false);
            }
        };
    
    // Initial load
    useEffect(() => {
        fetchGitHubData();
    }, []);

    // Load Font Awesome
    useEffect(() => {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
        faLink.crossOrigin = 'anonymous';
        if (!document.querySelector(`link[href="${faLink.href}"]`)) {
            document.head.appendChild(faLink);
        }
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>
                        <span className={styles.highlight}>Energy Theft Detection</span>
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

                {/* Model Changelog - Auto-updating from GitHub */}
                <div className={styles.changelogCard}>
                    <h2>
                        <i className="fas fa-history"></i> Model Changelog
                        <span className={styles.liveIndicator}>
                            <i className="fas fa-circle"></i> Live Updates
                        </span>
                    </h2>

                    {changelogError && (
                        <div className={styles.changelogError}>
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>{changelogError}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className={styles.loadingState}>
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Loading releases from GitHub...</p>
                        </div>
                    ) : (
                        <>
                            {repoData && (
                                <div className={styles.repoStats}>
                                    <div className={styles.stat}>
                                        <i className="fas fa-star"></i>
                                        <span>{repoData.stargazers_count}</span>
                                        <small>Stars</small>
                                    </div>
                                    <div className={styles.stat}>
                                        <i className="fas fa-code-branch"></i>
                                        <span>{repoData.forks_count}</span>
                                        <small>Forks</small>
                                    </div>
                                    <div className={styles.stat}>
                                        <i className="fas fa-eye"></i>
                                        <span>{repoData.watchers_count}</span>
                                        <small>Watchers</small>
                                    </div>
                                    <div className={styles.stat}>
                                        <i className="fas fa-exclamation-circle"></i>
                                        <span>{repoData.open_issues_count}</span>
                                        <small>Issues</small>
                                    </div>
                                </div>
                            )}

                            <div className={styles.changelogHeader}>
                                <label htmlFor="model-version-select">Select Version:</label>
                                <button 
                                    className={styles.refreshButton}
                                    onClick={() => fetchGitHubData(true)}
                                    disabled={isRefreshing}
                                    title="Refresh releases"
                                >
                                    <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`}></i>
                                </button>
                            </div>

                            <select 
                                id="model-version-select" 
                                value={selectedVersion}
                                onChange={(e) => setSelectedVersion(e.target.value)}
                                className={styles.versionSelect}
                            >
                                {Object.keys(releases).map(version => (
                                    <option key={version} value={version}>
                                        {version} ({releases[version].date})
                                    </option>
                                ))}
                            </select>

                            <div className={styles.changelogList}>
                                {releases[selectedVersion] && (
                                    <div className={styles.changelogVersion}>
                                        <h3>
                                            {selectedVersion}
                                            {selectedVersion === Object.keys(releases)[0] && (
                                                <span className={styles.latestBadge}>Latest</span>
                                            )}
                                            <span className={styles.changelogDate}>
                                                {releases[selectedVersion].date}
                                            </span>
                                        </h3>
                                        <ul>
                                            {releases[selectedVersion].changes.map((change, index) => (
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
                                                View Release on GitHub
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className={styles.changelogActions}>
                        <a
                            href="https://github.com/gmpsankalpa/FYRP-AI-Model/releases"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnPrimary}
                        >
                            <i className="fab fa-github"></i>
                            View All Releases
                        </a>
                        <a
                            href="https://github.com/gmpsankalpa/FYRP-AI-Model/commits/main"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnSecondary}
                        >
                            <i className="fas fa-list"></i>
                            View All Commits
                        </a>
                    </div>
                </div>

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
            </section>
        </main>
    );
};

export default AiModel;
