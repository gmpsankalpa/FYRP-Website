import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', fullScreen = false, message = 'Loading...' }) => {
    if (fullScreen) {
        return (
            <div className={styles.fullScreenContainer}>
                <div className={styles.spinnerWrapper}>
                    <div className={`${styles.spinner} ${styles[size]}`}>
                        <div className={styles.ring}></div>
                        <div className={styles.ring}></div>
                        <div className={styles.ring}></div>
                        <div className={styles.ring}></div>
                    </div>
                    {message && <p className={styles.message}>{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.spinnerContainer}>
            <div className={`${styles.spinner} ${styles[size]}`}>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
            </div>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
