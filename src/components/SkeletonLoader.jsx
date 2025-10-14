import React from 'react';
import styles from './SkeletonLoader.module.css';

/**
 * Reusable Skeleton Loader Component
 * Provides animated placeholders while content is loading
 */

// Basic Skeleton Line
export const SkeletonLine = ({ width = '100%', height = '16px', marginBottom = '8px' }) => (
    <div 
        className={styles.skeleton}
        style={{ width, height, marginBottom }}
    />
);

// Skeleton Circle (for avatars)
export const SkeletonCircle = ({ size = '60px' }) => (
    <div 
        className={`${styles.skeleton} ${styles.circle}`}
        style={{ width: size, height: size }}
    />
);

// Skeleton Card (Dashboard data card)
export const SkeletonCard = () => (
    <div className={styles.skeletonCard}>
        <div className={styles.cardHeader}>
            <SkeletonCircle size="48px" />
            <div className={styles.cardHeaderText}>
                <SkeletonLine width="70%" height="20px" marginBottom="8px" />
                <SkeletonLine width="50%" height="16px" marginBottom="0" />
            </div>
        </div>
        <div className={styles.cardContent}>
            <SkeletonLine width="100%" height="40px" marginBottom="12px" />
            <SkeletonLine width="60%" height="16px" marginBottom="0" />
        </div>
    </div>
);

// Skeleton Dashboard Grid (4 cards)
export const SkeletonDashboard = () => (
    <div className={styles.skeletonGrid}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
    </div>
);

// Skeleton Chart
export const SkeletonChart = ({ height = '300px' }) => (
    <div className={styles.skeletonChart} style={{ height }}>
        <div className={styles.chartBars}>
            <div className={`${styles.bar} ${styles.bar1}`} />
            <div className={`${styles.bar} ${styles.bar2}`} />
            <div className={`${styles.bar} ${styles.bar3}`} />
            <div className={`${styles.bar} ${styles.bar4}`} />
            <div className={`${styles.bar} ${styles.bar5}`} />
        </div>
    </div>
);

// Skeleton Profile
export const SkeletonProfile = () => (
    <div className={styles.skeletonProfile}>
        <div className={styles.profileHeader}>
            <SkeletonCircle size="120px" />
            <div className={styles.profileInfo}>
                <SkeletonLine width="200px" height="32px" marginBottom="12px" />
                <SkeletonLine width="250px" height="20px" marginBottom="8px" />
                <SkeletonLine width="180px" height="20px" marginBottom="0" />
            </div>
        </div>
        <div className={styles.profileDetails}>
            <SkeletonLine width="100%" height="60px" marginBottom="16px" />
            <SkeletonLine width="100%" height="60px" marginBottom="16px" />
            <SkeletonLine width="100%" height="60px" marginBottom="0" />
        </div>
    </div>
);

// Skeleton Form
export const SkeletonForm = ({ fields = 6 }) => (
    <div className={styles.skeletonForm}>
        {[...Array(fields)].map((_, index) => (
            <div key={index} className={styles.formField}>
                <SkeletonLine width="150px" height="18px" marginBottom="8px" />
                <SkeletonLine width="100%" height="44px" marginBottom="20px" />
            </div>
        ))}
        <div className={styles.formActions}>
            <SkeletonLine width="120px" height="44px" marginBottom="0" />
            <SkeletonLine width="120px" height="44px" marginBottom="0" />
        </div>
    </div>
);

// Skeleton Table
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
    <div className={styles.skeletonTable}>
        <div className={styles.tableHeader}>
            {[...Array(columns)].map((_, index) => (
                <SkeletonLine key={index} width="90%" height="20px" marginBottom="0" />
            ))}
        </div>
        {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className={styles.tableRow}>
                {[...Array(columns)].map((_, colIndex) => (
                    <SkeletonLine key={colIndex} width="85%" height="16px" marginBottom="0" />
                ))}
            </div>
        ))}
    </div>
);

// Skeleton Text Block
export const SkeletonText = ({ lines = 3 }) => (
    <div className={styles.skeletonText}>
        {[...Array(lines)].map((_, index) => (
            <SkeletonLine 
                key={index}
                width={index === lines - 1 ? '60%' : '100%'}
                height="16px"
                marginBottom="12px"
            />
        ))}
    </div>
);

// Default export
const SkeletonLoader = {
    Line: SkeletonLine,
    Circle: SkeletonCircle,
    Card: SkeletonCard,
    Dashboard: SkeletonDashboard,
    Chart: SkeletonChart,
    Profile: SkeletonProfile,
    Form: SkeletonForm,
    Table: SkeletonTable,
    Text: SkeletonText,
};

export default SkeletonLoader;
