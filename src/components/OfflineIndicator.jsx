import React, { useState, useEffect } from 'react';
import styles from './OfflineIndicator.module.css';

/**
 * Offline Indicator Component
 * Shows a banner when the user goes offline
 */
const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showBanner, setShowBanner] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            console.log('[Network] Connection restored - Online mode active');
            setIsOnline(true);
            setShowBanner(true);
            
            // Hide "back online" message after 3 seconds
            setTimeout(() => {
                setShowBanner(false);
            }, 3000);
        };

        const handleOffline = () => {
            console.log('[Network] Connection lost - Offline mode active');
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showBanner) return null;

    return (
        <div className={`${styles.offlineIndicator} ${isOnline ? styles.online : styles.offline}`}>
            <div className={styles.content}>
                <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`}></i>
                <span className={styles.message}>
                    {isOnline 
                        ? 'Back online! Connection restored.' 
                        : 'You are offline. Some features may be limited.'}
                </span>
                {!isOnline && (
                    <button 
                        className={styles.dismissBtn}
                        onClick={() => setShowBanner(false)}
                        aria-label="Dismiss offline notification"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfflineIndicator;
