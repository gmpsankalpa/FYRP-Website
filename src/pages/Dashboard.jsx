import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc, collection, deleteDoc, getDocs } from 'firebase/firestore';
import app from '../config/firebase';
import styles from './Dashboard.module.css';
import Chart from 'chart.js/auto';

const Dashboard = () => {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
            faLink.crossOrigin = 'anonymous';
            document.head.appendChild(faLink);
            
            // Load jsPDF library
            const jsPdfScript = document.createElement('script');
            jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            jsPdfScript.async = true;
            document.head.appendChild(jsPdfScript);
            
            return () => {
                document.head.removeChild(faLink);
                if (document.head.contains(jsPdfScript)) {
                    document.head.removeChild(jsPdfScript);
                }
            };
        }, []);

    // State Management
    const [energyData, setEnergyData] = useState({
        voltage: 0,
        current: 0,
        power: 0,
        warning: 'Normal'
    });

    const [systemStatus, setSystemStatus] = useState({
        isOn: false,
        connectionStatus: 'Connected',
        lastAction: 'System started',
        autoMode: false
    });

    const [statistics, setStatistics] = useState({
        voltage: { min: Infinity, max: -Infinity, avg: 0, sum: 0, count: 0 },
        current: { min: Infinity, max: -Infinity, avg: 0, sum: 0, count: 0, peak: 0 },
        power: { min: Infinity, max: -Infinity, avg: 0, sum: 0, count: 0, total: 0, peak: 0 },
        dailyUsage: 0,
        powerFactor: 0.95,
        loadPercentage: 0
    });

    const [warnings, setWarnings] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [systemUptime, setSystemUptime] = useState(0);
    const [startTime] = useState(Date.now());
    const [isLoading, setIsLoading] = useState(false);

    // Debug: Log warnings and notification count changes
    useEffect(() => {
        console.log('📊 Warnings state updated:', warnings);
        console.log('📊 Notification count:', notificationCount);
    }, [warnings, notificationCount]);

    // Chart References
    const voltageChartRef = useRef(null);
    const currentChartRef = useRef(null);
    const powerChartRef = useRef(null);
    const combinedChartRef = useRef(null);
    const chartInstances = useRef({});

    // Chart Data
    const [chartData, setChartData] = useState({
        timestamps: [],
        voltage: [],
        current: [],
        power: [],
        MAX_POINTS: 20
    });

    // Authentication Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    // System Uptime Timer
    useEffect(() => {
        const timer = setInterval(() => {
            const uptime = Math.floor((Date.now() - startTime) / 1000);
            setSystemUptime(uptime);
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    // Format Time Helper
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Format Uptime Helper
    const formatUptime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };

    // Update Statistics
    const updateStatistics = (voltage, current, power) => {
        setStatistics(prev => {
            const newStats = { ...prev };

            // Voltage stats
            newStats.voltage.min = Math.min(newStats.voltage.min, voltage);
            newStats.voltage.max = Math.max(newStats.voltage.max, voltage);
            newStats.voltage.sum += voltage;
            newStats.voltage.count++;
            newStats.voltage.avg = newStats.voltage.sum / newStats.voltage.count;

            // Current stats
            newStats.current.min = Math.min(newStats.current.min, current);
            newStats.current.max = Math.max(newStats.current.max, current);
            newStats.current.peak = Math.max(newStats.current.peak, current);
            newStats.current.sum += current;
            newStats.current.count++;
            newStats.current.avg = newStats.current.sum / newStats.current.count;

            // Power stats
            newStats.power.min = Math.min(newStats.power.min, power);
            newStats.power.max = Math.max(newStats.power.max, power);
            newStats.power.peak = Math.max(newStats.power.peak, power);
            newStats.power.sum += power;
            newStats.power.count++;
            newStats.power.avg = newStats.power.sum / newStats.power.count;
            newStats.power.total += power;

            // Calculate daily usage (kWh)
            newStats.dailyUsage = (newStats.power.total / 3600000).toFixed(3);

            // Calculate load percentage (assuming max load is max power seen)
            newStats.loadPercentage = newStats.power.max > 0 
                ? ((power / newStats.power.max) * 100).toFixed(1)
                : 0;

            return newStats;
        });
    };

    // Update Charts
    const updateCharts = (timestamp, voltage, current, power) => {
        setChartData(prev => {
            const newData = { ...prev };
            
            newData.timestamps.push(timestamp);
            newData.voltage.push(voltage);
            newData.current.push(current);
            newData.power.push(power);

            // Keep only MAX_POINTS
            if (newData.timestamps.length > newData.MAX_POINTS) {
                newData.timestamps.shift();
                newData.voltage.shift();
                newData.current.shift();
                newData.power.shift();
            }

            return newData;
        });
    };

    // Get Voltage Status
    const getVoltageStatus = (voltage) => {
        if (voltage < 200) return { text: 'Low', color: '#ff4444' };
        if (voltage > 250) return { text: 'High', color: '#ff9800' };
        return { text: 'Normal', color: '#3ddc84' };
    };

    // Firebase Listeners
    useEffect(() => {
        if (!auth.currentUser) return;

        // Store warnings from both sources
        let collectionWarnings = [];
        let energyWarning = null;

        const updateCombinedWarnings = () => {
            const combined = [...collectionWarnings];
            
            // Add energy data warning if exists and is not "Normal"
            if (energyWarning && energyWarning.message && 
                energyWarning.message.toLowerCase() !== 'normal') {
                // Check if not already in collection warnings
                const exists = combined.some(w => w.message === energyWarning.message);
                if (!exists) {
                    combined.unshift(energyWarning); // Add to beginning
                }
            }
            
            console.log('🔔 Combined warnings:', combined);
            setWarnings(combined);
            setNotificationCount(combined.length);
        };

        // Listen to energy data
        const energyDataDocRef = doc(db, 'energy_data', 'latest');
        const unsubscribeEnergy = onSnapshot(energyDataDocRef, (docSnapshot) => {
            const data = docSnapshot.data();
            console.log('🔥 Firebase energy data received:', data);
            
            if (data) {
                const timestamp = formatTime(new Date());
                setEnergyData(data);
                setLastUpdated(new Date());
                updateStatistics(data.voltage, data.current, data.power);
                updateCharts(timestamp, data.voltage, data.current, data.power);
                
                // Check for warning in energy data
                if (data.warning && data.warning.toLowerCase() !== 'normal') {
                    console.log('⚠️ Warning detected in energy_data:', data.warning);
                    energyWarning = {
                        id: 'energy-warning-live',
                        message: data.warning,
                        timestamp: data.timestamp?.toDate ? 
                            data.timestamp.toDate().toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            }) : 
                            new Date().toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })
                    };
                } else {
                    energyWarning = null;
                }
                
                updateCombinedWarnings();
            } else {
                console.log('❌ No energy data received from Firebase');
            }
        });

        // Listen to system control
        const systemControlDocRef = doc(db, 'system_control', 'status');
        const unsubscribeSystem = onSnapshot(systemControlDocRef, (docSnapshot) => {
            const data = docSnapshot.data();
            if (data) {
                setSystemStatus(prev => ({
                    ...prev,
                    isOn: data.isOn || false
                }));
            }
        });

        // Listen to warnings collection (separate collection like in original dashboard)
        const warningsCollection = collection(db, 'warnings');
        const unsubscribeWarnings = onSnapshot(warningsCollection, (snapshot) => {
            console.log('⚠️ Warnings snapshot received, doc count:', snapshot.docs.length);
            console.log('⚠️ Snapshot empty?', snapshot.empty);
            
            if (snapshot.empty) {
                console.log('⚠️ No warning documents found in collection');
                collectionWarnings = [];
                updateCombinedWarnings();
                return;
            }
            
            const warningList = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log('📄 Warning doc ID:', doc.id, 'Data:', data);
                
                return {
                    id: doc.id,
                    message: data.message || 'Unknown warning',
                    timestamp: data.timestamp?.toDate ? 
                        data.timestamp.toDate().toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }) : 
                        (data.timestamp || new Date().toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }))
                };
            });

            // Sort by timestamp (newest first)
            warningList.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });

            console.log('✅ Collection warnings processed:', warningList);
            collectionWarnings = warningList;
            updateCombinedWarnings();
        }, (error) => {
            console.error('❌ Error listening to warnings:', error);
            collectionWarnings = [];
            updateCombinedWarnings();
        });

        return () => {
            unsubscribeEnergy();
            unsubscribeSystem();
            unsubscribeWarnings();
        };
    }, [auth.currentUser, db]);

    // Initialize Charts
    useEffect(() => {
        // Copy ref at the start of the effect for cleanup
        const currentChartInstances = chartInstances.current;
        
        const chartConfig = {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: '#007bff',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Time' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        };

        // Voltage Chart
        if (voltageChartRef.current) {
            if (currentChartInstances.voltage) {
                currentChartInstances.voltage.destroy();
            }
            currentChartInstances.voltage = new Chart(voltageChartRef.current, {
                type: 'line',
                data: {
                    labels: chartData.timestamps,
                    datasets: [{
                        label: 'Voltage (V)',
                        data: chartData.voltage,
                        borderColor: '#38f9d7',
                        backgroundColor: 'rgba(56, 249, 215, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#38f9d7',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    ...chartConfig,
                    scales: {
                        ...chartConfig.scales,
                        y: { ...chartConfig.scales.y, title: { display: true, text: 'Voltage (V)' } }
                    }
                }
            });
        }

        // Current Chart
        if (currentChartRef.current) {
            if (currentChartInstances.current) {
                currentChartInstances.current.destroy();
            }
            currentChartInstances.current = new Chart(currentChartRef.current, {
                type: 'line',
                data: {
                    labels: chartData.timestamps,
                    datasets: [{
                        label: 'Current (A)',
                        data: chartData.current,
                        borderColor: '#2575fc',
                        backgroundColor: 'rgba(37, 117, 252, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#2575fc',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    ...chartConfig,
                    scales: {
                        ...chartConfig.scales,
                        y: { ...chartConfig.scales.y, title: { display: true, text: 'Current (A)' } }
                    }
                }
            });
        }

        // Power Chart
        if (powerChartRef.current) {
            if (currentChartInstances.power) {
                currentChartInstances.power.destroy();
            }
            currentChartInstances.power = new Chart(powerChartRef.current, {
                type: 'line',
                data: {
                    labels: chartData.timestamps,
                    datasets: [{
                        label: 'Power (W)',
                        data: chartData.power,
                        borderColor: '#fad0c4',
                        backgroundColor: 'rgba(250, 208, 196, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#fad0c4',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    ...chartConfig,
                    scales: {
                        ...chartConfig.scales,
                        y: { ...chartConfig.scales.y, title: { display: true, text: 'Power (W)' } }
                    }
                }
            });
        }

        // Combined Chart
        if (combinedChartRef.current) {
            if (currentChartInstances.combined) {
                currentChartInstances.combined.destroy();
            }
            currentChartInstances.combined = new Chart(combinedChartRef.current, {
                type: 'line',
                data: {
                    labels: chartData.timestamps,
                    datasets: [
                        {
                            label: 'Voltage (V)',
                            data: chartData.voltage,
                            borderColor: '#38f9d7',
                            backgroundColor: 'rgba(56, 249, 215, 0.1)',
                            yAxisID: 'y',
                            borderWidth: 2,
                            tension: 0.4
                        },
                        {
                            label: 'Current (A)',
                            data: chartData.current,
                            borderColor: '#2575fc',
                            backgroundColor: 'rgba(37, 117, 252, 0.1)',
                            yAxisID: 'y1',
                            borderWidth: 2,
                            tension: 0.4
                        },
                        {
                            label: 'Power (W)',
                            data: chartData.power,
                            borderColor: '#e46c27',
                            backgroundColor: 'rgba(228, 108, 39, 0.1)',
                            yAxisID: 'y2',
                            borderWidth: 2,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    ...chartConfig,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        x: chartConfig.scales.x,
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: { display: true, text: 'Voltage (V)' }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: { display: true, text: 'Current (A)' },
                            grid: { drawOnChartArea: false }
                        },
                        y2: {
                            type: 'linear',
                            display: false,
                            position: 'right'
                        }
                    }
                }
            });
        }

        return () => {
            // Use the copied ref from the start of the effect
            Object.values(currentChartInstances).forEach(chart => {
                if (chart) chart.destroy();
            });
        };
    }, [chartData]);

    // Toggle System
    const handleToggleSystem = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const systemControlDocRef = doc(db, 'system_control', 'status');
            const newStatus = !systemStatus.isOn;
            await updateDoc(systemControlDocRef, { isOn: newStatus });
            
            setSystemStatus(prev => ({
                ...prev,
                isOn: newStatus,
                lastAction: `System ${newStatus ? 'turned on' : 'turned off'}`
            }));
            
            showToast(`System ${newStatus ? 'ON' : 'OFF'}`);
        } catch (error) {
            console.error('Toggle Error:', error);
            showToast('Failed to toggle system', 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear Warnings
    const handleClearWarnings = async () => {
        try {
            // Clear from warnings collection (matching original dashboard.js)
            const warningsCollection = collection(db, 'warnings');
            const warningsSnapshot = await getDocs(warningsCollection);
            
            // Delete all warning documents
            for (const docSnapshot of warningsSnapshot.docs) {
                await deleteDoc(docSnapshot.ref);
            }
            
            // Also clear the warning field in energy_data/latest
            const energyDataDocRef = doc(db, 'energy_data', 'latest');
            await updateDoc(energyDataDocRef, { 
                warning: '' 
            });
            
            console.log('✅ All warnings cleared (collection + energy_data field)');
            
            setWarnings([]);
            setNotificationCount(0);
            setShowNotificationModal(false); // Close modal after clearing
        } catch (error) {
            console.error('Clear Warnings Error:', error) ;
            showToast('Failed to clear warnings', 3000);
        }
    };

    // Logout Handler
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    // Toast Notification
    const showToast = (message, duration = 1800) => {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        if (!toast || !toastMsg) return;
        
        toastMsg.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    // Export CSV Function
    const handleExportCSV = () => {
        try {
            // CSV Title and header
            const title = 'Smart Energy Meter Dashboard Data Export';
            const generated = `Generated: ${new Date().toLocaleString()}`;
            const header = [
                'Time',
                'Voltage (V)',
                'Current (A)',
                'Power (W)',
                'Power Factor',
                'Voltage Status',
                'System Status',
                'Daily Usage (kWh)'
            ];
            
            const csvRows = [
                title,
                generated,
                '',
                header.join(',')
            ];

            // Add data rows
            for (let i = 0; i < chartData.timestamps.length; i++) {
                const time = chartData.timestamps[i];
                const voltage = chartData.voltage[i];
                const current = chartData.current[i];
                const power = chartData.power[i];
                
                // Calculate power factor for this row
                let pf = '';
                if (voltage && current) {
                    pf = power && voltage * current ? (power / (voltage * current)).toFixed(2) : '';
                }
                
                // Voltage status
                let vStatus = '';
                if (typeof voltage === 'number') {
                    if (voltage < 200) vStatus = 'Low';
                    else if (voltage > 250) vStatus = 'High';
                    else vStatus = 'Normal';
                }
                
                // System status (use latest value)
                const sysStatus = systemStatus.isOn ? 'Online' : 'Offline';
                
                // Daily usage (use latest value)
                const daily = statistics.dailyUsage;
                
                csvRows.push([
                    time,
                    voltage.toFixed(2),
                    current.toFixed(2),
                    power.toFixed(2),
                    pf,
                    vStatus,
                    sysStatus,
                    daily
                ].join(','));
            }

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `energy_data_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            
            showToast('Data exported as CSV successfully');
        } catch (error) {
            console.error('Export CSV Error:', error);
            showToast('Failed to export CSV', 3000);
        }
    };

    // Export PDF Function
    const handleExportPDF = async () => {
        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) {
            showToast('PDF library loading... Please try again', 3000);
            return;
        }

        try {
            showToast('Generating PDF report...');

            const doc = new jsPDF({ unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;

            // Brand colors
            const primary = [10, 16, 38];
            const accent = [255, 224, 102];
            const lightBg = [248, 249, 250];

            // --- Cover Page ---
            doc.setFillColor(...primary);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // Load and add logo
            try {
                const logoImg = new Image();
                logoImg.src = require('../assets/logo.png');
                
                await new Promise((resolve, reject) => {
                    logoImg.onload = () => {
                        const logoWidth = 40;
                        const logoHeight = 60;
                        const logoX = (pageWidth - logoWidth) / 2;
                        const logoY = 40;
                        
                        doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);
                        resolve();
                    };
                    logoImg.onerror = () => {
                        console.warn('Logo failed to load, skipping...');
                        resolve(); // Continue without logo
                    };
                });
            } catch (error) {
                console.warn('Logo loading error:', error);
                // Continue without logo
            }

            // Title
            doc.setTextColor(...accent);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text('ENERGY MONITORING REPORT', pageWidth / 2, 115, { align: 'center' });

            // Subtitle
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont(undefined, 'normal');
            doc.text('Smart Energy Meter Dashboard', pageWidth / 2, 130, { align: 'center' });

            // Report details
            doc.setFontSize(10);
            const now = new Date();
            doc.text(`Generated: ${now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })} at ${now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })}`, pageWidth / 2, 140, { align: 'center' });

            // --- Executive Summary Page ---
            doc.addPage();

            // Header
            doc.setFillColor(...primary);
            doc.rect(0, 0, pageWidth, 20, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('EXECUTIVE SUMMARY', margin, 15);

            // Summary content
            let yPos = 35;
            doc.setTextColor(...primary);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Key Performance Indicators', margin, yPos);

            yPos += 16;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(51, 51, 51);

            const kpiData = [
                ['Voltage', `${energyData.voltage.toFixed(2)} V`],
                ['Current', `${energyData.current.toFixed(2)} A`],
                ['Power', `${energyData.power.toFixed(2)} W`],
                ['Daily Usage', `${statistics.dailyUsage} kWh`]
            ];

            const contentWidth = pageWidth - margin * 2;
            const dividerX = margin + contentWidth / 2;
            const columnInnerWidth = (contentWidth / 2) - 12;
            const kpiRectH = 12;
            const kpiRowSpacing = 16;

            kpiData.forEach(([label, value], index) => {
                const col = index % 2;
                const row = Math.floor(index / 2);
                const colLeft = col === 0 ? margin + 6 : dividerX + 6;
                const x = colLeft;
                const y = yPos + row * kpiRowSpacing;

                doc.setFillColor(...lightBg);
                doc.rect(x, y - (kpiRectH - 2), columnInnerWidth, kpiRectH, 'F');

                doc.setTextColor(...primary);
                doc.setFont(undefined, 'bold');
                doc.setFontSize(9);
                doc.text(label + ':', x + 4, y);

                doc.setTextColor(51, 51, 51);
                doc.setFont(undefined, 'normal');
                doc.setFontSize(9);
                const valueX = x + columnInnerWidth - 4;
                doc.text(value, valueX, y, { align: 'right' });
            });

            yPos += 40;

            // System Status
            doc.setTextColor(...primary);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('System Status', margin, yPos);

            yPos += 7;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(51, 51, 51);

            const statusData = [
                ['Overall Status', systemStatus.isOn ? 'Online' : 'Offline'],
                ['Connection', systemStatus.connectionStatus],
                ['Last Action', systemStatus.lastAction]
            ];

            statusData.forEach(([label, value]) => {
                doc.text(`• ${label}: ${value}`, margin, yPos);
                yPos += 5;
            });

            yPos += 8;

            // Energy Statistics
            doc.setTextColor(...primary);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Energy Statistics', margin, yPos);

            yPos += 7;
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            const statsData = [
                ['Voltage Min', statistics.voltage.min === Infinity ? '0.00V' : `${statistics.voltage.min.toFixed(2)}V`],
                ['Voltage Max', statistics.voltage.max === -Infinity ? '0.00V' : `${statistics.voltage.max.toFixed(2)}V`],
                ['Voltage Avg', `${statistics.voltage.avg.toFixed(2)}V`],
                ['Current Peak', `${statistics.current.peak.toFixed(2)}A`],
                ['Current Avg', `${statistics.current.avg.toFixed(2)}A`],
                ['Power Total', `${statistics.power.total.toFixed(2)}W`]
            ];

            statsData.forEach(([label, value], index) => {
                const x = margin + (index % 2) * 90;
                const y = yPos + Math.floor(index / 2) * 5;
                doc.text(`${label}: ${value}`, x, y);
            });

            // --- Data Table Page ---
            doc.addPage();

            doc.setFillColor(...primary);
            doc.rect(0, 0, pageWidth, 20, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('DETAILED MEASUREMENTS', margin, 15);

            let dataY = 35;

            // Table header
            doc.setFillColor(16, 26, 58);
            doc.rect(margin, dataY - 3, pageWidth - margin * 2, 6, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            
            const headers = ['Time', 'Voltage (V)', 'Current (A)', 'Power (W)'];
            headers.forEach((header, i) => {
                doc.text(header, margin + (i * 45), dataY);
            });

            dataY += 8;

            // Table data
            doc.setTextColor(51, 51, 51);
            doc.setFont(undefined, 'normal');
            
            chartData.timestamps.slice(0, 20).forEach((time, i) => {
                doc.text(time, margin, dataY);
                doc.text(chartData.voltage[i].toFixed(2), margin + 45, dataY);
                doc.text(chartData.current[i].toFixed(2), margin + 90, dataY);
                doc.text(chartData.power[i].toFixed(2), margin + 135, dataY);
                dataY += 5;
            });

            // Add page numbers
            const totalPages = doc.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setTextColor(102, 102, 102);
                doc.setFontSize(7);
                doc.text(
                    `Page ${i} of ${totalPages} | Smart Energy Meter Report`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            // Save PDF
            const fileName = `Energy_Report_${now.toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            showToast('PDF report generated successfully!');

        } catch (error) {
            console.error('PDF Export Error:', error);
            showToast('Failed to generate PDF: ' + error.message, 3000);
        }
    };

    // Reset Data Function
    const handleResetData = async () => {
        const confirmReset = window.confirm(
            'Are you sure you want to reset system configuration to default values?\n\n' +
            'This will reset:\n' +
            '• Low Voltage Threshold: 220V\n' +
            '• High Voltage Threshold: 240V\n' +
            '• Overcurrent Threshold: 10.0A\n' +
            '• Power Threshold: 2400W\n' +
            '• Buzzer: Enabled'
        );

        if (!confirmReset) return;

        try {
            showToast('Resetting system configuration...');

            const systemStatusRef = doc(db, 'system_control', 'status');
            
            const DEFAULTS = {
                lowVoltageThreshold: 220,
                highVoltageThreshold: 240,
                overcurrentThreshold: 10.0,
                powerThreshold: 2400,
                buzzerEnabled: true
            };

            await updateDoc(systemStatusRef, {
                minVoltage: DEFAULTS.lowVoltageThreshold,
                maxVoltage: DEFAULTS.highVoltageThreshold,
                maxCurrent: DEFAULTS.overcurrentThreshold,
                maxPower: DEFAULTS.powerThreshold,
                Buzzer: DEFAULTS.buzzerEnabled,
                updatedAt: new Date().toLocaleString()
            });

            showToast('System configuration reset to defaults successfully!');

        } catch (error) {
            console.error('Reset Data Error:', error);
            showToast('Failed to reset system configuration: ' + error.message, 3000);
        }
    };

    const voltageStatusInfo = getVoltageStatus(energyData.voltage);

    return (
        <div className={styles.dashboardPage}>

            {/* Notification Modal */}
            {showNotificationModal && (
                <div className={`${styles.modal} ${styles.show}`}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeBtn} onClick={() => setShowNotificationModal(false)}>&times;</span>
                        <h2><i className="fas fa-bell"></i> Warning Logs</h2>
                        <ul id="warning-list">
                            {warnings.length === 0 ? (
                                <li>No warnings</li>
                            ) : (
                                warnings.map(warning => (
                                    <li key={warning.id}>
                                        {warning.timestamp} - {warning.message}
                                    </li>
                                ))
                            )}
                        </ul>
                        <button className={styles.clearBtn} onClick={handleClearWarnings}>
                            <i className="fas fa-trash"></i> Clear All Warnings
                        </button>
                    </div>
                </div>
            )}

            <main>
                {/* Dashboard Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>Energy <span className={styles.highlight}>Dashboard</span></h1>
                        <p className={styles.heroDesc}>Welcome to the Smart Energy Meter Dashboard, your real-time monitoring
                    tool for energy usage and system performance. This dashboard provides
                    comprehensive insights into key electrical parameters, allowing you to
                    track and optimize energy consumption.</p>
                    </div>
                    <div className={styles.heroImage}>
                        <img src={require('../assets/logo.png')} alt="Smart Meter Logo" style={{ background: 'none', boxShadow: 'none', borderRadius: 0 }} onError={e => e.target.style.display = 'none'} />
                    </div>
                </section>

                {/* Status Bar */}
                <section className={styles.heroStatusBar}>
                    <div className={styles.heroStatus}>
                        <div className={styles.statusLeft}>
                            <div className={`${styles.statusIndicator} ${systemStatus.isOn ? styles.online : styles.offline}`}>
                                <span className={`${styles.statusDot} ${systemStatus.isOn ? styles.active : ''}`}></span>
                                <span>System {systemStatus.isOn ? 'Online' : 'Offline'}</span>
                            </div>
                            <div className={styles.lastUpdate}>
                                <i className="fas fa-clock"></i>
                                <span>Updated {formatTime(lastUpdated)}</span>
                            </div>
                        </div>
                        <div className={styles.statusRight}>
                            <button className={styles.notificationIcon} onClick={() => setShowNotificationModal(true)} aria-label="View notifications">
                                <i className="fas fa-bell"></i>
                                {notificationCount > 0 && <span id="notification-count">{notificationCount}</span>}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Real-Time Data Section */}
                <section className={styles.realTimeSection}>
                    <h2>Real-Time Energy Data</h2>
                    <div className={styles.dataGrid}>
                        <div className={`${styles.dataCard} ${styles.voltageCard}`}>
                            <div className={styles.cardIcon}>
                                <i className="fas fa-bolt"></i>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.dataLabel}>Voltage</div>
                                <div className={styles.dataValue} id="voltage-value">{energyData.voltage.toFixed(2)} V</div>
                                <div className={styles.cardStatus} style={{ color: voltageStatusInfo.color }}>
                                    {voltageStatusInfo.text}
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.dataCard} ${styles.currentCard}`}>
                            <div className={styles.cardIcon}>
                                <i className="fas fa-wave-square"></i>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.dataLabel}>Current</div>
                                <div className={styles.dataValue} id="current-value">{energyData.current.toFixed(2)} A</div>
                            </div>
                        </div>

                        <div className={`${styles.dataCard} ${styles.powerCard}`}>
                            <div className={styles.cardIcon}>
                                <i className="fas fa-plug"></i>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.dataLabel}>Power</div>
                                <div className={styles.dataValue} id="power-value">{energyData.power.toFixed(2)} W</div>
                            </div>
                        </div>

                        <div className={`${styles.dataCard} ${styles.alertCard}`}>
                            <div className={styles.cardIcon}>
                                <i className="fas fa-exclamation-triangle"></i>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.dataLabel}>Warning</div>
                                <div className={styles.dataValue} id="warning-value">{energyData.warning}</div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Statistics */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <i className="fas fa-calendar-day"></i>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>Daily Usage</div>
                                <div className={styles.statValue}>{statistics.dailyUsage} kWh</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>System Uptime</div>
                                <div className={styles.statValue}>{formatUptime(systemUptime)}</div>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.statLabel}>Power Factor</div>
                                <div className={styles.statValue}>{statistics.powerFactor.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* System Control Section */}
                <section className={styles.controlSection}>
                    <h2>System Control & Status</h2>
                    <div className={styles.controlGrid}>
                        <div className={styles.systemStatusCard}>
                            <div className={styles.statusHeader}>
                                <h3>System Status</h3>
                                <div className={styles.connectionStatus}>
                                    <i className="fas fa-wifi"></i>
                                    <span>{systemStatus.connectionStatus}</span>
                                </div>
                            </div>
                            <div className={styles.statusContent}>
                                <div className={styles.statusValue}>
                                    <span className={`${styles.statusIndicator} ${systemStatus.isOn ? styles.active : ''}`}>
                                        {systemStatus.isOn ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                                <div className={styles.statusInfo}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Voltage Status:</span>
                                        <span className={styles.infoValue} style={{ color: voltageStatusInfo.color }}>
                                            {voltageStatusInfo.text}
                                        </span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Last Action:</span>
                                        <span className={styles.infoValue}>{systemStatus.lastAction}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.controlPanel}>
                            <h3>Control Panel</h3>
                            <p>Manage your smart energy meter system</p>
                            <div className={styles.controlButtons}>
                                <button 
                                    className={`${styles.controlBtn} ${styles.primary} ${systemStatus.isOn ? styles.on : ''}`}
                                    onClick={handleToggleSystem}
                                    disabled={isLoading}
                                >
                                    <i className={`fas fa-power-off`}></i>
                                    {isLoading ? 'Processing...' : (systemStatus.isOn ? 'Turn OFF' : 'Turn ON')}
                                </button>
                                <button className={`${styles.controlBtn} ${styles.secondary}`} onClick={() => navigate('/config')}>
                                    <i className="fas fa-cog"></i>
                                    Configure
                                </button>
                            </div>
                            <div className={styles.controlStats}>
                                <div className={styles.controlStat}>
                                    <i className="fas fa-chart-line"></i>
                                    <span>Load: <strong>{statistics.loadPercentage}%</strong></span>
                                </div>
                                <div className={styles.controlStat}>
                                    <i className="fas fa-battery-three-quarters"></i>
                                    <span>Efficiency: <strong>98%</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Analytics Section */}
                <section className={styles.analyticsSection}>
                    <div className={styles.analyticsHeader}>
                        <h2>Energy Analytics</h2>
                        <div className={styles.analyticsControls}>
                            <select className={styles.timeSelect}>
                                <option value="realtime">Real-time</option>
                                <option value="1h">Last Hour</option>
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                            </select>
                            <button className={styles.refreshBtn}>
                                <i className="fas fa-sync-alt"></i>
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className={styles.chartsGrid}>
                        {/* Voltage Chart */}
                        <div className={styles.chartContainer}>
                            <div className={styles.chartHeader}>
                                <h3><i className="fas fa-bolt"></i> Voltage Monitor</h3>
                                <div className={styles.chartStats}>
                                    <span>Min: <strong>{statistics.voltage.min === Infinity ? '0.00' : statistics.voltage.min.toFixed(2)}V</strong></span>
                                    <span>Max: <strong>{statistics.voltage.max === -Infinity ? '0.00' : statistics.voltage.max.toFixed(2)}V</strong></span>
                                    <span>Avg: <strong>{statistics.voltage.avg.toFixed(2)}V</strong></span>
                                </div>
                            </div>
                            <div className={styles.chartWrapper}>
                                <canvas ref={voltageChartRef}></canvas>
                            </div>
                        </div>

                        {/* Current Chart */}
                        <div className={styles.chartContainer}>
                            <div className={styles.chartHeader}>
                                <h3><i className="fas fa-wave-square"></i> Current Flow</h3>
                                <div className={styles.chartStats}>
                                    <span>Peak: <strong>{statistics.current.peak.toFixed(2)}A</strong></span>
                                    <span>Avg: <strong>{statistics.current.avg.toFixed(2)}A</strong></span>
                                </div>
                            </div>
                            <div className={styles.chartWrapper}>
                                <canvas ref={currentChartRef}></canvas>
                            </div>
                        </div>

                        {/* Power Chart */}
                        <div className={styles.chartContainer}>
                            <div className={styles.chartHeader}>
                                <h3><i className="fas fa-plug"></i> Power Consumption</h3>
                                <div className={styles.chartStats}>
                                    <span>Total: <strong>{statistics.power.total.toFixed(2)}W</strong></span>
                                    <span>Peak: <strong>{statistics.power.peak.toFixed(2)}W</strong></span>
                                </div>
                            </div>
                            <div className={styles.chartWrapper}>
                                <canvas ref={powerChartRef}></canvas>
                            </div>
                        </div>

                        {/* Combined Chart */}
                        <div className={`${styles.chartContainer} ${styles.fullWidth}`}>
                            <div className={styles.chartHeader}>
                                <h3><i className="fas fa-chart-line"></i> Combined Analytics Overview</h3>
                                <div className={styles.chartStats}>
                                    <span><i className="fas fa-chart-bar"></i> Real-time Data Visualization</span>
                                    <span><i className="fas fa-sync-alt"></i> Auto-updating</span>
                                </div>
                            </div>
                            <div className={styles.chartWrapper}>
                                <canvas ref={combinedChartRef}></canvas>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Section */}
                <section className={styles.actionSection}>
                    <h2>Data Management & Tools</h2>
                    <div className={styles.actionGrid}>
                        <div className={styles.actionCard}>
                            <div className={styles.actionIcon}>
                                <i className="fas fa-download"></i>
                            </div>
                            <h3>Export Data</h3>
                            <p>Download your energy data in various formats</p>
                            <div className={styles.actionButtons}>
                                <button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleExportCSV}>
                                    <i className="fas fa-file-csv"></i>
                                    Export CSV
                                </button>
                                <button className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleExportPDF}>
                                    <i className="fas fa-file-pdf"></i>
                                    Export PDF
                                </button>
                            </div>
                        </div>

                        <div className={styles.actionCard}>
                            <div className={styles.actionIcon}>
                                <i className="fas fa-user-cog"></i>
                            </div>
                            <h3>Account Settings</h3>
                            <p>Manage your profile and preferences</p>
                            <div className={styles.actionButtons}>
                                <button className={`${styles.actionBtn1} ${styles.secondary}`} onClick={() => navigate('/profile')}>
                                    <i className="fas fa-user"></i>
                                    Profile
                                </button>
                                <button className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    Logout
                                </button>
                            </div>
                        </div>

                        <div className={styles.actionCard}>
                            <div className={styles.actionIcon}>
                                <i className="fas fa-tools"></i>
                            </div>
                            <h3>System Tools</h3>
                            <p>Advanced system management options</p>
                            <div className={styles.actionButtons}>
                                <button className={`${styles.actionBtn} ${styles.secondary}`} onClick={() => navigate('/configure')}>
                                    <i className="fas fa-redo"></i>
                                    Configure
                                </button>
                                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleResetData}>
                                    <i className="fas fa-trash-alt"></i>
                                    Reset Data
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Social Media Section */}
            <section className={styles.socialModern}>
			<h2>Connect with the Developer</h2>
			<div className={styles.socialIcons}>
				<a href="https://github.com/gmpsankalpa" target="_blank" title="GitHub" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
				<a href="https://linkedin.com/in/gmpsankalpa" target="_blank" title="LinkedIn" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
				<a href="https://twitter.com/gmpsankalpa" target="_blank" title="Twitter" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
				<a href="https://facebook.com/gmpsankalpa" target="_blank" title="Facebook" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
			</div>
			<p className={styles.devCredit}>Developed by <strong>GMP Sankalpa</strong> | Final Year Project</p>
		</section>

            {/* Toast Notification */}
            <div id="toast">
                <span id="toast-message"></span>
            </div>
        </div>
    );
};

export default Dashboard;
