import { useEffect, useState } from 'react';
import styles from './ChangeLog.module.css';
import usePageTitle from '../hooks/usePageTitle';

const ChangeLog = () => {
    // Set page title
    usePageTitle('Change Log');

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [expandedVersion, setExpandedVersion] = useState(null);
    const [changelogData, setChangelogData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Fetch GitHub releases function
    const fetchGitHubReleases = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('https://api.github.com/repos/gmpsankalpa/FYRP-Website/releases');
            
            if (!response.ok) {
                throw new Error('Failed to fetch releases');
            }
            
            const releases = await response.json();
            
            // Transform GitHub releases to changelog format
            const transformedData = releases.map((release, index) => {
                const version = release.tag_name;
                const date = new Date(release.published_at).toISOString().split('T')[0];
                
                // Parse release body to extract change categories
                const changes = {
                    added: [],
                    improved: [],
                    changed: [],
                    fixed: []
                };
                
                if (release.body) {
                    const lines = release.body.split('\n');
                    let currentCategory = null;
                    
                    lines.forEach(line => {
                        const trimmedLine = line.trim();
                        
                        // Detect category headers
                        if (trimmedLine.match(/^#+\s*(added|new features?)/i)) {
                            currentCategory = 'added';
                        } else if (trimmedLine.match(/^#+\s*(improved|enhancements?|improvements?)/i)) {
                            currentCategory = 'improved';
                        } else if (trimmedLine.match(/^#+\s*(changed|updates?)/i)) {
                            currentCategory = 'changed';
                        } else if (trimmedLine.match(/^#+\s*(fixed|bug fixes?)/i)) {
                            currentCategory = 'fixed';
                        } else if ((trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) && currentCategory) {
                            // Extract bullet point content
                            const content = trimmedLine.replace(/^[-*]\s*/, '').trim();
                            if (content.length > 0) {
                                changes[currentCategory].push(content);
                            }
                        }
                    });
                }
                
                // If no categorized changes found, put all bullet points in 'added'
                if (Object.values(changes).every(arr => arr.length === 0) && release.body) {
                    const bulletPoints = release.body
                        .split('\n')
                        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
                        .map(line => line.replace(/^[-*]\s*/, '').trim())
                        .filter(line => line.length > 0);
                    
                    changes.added = bulletPoints;
                }
                
                // Determine release type based on version number
                let type = 'minor';
                const versionMatch = version.match(/v?(\d+)\.(\d+)\.(\d+)/);
                if (versionMatch) {
                    const [, , minor, patch] = versionMatch;
                    if (patch === '0' && minor === '0') {
                        type = 'major';
                    } else if (patch !== '0') {
                        type = 'patch';
                    }
                }
                
                return {
                    version,
                    date,
                    type,
                    status: index === 0 ? 'latest' : undefined,
                    changes
                };
            });
            
            // If no releases found, use fallback data
            if (transformedData.length === 0) {
                setChangelogData(getFallbackChangelog());
            } else {
                setChangelogData(transformedData);
            }
            
            setError(null);
        } catch (error) {
            console.error('Error fetching GitHub releases:', error);
            setError('Unable to fetch latest releases. Showing cached data.');
            setChangelogData(getFallbackChangelog());
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch releases on component mount
    useEffect(() => {
        fetchGitHubReleases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleVersion = (version) => {
        setExpandedVersion(expandedVersion === version ? null : version);
    };

    // Fallback changelog data
    const getFallbackChangelog = () => ([
        {
            version: 'v2.1.0',
            date: '2025-10-10',
            type: 'major',
            status: 'latest',
            changes: {
                added: [
                    'New Source Code page showcasing all GitHub repositories',
                    'Enhanced Footer with expanded information for desktop',
                    'Dynamic year display in footer copyright',
                    'Improved mobile optimization across all pages'
                ],
                improved: [
                    'Hero section animations with z-index fixes',
                    'Footer animations and hover effects',
                    'Responsive design for touch devices',
                    'Accessibility improvements with proper touch targets'
                ],
                fixed: [
                    'Button clickability issues on Error404 and Download pages',
                    'Social Media Section removed from all pages for cleaner design',
                    'Mobile text sizing and spacing optimizations'
                ]
            }
        },
        {
            version: 'v2.0.0',
            date: '2025-09-30',
            type: 'major',
            changes: {
                added: [
                    'Complete Dashboard with real-time energy monitoring',
                    'Firebase authentication and database integration',
                    'Advanced charts and analytics with Chart.js',
                    'Mobile app download page with APK distribution',
                    'Installation guide and FAQ sections'
                ],
                improved: [
                    'Redesigned Navigation with modern UI',
                    'Enhanced responsive design for all devices',
                    'Performance optimizations for faster loading',
                    'Better error handling and user feedback'
                ],
                changed: [
                    'Updated color scheme to match brand identity',
                    'Migrated to CSS Modules for better styling',
                    'Improved code organization and structure'
                ]
            }
        },
        {
            version: 'v1.5.0',
            date: '2025-08-15',
            type: 'minor',
            changes: {
                added: [
                    'Contact page with Web3Forms integration',
                    'About page with project information',
                    'Download page for mobile applications',
                    'Custom 404 Error page with energy theme'
                ],
                improved: [
                    'Navigation menu with active link highlighting',
                    'Hero sections with gradient backgrounds',
                    'Card components with hover effects',
                    'Mobile responsiveness improvements'
                ],
                fixed: [
                    'Form validation issues on Contact page',
                    'Image loading errors',
                    'Navigation menu mobile toggle bugs'
                ]
            }
        },
        {
            version: 'v1.4.0',
            date: '2025-07-20',
            type: 'minor',
            changes: {
                added: [
                    'Login page with Firebase authentication',
                    'Password strength indicator',
                    'Rate limiting for security',
                    'Remember me functionality'
                ],
                improved: [
                    'Form validation with real-time feedback',
                    'Error messages and user guidance',
                    'Security enhancements',
                    'Loading states for async operations'
                ],
                fixed: [
                    'Authentication flow issues',
                    'Password reset functionality',
                    'Session management bugs'
                ]
            }
        },
        {
            version: 'v1.3.0',
            date: '2025-06-10',
            type: 'minor',
            changes: {
                added: [
                    'Modern Footer component',
                    'Social media integration',
                    'Copyright information',
                    'Smooth scroll behavior'
                ],
                improved: [
                    'Page loading performance',
                    'SEO optimization',
                    'Meta tags and descriptions',
                    'Accessibility features'
                ],
                fixed: [
                    'Footer positioning on short pages',
                    'Link hover states',
                    'Typography inconsistencies'
                ]
            }
        },
        {
            version: 'v1.2.0',
            date: '2025-05-05',
            type: 'minor',
            changes: {
                added: [
                    'Home page with project overview',
                    'Features showcase section',
                    'Technology stack display',
                    'Project benefits highlights'
                ],
                improved: [
                    'Hero section design and layout',
                    'Content structure and hierarchy',
                    'Visual consistency across pages',
                    'Loading animations'
                ],
                fixed: [
                    'Image aspect ratio issues',
                    'Text overflow on mobile',
                    'Broken internal links'
                ]
            }
        },
        {
            version: 'v1.1.0',
            date: '2025-04-15',
            type: 'minor',
            changes: {
                added: [
                    'Navigation component with React Router',
                    'Responsive mobile menu',
                    'Logo and branding elements',
                    'Page transition effects'
                ],
                improved: [
                    'Navigation UX and accessibility',
                    'Mobile menu animations',
                    'Link active states',
                    'Header sticky behavior'
                ],
                fixed: [
                    'Menu toggle state persistence',
                    'Route navigation issues',
                    'Mobile menu overflow'
                ]
            }
        },
        {
            version: 'v1.0.0',
            date: '2025-03-11',
            type: 'major',
            changes: {
                added: [
                    'Initial project setup with React',
                    'Basic routing structure',
                    'CSS variables and theme system',
                    'Project foundation and architecture'
                ],
                improved: [
                    'Development workflow setup',
                    'Build configuration',
                    'Code organization'
                ],
                fixed: []
            }
        }
    ]);

    const filteredChangelog = selectedFilter === 'all' 
        ? changelogData 
        : changelogData.filter(item => item.type === selectedFilter);

    const getTypeColor = (type) => {
        switch(type) {
            case 'major': return '#ff6b6b';
            case 'minor': return '#4ecdc4';
            case 'patch': return '#ffe066';
            default: return '#b8b8b8';
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'major': return 'fa-rocket';
            case 'minor': return 'fa-star';
            case 'patch': return 'fa-wrench';
            default: return 'fa-code';
        }
    };

    return (
        <main>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1> <span className={styles.highlight}>Change</span> Log</h1>
                    <p className={styles.heroDesc}>Stay updated with the latest changes, improvements, and fixes in the Smart Energy Meter project. Explore our detailed change log to see how we are continuously enhancing the system for better performance and user experience.</p>
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

            {/* Filter Section */}
            <section className={styles.filterSection}>
                <div className={styles.filterContainer}>
                    <div className={styles.filterHeader}>
                        <h2>Filter by Release Type</h2>
                        <button 
                            className={styles.refreshBtn}
                            onClick={fetchGitHubReleases}
                            title="Refresh releases"
                            disabled={isLoading}
                        >
                            <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i>
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                    
                    {error && (
                        <div className={styles.errorMessage}>
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <div className={styles.filterButtons}>
                        <button 
                            className={`${styles.filterBtn} ${selectedFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setSelectedFilter('all')}
                        >
                            <i className="fas fa-th"></i>
                            All Releases
                        </button>
                        <button 
                            className={`${styles.filterBtn} ${selectedFilter === 'major' ? styles.active : ''}`}
                            onClick={() => setSelectedFilter('major')}
                        >
                            <i className="fas fa-rocket"></i>
                            Major
                        </button>
                        <button 
                            className={`${styles.filterBtn} ${selectedFilter === 'minor' ? styles.active : ''}`}
                            onClick={() => setSelectedFilter('minor')}
                        >
                            <i className="fas fa-star"></i>
                            Minor
                        </button>
                        <button 
                            className={`${styles.filterBtn} ${selectedFilter === 'patch' ? styles.active : ''}`}
                            onClick={() => setSelectedFilter('patch')}
                        >
                            <i className="fas fa-wrench"></i>
                            Patch
                        </button>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className={styles.timelineSection}>
                <div className={styles.timelineContainer}>
                    {isLoading ? (
                        <div className={styles.loadingState}>
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Loading releases from GitHub...</p>
                        </div>
                    ) : filteredChangelog.length === 0 ? (
                        <div className={styles.emptyState}>
                            <i className="fas fa-inbox"></i>
                            <p>No releases found for this filter.</p>
                        </div>
                    ) : (
                        filteredChangelog.map((release, index) => (
                        <div key={release.version} className={styles.timelineItem}>
                            <div className={styles.timelineLine}></div>
                            <div 
                                className={styles.timelineDot} 
                                style={{ borderColor: getTypeColor(release.type) }}
                            >
                                <i className={`fas ${getTypeIcon(release.type)}`} style={{ color: getTypeColor(release.type) }}></i>
                            </div>
                            
                            <div className={styles.releaseCard}>
                                <div className={styles.releaseHeader} onClick={() => toggleVersion(release.version)}>
                                    <div className={styles.releaseInfo}>
                                        <div className={styles.releaseTitleRow}>
                                            <h3>{release.version}</h3>
                                            {release.status === 'latest' && (
                                                <span className={styles.latestBadge}>
                                                    <i className="fas fa-certificate"></i>
                                                    Latest
                                                </span>
                                            )}
                                            <span 
                                                className={styles.typeBadge}
                                                style={{ 
                                                    backgroundColor: `${getTypeColor(release.type)}22`,
                                                    borderColor: getTypeColor(release.type),
                                                    color: getTypeColor(release.type)
                                                }}
                                            >
                                                {release.type}
                                            </span>
                                        </div>
                                        <p className={styles.releaseDate}>
                                            <i className="fas fa-calendar-alt"></i>
                                            {new Date(release.date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                    <button className={styles.expandBtn}>
                                        <i className={`fas fa-chevron-${expandedVersion === release.version ? 'up' : 'down'}`}></i>
                                    </button>
                                </div>

                                {expandedVersion === release.version && (
                                    <div className={styles.releaseContent}>
                                        {release.changes.added && release.changes.added.length > 0 && (
                                            <div className={styles.changeCategory}>
                                                <h4><i className="fas fa-plus-circle" style={{ color: '#3ddc84' }}></i> Added</h4>
                                                <ul>
                                                    {release.changes.added.map((change, i) => (
                                                        <li key={i}>{change}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {release.changes.improved && release.changes.improved.length > 0 && (
                                            <div className={styles.changeCategory}>
                                                <h4><i className="fas fa-arrow-up" style={{ color: '#4ecdc4' }}></i> Improved</h4>
                                                <ul>
                                                    {release.changes.improved.map((change, i) => (
                                                        <li key={i}>{change}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {release.changes.changed && release.changes.changed.length > 0 && (
                                            <div className={styles.changeCategory}>
                                                <h4><i className="fas fa-sync-alt" style={{ color: '#ffe066' }}></i> Changed</h4>
                                                <ul>
                                                    {release.changes.changed.map((change, i) => (
                                                        <li key={i}>{change}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {release.changes.fixed && release.changes.fixed.length > 0 && (
                                            <div className={styles.changeCategory}>
                                                <h4><i className="fas fa-bug" style={{ color: '#ff6b6b' }}></i> Fixed</h4>
                                                <ul>
                                                    {release.changes.fixed.map((change, i) => (
                                                        <li key={i}>{change}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )))}
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <h2>Project Statistics</h2>
                {!isLoading && changelogData.length > 0 && (
                    <>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <i className="fas fa-code-branch"></i>
                                <h3>{changelogData.length}</h3>
                                <p>Total Releases</p>
                            </div>
                            <div className={styles.statCard}>
                                <i className="fas fa-rocket"></i>
                                <h3>{changelogData.filter(r => r.type === 'major').length}</h3>
                                <p>Major Updates</p>
                            </div>
                            <div className={styles.statCard}>
                                <i className="fas fa-calendar-check"></i>
                                <h3>{new Date(changelogData[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</h3>
                                <p>Latest Release</p>
                            </div>
                            <div className={styles.statCard}>
                                <i className="fas fa-history"></i>
                                <h3>
                                    {Math.floor((new Date(changelogData[0].date) - new Date(changelogData[changelogData.length - 1].date)) / (1000 * 60 * 60 * 24 * 30))}
                                </h3>
                                <p>Months Active</p>
                            </div>
                        </div>
                        
                        <div className={styles.githubLinkSection}>
                            <a 
                                href="https://github.com/gmpsankalpa/FYP-web/releases"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.githubLink}
                            >
                                <i className="fab fa-github"></i>
                                View All Releases on GitHub
                            </a>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
};

export default ChangeLog;
