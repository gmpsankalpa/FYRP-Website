import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import app from '../config/firebase';
import usePageTitle from '../hooks/usePageTitle';
import styles from './Configure.module.css';
import { SkeletonForm } from '../components/SkeletonLoader';

// Default values (moved outside component to avoid recreation)
const DEFAULTS = {
    lowVoltageThreshold: 220,
    highVoltageThreshold: 240,
    overcurrentThreshold: 10.0,
    powerThreshold: 2400,
    buzzerEnabled: true
};

const Configure = () => {
    usePageTitle('Configure');

    const db = useMemo(() => getFirestore(app), []);
    const systemStatusRef = useMemo(() => doc(db, 'system_control', 'status'), [db]);
    const isSavingRef = useRef(false);

    const [settings, setSettings] = useState({
        lowVoltageThreshold: DEFAULTS.lowVoltageThreshold,
        highVoltageThreshold: DEFAULTS.highVoltageThreshold,
        overcurrentThreshold: DEFAULTS.overcurrentThreshold,
        powerThreshold: DEFAULTS.powerThreshold,
        buzzerEnabled: DEFAULTS.buzzerEnabled
    });

    const [lastUpdated, setLastUpdated] = useState('Never');
    const [deviceStatus, setDeviceStatus] = useState('Loading configuration...');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const showMessage = useCallback((text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 6000);
    }, []);

    // Load settings from Firestore on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const snap = await getDoc(systemStatusRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setSettings({
                        lowVoltageThreshold: data.minVoltage ?? DEFAULTS.lowVoltageThreshold,
                        highVoltageThreshold: data.maxVoltage ?? DEFAULTS.highVoltageThreshold,
                        overcurrentThreshold: data.maxCurrent ?? DEFAULTS.overcurrentThreshold,
                        powerThreshold: data.maxPower ?? DEFAULTS.powerThreshold,
                        buzzerEnabled: data.Buzzer ?? DEFAULTS.buzzerEnabled
                    });
                    setLastUpdated(data.updatedAt ?? 'Just now');
                    setDeviceStatus('Configuration loaded');
                } else {
                    // No document yet: write defaults
                    await setDoc(systemStatusRef, {
                        Buzzer: DEFAULTS.buzzerEnabled,
                        isOn: true,
                        maxCurrent: DEFAULTS.overcurrentThreshold,
                        maxPower: DEFAULTS.powerThreshold,
                        maxVoltage: DEFAULTS.highVoltageThreshold,
                        minVoltage: DEFAULTS.lowVoltageThreshold,
                        updatedAt: new Date().toLocaleString()
                    });
                    setDeviceStatus('Default configuration created');
                }
            } catch (error) {
                console.error('Error loading configuration:', error);
                setDeviceStatus('Failed to load configuration');
                showMessage('Failed to load configuration. Please try again.', 'error');
            }
        };

        loadSettings();

        // Real-time listener
        const unsubscribe = onSnapshot(systemStatusRef, (snap) => {
            if (!snap.exists() || isSavingRef.current) return;
            const data = snap.data();
            setLastUpdated(data.updatedAt ?? 'Just now');
            setIsInitialLoad(false);
        });

        return () => unsubscribe();
    }, [systemStatusRef, showMessage]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : Number(value)
        }));
    }, []);

    const handleSaveSettings = useCallback(async (e) => {
        e.preventDefault();

        // Validation
        if (settings.lowVoltageThreshold >= settings.highVoltageThreshold) {
            showMessage('Low voltage threshold must be less than high voltage threshold', 'error');
            return;
        }

        try {
            setIsLoading(true);
            isSavingRef.current = true;
            setDeviceStatus('Saving configuration...');

            await updateDoc(systemStatusRef, {
                minVoltage: settings.lowVoltageThreshold,
                maxVoltage: settings.highVoltageThreshold,
                maxCurrent: settings.overcurrentThreshold,
                maxPower: settings.powerThreshold,
                Buzzer: settings.buzzerEnabled,
                updatedAt: new Date().toLocaleString()
            });

            setDeviceStatus('Configuration saved successfully');
            showMessage('Configuration saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving configuration:', error);
            setDeviceStatus('Failed to save configuration');
            showMessage('Failed to save configuration. Please try again.', 'error');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                isSavingRef.current = false;
            }, 1000);
        }
    }, [settings, systemStatusRef, showMessage]);

    const handleResetSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            setDeviceStatus('Resetting to defaults...');

            setSettings({
                lowVoltageThreshold: DEFAULTS.lowVoltageThreshold,
                highVoltageThreshold: DEFAULTS.highVoltageThreshold,
                overcurrentThreshold: DEFAULTS.overcurrentThreshold,
                powerThreshold: DEFAULTS.powerThreshold,
                buzzerEnabled: DEFAULTS.buzzerEnabled
            });

            await updateDoc(systemStatusRef, {
                minVoltage: DEFAULTS.lowVoltageThreshold,
                maxVoltage: DEFAULTS.highVoltageThreshold,
                maxCurrent: DEFAULTS.overcurrentThreshold,
                maxPower: DEFAULTS.powerThreshold,
                Buzzer: DEFAULTS.buzzerEnabled,
                updatedAt: new Date().toLocaleString()
            });

            setDeviceStatus('Defaults restored');
            showMessage('Settings reset to defaults successfully!', 'success');
        } catch (error) {
            console.error('Error resetting settings:', error);
            setDeviceStatus('Failed to reset defaults');
            showMessage('Failed to reset settings. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [systemStatusRef, showMessage]);

    return (
        <div className={styles.configurePage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1><span className={styles.highlight}><i className="fas fa-cogs"></i> System</span> Configuration</h1>
                    <p className={styles.heroDesc}>
                        Customize voltage, current, and power thresholds to ensure optimal protection and performance. Configure smart alerts and safety parameters tailored to your electrical system's requirements for enhanced monitoring and control.
                    </p>
                </div>
                <div className={styles.heroImage}>
                    <img
                        src={require('../assets/logo.png')}
                        alt="Smart Meter Logo"
                        style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }}
                        onError={e => e.target.style.display = 'none'}
                    />
                </div>
            </section>

            {/* Message Container */}
            {message.text && (
                <div className={`${styles.messageContainer} ${styles[message.type]}`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : message.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ text: '', type: '' })} aria-label="Close">
                        &times;
                    </button>
                </div>
            )}

            {/* Configuration Form */}
            {isInitialLoad ? (
                <section className={styles.configSection}>
                    <SkeletonForm fields={6} />
                </section>
            ) : (
            <section className={styles.configSection}>
                <div className={styles.configCard}>
                    <h2><i className="fas fa-sliders-h"></i> Threshold Settings</h2>
                    <p className={styles.cardDescription}>
                        Configure system thresholds and alerts to protect your electrical system
                    </p>

                    <form onSubmit={handleSaveSettings} className={styles.configForm}>
                        {/* Voltage Settings */}
                        <div className={styles.configGroup}>
                            <div className={styles.groupHeader}>
                                <div className={styles.groupIcon}>
                                    <i className="fas fa-bolt"></i>
                                </div>
                                <div>
                                    <h3>Voltage Settings</h3>
                                    <p className={styles.groupDesc}>Set safe voltage operating range for your system</p>
                                </div>
                            </div>

                            <div className={styles.inputGrid}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="lowVoltageThreshold">
                                        <i className="fas fa-arrow-down"></i>
                                        Low Voltage Threshold
                                    </label>
                                    <span className={styles.helpText}>Minimum voltage before triggering alert/shutdown</span>
                                    <div className={styles.inputWithUnit}>
                                        <input
                                            type="number"
                                            id="lowVoltageThreshold"
                                            name="lowVoltageThreshold"
                                            value={settings.lowVoltageThreshold}
                                            onChange={handleInputChange}
                                            min="100"
                                            max="300"
                                            step="1"
                                            required
                                        />
                                        <span className={styles.unit}>V</span>
                                    </div>
                                    <div className={styles.valueDisplay}>
                                        <span className={styles.currentValue}>Current: {settings.lowVoltageThreshold}V</span>
                                        <span className={styles.safeRange}>Range: 100-300V</span>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="highVoltageThreshold">
                                        <i className="fas fa-arrow-up"></i>
                                        High Voltage Threshold
                                    </label>
                                    <span className={styles.helpText}>Maximum voltage before triggering alert/shutdown</span>
                                    <div className={styles.inputWithUnit}>
                                        <input
                                            type="number"
                                            id="highVoltageThreshold"
                                            name="highVoltageThreshold"
                                            value={settings.highVoltageThreshold}
                                            onChange={handleInputChange}
                                            min="200"
                                            max="400"
                                            step="1"
                                            required
                                        />
                                        <span className={styles.unit}>V</span>
                                    </div>
                                    <div className={styles.valueDisplay}>
                                        <span className={styles.currentValue}>Current: {settings.highVoltageThreshold}V</span>
                                        <span className={styles.safeRange}>Range: 200-400V</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Settings */}
                        <div className={styles.configGroup}>
                            <div className={styles.groupHeader}>
                                <div className={styles.groupIcon}>
                                    <i className="fas fa-tachometer-alt"></i>
                                </div>
                                <div>
                                    <h3>Current Settings</h3>
                                    <p className={styles.groupDesc}>Define maximum current draw limits</p>
                                </div>
                            </div>

                            <div className={styles.inputGrid}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="overcurrentThreshold">
                                        <i className="fas fa-exclamation-triangle"></i>
                                        Overcurrent Threshold
                                    </label>
                                    <span className={styles.helpText}>Maximum safe current (triggers alert if exceeded)</span>
                                    <div className={styles.inputWithUnit}>
                                        <input
                                            type="number"
                                            id="overcurrentThreshold"
                                            name="overcurrentThreshold"
                                            value={settings.overcurrentThreshold}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="50"
                                            step="0.1"
                                            required
                                        />
                                        <span className={styles.unit}>A</span>
                                    </div>
                                    <div className={styles.valueDisplay}>
                                        <span className={styles.currentValue}>Current: {settings.overcurrentThreshold}A</span>
                                        <span className={styles.safeRange}>Range: 0-50A</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Power Settings */}
                        <div className={styles.configGroup}>
                            <div className={styles.groupHeader}>
                                <div className={styles.groupIcon}>
                                    <i className="fas fa-charging-station"></i>
                                </div>
                                <div>
                                    <h3>Power Settings</h3>
                                    <p className={styles.groupDesc}>Set maximum power consumption limits</p>
                                </div>
                            </div>

                            <div className={styles.inputGrid}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="powerThreshold">
                                        <i className="fas fa-plug"></i>
                                        Power Threshold
                                    </label>
                                    <span className={styles.helpText}>Maximum power consumption limit</span>
                                    <div className={styles.inputWithUnit}>
                                        <input
                                            type="number"
                                            id="powerThreshold"
                                            name="powerThreshold"
                                            value={settings.powerThreshold}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="10000"
                                            step="10"
                                            required
                                        />
                                        <span className={styles.unit}>W</span>
                                    </div>
                                    <div className={styles.valueDisplay}>
                                        <span className={styles.currentValue}>Current: {settings.powerThreshold}W</span>
                                        <span className={styles.safeRange}>Range: 0-10000W</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alert Settings */}
                        <div className={styles.configGroup}>
                            <div className={styles.groupHeader}>
                                <div className={styles.groupIcon}>
                                    <i className="fas fa-bell"></i>
                                </div>
                                <div>
                                    <h3>Alert Settings</h3>
                                    <p className={styles.groupDesc}>Configure notification preferences</p>
                                </div>
                            </div>

                            <div className={styles.toggleGroup}>
                                <div className={styles.toggleLabel}>
                                    <i className="fas fa-volume-up"></i>
                                    <div>
                                        <div className={styles.toggleTitle}>Buzzer Alert</div>
                                        <span className={styles.helpText}>Enable or disable buzzer notifications</span>
                                    </div>
                                </div>
                                <label className={styles.toggleSwitch} htmlFor="buzzerEnabled">
                                    <input
                                        type="checkbox"
                                        id="buzzerEnabled"
                                        name="buzzerEnabled"
                                        checked={settings.buzzerEnabled}
                                        onChange={handleInputChange}
                                    />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                                <div className={styles.toggleStatus}>
                                    <span className={styles.statusEnabled} style={{ display: settings.buzzerEnabled ? 'inline-flex' : 'none' }}>
                                        <i className="fas fa-check-circle"></i> Enabled
                                    </span>
                                    <span className={styles.statusDisabled} style={{ display: !settings.buzzerEnabled ? 'inline-flex' : 'none' }}>
                                        <i className="fas fa-times-circle"></i> Disabled
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.btnSecondary}
                                onClick={handleResetSettings}
                                disabled={isLoading}
                            >
                                <i className="fas fa-undo"></i>
                                {isLoading ? 'Resetting...' : 'Reset to Defaults'}
                            </button>
                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                disabled={isLoading}
                            >
                                <i className="fas fa-save"></i>
                                {isLoading ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            )}

            {/* Configuration Status */}
            <section className={styles.statusSection}>
                <div className={styles.statusCard}>
                    <h2><i className="fas fa-info-circle"></i> Configuration Status</h2>
                    <div className={styles.statusGrid}>
                        <div className={styles.statusItem}>
                            <div className={`${styles.statusIcon} ${styles.success}`}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <div className={styles.statusInfo}>
                                <h3>Current Settings</h3>
                                <p>All thresholds are within safe operating ranges</p>
                            </div>
                        </div>
                        <div className={styles.statusItem}>
                            <div className={`${styles.statusIcon} ${styles.warning}`}>
                                <i className="fas fa-sync-alt"></i>
                            </div>
                            <div className={styles.statusInfo}>
                                <h3>Last Updated</h3>
                                <p>{lastUpdated}</p>
                            </div>
                        </div>
                        <div className={styles.statusItem}>
                            <div className={`${styles.statusIcon} ${styles.info}`}>
                                <i className="fas fa-microchip"></i>
                            </div>
                            <div className={styles.statusInfo}>
                                <h3>Device Status</h3>
                                <p>{deviceStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help Section */}
            <section className={styles.helpSection}>
                <div className={styles.helpCard}>
                    <h2><i className="fas fa-question-circle"></i> Configuration Guide</h2>
                    <div className={styles.helpContent}>
                        <div className={styles.helpItem}>
                            <h3><i className="fas fa-bolt"></i> Voltage Thresholds</h3>
                            <p>Set appropriate voltage limits based on your regional standards. Typical residential voltage is 230V ±10%.</p>
                        </div>
                        <div className={styles.helpItem}>
                            <h3><i className="fas fa-tachometer-alt"></i> Current Limits</h3>
                            <p>Set current thresholds based on your circuit breaker rating and connected appliance loads.</p>
                        </div>
                        <div className={styles.helpItem}>
                            <h3><i className="fas fa-bell"></i> Alert Preferences</h3>
                            <p>Configure how you want to receive alerts - via buzzer, push notifications, or both.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Configure;

