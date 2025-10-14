import React from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('Error Boundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ 
            hasError: false,
            error: null,
            errorInfo: null
        });
        // Optionally reload the page
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return <ErrorFallback 
                error={this.state.error}
                errorInfo={this.state.errorInfo}
                onReset={this.handleReset}
            />;
        }

        return this.props.children;
    }
}

// Error Fallback Component
const ErrorFallback = ({ error, errorInfo, onReset }) => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorCard}>
                <div className={styles.errorIcon}>
                    <i className="fas fa-exclamation-triangle"></i>
                </div>
                
                <h1 className={styles.errorTitle}>Oops! Something went wrong</h1>
                
                <p className={styles.errorMessage}>
                    We're sorry for the inconvenience. An unexpected error has occurred.
                </p>

                <div className={styles.errorActions}>
                    <button 
                        className={styles.primaryBtn}
                        onClick={onReset}
                    >
                        <i className="fas fa-redo"></i>
                        Try Again
                    </button>
                    
                    <button 
                        className={styles.secondaryBtn}
                        onClick={() => window.location.href = '/'}
                    >
                        <i className="fas fa-home"></i>
                        Go Home
                    </button>
                </div>

                {/* Show error details in development mode */}
                {isDevelopment && error && (
                    <details className={styles.errorDetails}>
                        <summary>Error Details (Development Only)</summary>
                        <div className={styles.errorStack}>
                            <h3>Error:</h3>
                            <pre>{error.toString()}</pre>
                            
                            {errorInfo && (
                                <>
                                    <h3>Component Stack:</h3>
                                    <pre>{errorInfo.componentStack}</pre>
                                </>
                            )}
                        </div>
                    </details>
                )}

                <div className={styles.helpText}>
                    <p>If this problem persists, please contact support.</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;
