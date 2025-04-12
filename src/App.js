import './App.css';
import React, { useState, useEffect } from 'react';

// Main App Component
const App = () => {
  // States for app functionality
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [animateLogin, setAnimateLogin] = useState(false);
  
  // Device states
  const [registeredDevices, setRegisteredDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({ name: '', deviceType: 'bluetooth', identifier: '' });
  const [isScanning, setIsScanning] = useState(false);
  
  // BLE device states
  const [bleDevices, setBleDevices] = useState([
    { id: 1, name: 'BLE Device 1', address: 'AA:BB:CC:11:22:33', signal: -67, isConnected: true, battery: 85, temperature: 24.5 },
    { id: 2, name: 'BLE Device 2', address: 'AA:BB:CC:44:55:66', signal: -82, isConnected: true, battery: 63, temperature: 26.2 },
  ]);
  
  // ESP32 states
  const [esp32Devices, setEsp32Devices] = useState([
    { id: 1, name: 'Root Node', status: 'online', lastSeen: new Date().toISOString(), cpuLoad: 32, memoryUsage: 45, uptime: 142 },
    { id: 2, name: 'Mesh Node 1', status: 'online', lastSeen: new Date().toISOString(), cpuLoad: 18, memoryUsage: 33, uptime: 98 },
    { id: 3, name: 'Mesh Node 2', status: 'online', lastSeen: new Date().toISOString(), cpuLoad: 24, memoryUsage: 28, uptime: 120 },
    { id: 4, name: 'Mesh Node 3', status: 'offline', lastSeen: new Date(Date.now() - 86400000).toISOString(), cpuLoad: 0, memoryUsage: 0, uptime: 0 },
  ]);
  
  // Schedule states
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ deviceId: '', startTime: '', endTime: '', days: [] });
  
  // Dashboard states
  const [deviceStats, setDeviceStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    offline: 0,
    batteryLow: 0
  });
  
  // Activity Log
  const [activityLog, setActivityLog] = useState([
    { id: 1, action: 'System started', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'System' },
    { id: 2, action: 'BLE Device 1 connected', timestamp: new Date(Date.now() - 2400000).toISOString(), user: 'System' },
    { id: 3, action: 'BLE Device 2 connected', timestamp: new Date(Date.now() - 1200000).toISOString(), user: 'System' },
  ]);

  // Map view state
  const [showMap, setShowMap] = useState(false);
  const [mapNodes, setMapNodes] = useState([
    { id: 1, x: 150, y: 80, deviceId: 1, type: 'rootNode' },
    { id: 2, x: 250, y: 150, deviceId: 2, type: 'meshNode' },
    { id: 3, x: 100, y: 200, deviceId: 3, type: 'meshNode' },
    { id: 4, x: 300, y: 250, deviceId: 4, type: 'meshNode', isOffline: true },
  ]);
  
  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  
  // Calculate stats effect
  useEffect(() => {
    const total = registeredDevices.length + bleDevices.length + esp32Devices.length;
    const active = bleDevices.filter(d => d.isConnected).length + 
                   esp32Devices.filter(d => d.status === 'online').length;
    const offline = total - active;
    const batteryLow = bleDevices.filter(d => d.battery < 20).length;
    
    setDeviceStats({
      totalDevices: total,
      activeDevices: active,
      offline: offline,
      batteryLow: batteryLow
    });
  }, [registeredDevices, bleDevices, esp32Devices]);

  // Notification system
  const showToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Login handler with animation
  const handleLogin = (e) => {
    e.preventDefault();
    setAnimateLogin(true);
    
    // Simple validation
    if (username && password) {
      setTimeout(() => {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
        addActivityLogEntry(`User "${username}" logged in`);
        showToast(`Welcome back, ${username}!`);
        setAnimateLogin(false);
      }, 1000);
    } else {
      setTimeout(() => {
        showToast('Please enter valid credentials');
        setAnimateLogin(false);
      }, 1000);
    }
  };

  // Add new device with notification
  const handleAddDevice = (e) => {
    e.preventDefault();
    if (newDevice.name && newDevice.identifier) {
      const newDeviceWithId = { 
        ...newDevice, 
        id: Date.now(),
        status: 'pending'
      };
      
      // Simulate device verification
      setTimeout(() => {
        setRegisteredDevices(prev => {
          const updated = prev.map(d => 
            d.id === newDeviceWithId.id 
              ? {...d, status: 'registered'} 
              : d
          );
          return updated;
        });
        showToast(`Device "${newDevice.name}" successfully registered!`);
        addActivityLogEntry(`Device "${newDevice.name}" was registered`);
      }, 1500);
      
      setRegisteredDevices([...registeredDevices, newDeviceWithId]);
      setNewDevice({ name: '', deviceType: 'bluetooth', identifier: '' });
      showToast('Processing device registration...');
    }
  };

  // Simulate BLE scanning
  const startScanning = () => {
    setIsScanning(true);
    showToast('Scanning for Bluetooth devices...');
    
    // Simulate finding new devices
    setTimeout(() => {
      const newDevice = { 
        id: Date.now(), 
        name: 'New BLE Device', 
        address: 'BB:CC:DD:11:22:33', 
        signal: -75, 
        isConnected: false,
        battery: 92,
        temperature: 22.8
      };
      
      setBleDevices(prev => [...prev, newDevice]);
      setIsScanning(false);
      showToast('New Bluetooth device found!');
      addActivityLogEntry('New Bluetooth device discovered');
    }, 3000);
  };

  // Add new schedule
  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (newSchedule.deviceId && newSchedule.startTime && newSchedule.endTime && newSchedule.days.length > 0) {
      const newScheduleItem = { ...newSchedule, id: Date.now() };
      setSchedules([...schedules, newScheduleItem]);
      setNewSchedule({ deviceId: '', startTime: '', endTime: '', days: [] });
      showToast('New schedule created successfully!');
      addActivityLogEntry('New device schedule created');
    } else {
      showToast('Please fill all schedule fields and select at least one day');
    }
  };

  // Toggle day selection for schedule
  const toggleDay = (day) => {
    const days = [...newSchedule.days];
    if (days.includes(day)) {
      setNewSchedule({ ...newSchedule, days: days.filter(d => d !== day) });
    } else {
      setNewSchedule({ ...newSchedule, days: [...days, day] });
    }
  };
  
  // Add to activity log
  const addActivityLogEntry = (action) => {
    const newEntry = {
      id: Date.now(),
      action: action,
      timestamp: new Date().toISOString(),
      user: username || 'System'
    };
    setActivityLog(prev => [newEntry, ...prev].slice(0, 100)); // Keep last 100 entries
  };
  
  // Connect to device
  const handleConnectDevice = (deviceId) => {
    setBleDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? {...device, isConnected: true} 
          : device
      )
    );
    showToast('Device connected successfully');
    addActivityLogEntry(`Connected to device #${deviceId}`);
  };
  
  // Disconnect device
  const handleDisconnectDevice = (deviceId) => {
    setBleDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? {...device, isConnected: false} 
          : device
      )
    );
    showToast('Device disconnected');
    addActivityLogEntry(`Disconnected from device #${deviceId}`);
  };
  
  // Toggle device power
  const toggleDevicePower = (deviceId) => {
    const device = [...bleDevices, ...registeredDevices].find(d => d.id === deviceId);
    if (device) {
      showToast(`Toggled power for ${device.name}`);
      addActivityLogEntry(`Power toggled for device "${device.name}"`);
    }
  };

  // Toast notification component
  const ToastNotification = () => {
    if (!showNotification) return null;
    
    return (
      <div className={`toast-notification ${showNotification ? 'show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">ℹ️</span>
          <span className="toast-message">{notificationMessage}</span>
        </div>
      </div>
    );
  };

  // Navigation component with modern design
  const Navigation = () => {
    if (!isLoggedIn) return null;
    
    return (
      <div className={`nav ${darkMode ? 'dark' : ''}`}>
        <div className="nav-container">
          <div className="nav-title">
            <span className="logo-icon">🌐</span>
            SSI IoT System
          </div>
          <div className="nav-items">
            <button 
              onClick={() => {
                setCurrentPage('dashboard');
                showToast('Dashboard loaded');
              }}
              className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button 
              onClick={() => {
                setCurrentPage('devices');
                showToast('Device Management loaded');
              }}
              className={`nav-button ${currentPage === 'devices' ? 'active' : ''}`}
            >
              <span className="nav-icon">📱</span>
              Devices
            </button>
            <button 
              onClick={() => {
                setCurrentPage('ble');
                showToast('BLE Monitoring loaded');
              }}
              className={`nav-button ${currentPage === 'ble' ? 'active' : ''}`}
            >
              <span className="nav-icon">📡</span>
              BLE Devices
            </button>
            <button 
              onClick={() => {
                setCurrentPage('scheduling');
                showToast('Scheduling loaded');
              }}
              className={`nav-button ${currentPage === 'scheduling' ? 'active' : ''}`}
            >
              <span className="nav-icon">🕒</span>
              Scheduling
            </button>
            <button 
              onClick={() => {
                setCurrentPage('esp32');
                showToast('ESP32 Status loaded');
              }}
              className={`nav-button ${currentPage === 'esp32' ? 'active' : ''}`}
            >
              <span className="nav-icon">🔌</span>
              ESP32 Status
            </button>
            <button 
              onClick={() => {
                setCurrentPage('map');
                showToast('Network Map loaded');
              }}
              className={`nav-button ${currentPage === 'map' ? 'active' : ''}`}
            >
              <span className="nav-icon">🗺️</span>
              Network Map
            </button>
            <div className="nav-settings">
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  showToast(`${darkMode ? 'Light' : 'Dark'} mode enabled`);
                }}
                className="theme-toggle"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentPage('login');
                  showToast('Logged out successfully');
                  addActivityLogEntry(`User "${username}" logged out`);
                }}
                className="logout-button"
              >
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Interactive Login page
  const LoginPage = () => {
    return (
      <div className={`login-container ${darkMode ? 'dark' : ''}`}>
        <div className={`card login ${animateLogin ? 'animating' : ''}`}>
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-pulse"></div>
              <span className="logo-icon">🌐</span>
            </div>
          </div>
          <h2 className="login-title">
            Self-Sovereign Identity System
          </h2>
          <form onSubmit={handleLogin}>
            <div className="form-group animated">
              <label htmlFor="username">Username</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <div className="form-group animated">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button type="submit" className={`btn btn-primary btn-block ${animateLogin ? 'loading' : ''}`}>
              {animateLogin ? 'Authenticating...' : 'Login'}
              {animateLogin && (
                <div className="spinner"></div>
              )}
            </button>
          </form>
          <div className="theme-toggle-container">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle-button"
            >
              {darkMode ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Dashboard component
  const Dashboard = () => {
    return (
      <div className="dashboard-container">
        <h2 className="section-title">System Dashboard</h2>
        
        <div className="dashboard-grid">
          <div className="card dashboard-card stat-card">
            <div className="stat-icon total">📱</div>
            <div className="stat-content">
              <div className="stat-value">{deviceStats.totalDevices}</div>
              <div className="stat-label">Total Devices</div>
            </div>
          </div>
          
          <div className="card dashboard-card stat-card">
            <div className="stat-icon active">✅</div>
            <div className="stat-content">
              <div className="stat-value">{deviceStats.activeDevices}</div>
              <div className="stat-label">Active Devices</div>
            </div>
          </div>
          
          <div className="card dashboard-card stat-card">
            <div className="stat-icon offline">❌</div>
            <div className="stat-content">
              <div className="stat-value">{deviceStats.offline}</div>
              <div className="stat-label">Offline Devices</div>
            </div>
          </div>
          
          <div className="card dashboard-card stat-card">
            <div className="stat-icon battery">🔋</div>
            <div className="stat-content">
              <div className="stat-value">{deviceStats.batteryLow}</div>
              <div className="stat-label">Low Battery</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-row">
          <div className="card dashboard-section">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-log">
              {activityLog.slice(0, 5).map(entry => (
                <div key={entry.id} className="activity-entry">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <div className="activity-action">{entry.action}</div>
                    <div className="activity-meta">
                      <span className="activity-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      <span className="activity-user">{entry.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-text">View All Activity</button>
          </div>
          
          <div className="card dashboard-section">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => {
                showToast('Device scan initiated');
                addActivityLogEntry('Manual device scan started');
                startScanning();
              }}>
                <span className="action-icon">🔍</span>
                <span className="action-text">Scan for Devices</span>
              </button>
              
              <button className="quick-action-btn" onClick={() => {
                showToast('All Devices Synced');
                addActivityLogEntry('Manual sync performed');
              }}>
                <span className="action-icon">🔄</span>
                <span className="action-text">Sync All Devices</span>
              </button>
              
              <button className="quick-action-btn" onClick={() => {
                setCurrentPage('map');
                showToast('Network Map loaded');
              }}>
                <span className="action-icon">🗺️</span>
                <span className="action-text">View Network Map</span>
              </button>
              
              <button className="quick-action-btn" onClick={() => {
                showToast('System Report Generated');
                addActivityLogEntry('System report generated');
              }}>
                <span className="action-icon">📊</span>
                <span className="action-text">Generate Report</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="card dashboard-section">
          <h3 className="card-title">Device Status Overview</h3>
          <div className="device-overview">
            <div className="device-list-container">
              <h4 className="subsection-title">Online Devices</h4>
              <div className="device-list">
                {[...bleDevices, ...esp32Devices]
                  .filter(d => d.isConnected || d.status === 'online')
                  .slice(0, 3)
                  .map(device => (
                    <div key={device.id} className="device-item">
                      <div className="device-status online"></div>
                      <div className="device-info">
                        <div className="device-name">{device.name}</div>
                        <div className="device-meta">
                          {device.address ? device.address : `Node ${device.id}`}
                        </div>
                      </div>
                      <div className="device-actions">
                        <button className="device-action-btn" onClick={() => toggleDevicePower(device.id)}>
                          Power
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="device-list-container">
              <h4 className="subsection-title">Offline Devices</h4>
              <div className="device-list">
                {[...bleDevices, ...esp32Devices]
                  .filter(d => !d.isConnected || d.status === 'offline')
                  .slice(0, 3)
                  .map(device => (
                    <div key={device.id} className="device-item">
                      <div className="device-status offline"></div>
                      <div className="device-info">
                        <div className="device-name">{device.name}</div>
                        <div className="device-meta">
                          {device.address ? device.address : `Node ${device.id}`}
                        </div>
                      </div>
                      <div className="device-actions">
                        <button className="device-action-btn" onClick={() => {
                          showToast(`Attempting to reconnect to ${device.name}`);
                          addActivityLogEntry(`Reconnect attempt to ${device.name}`);
                        }}>
                          Reconnect
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Device Registration component
  const DeviceRegistration = () => {
    return (
      <div className="section-container">
        <h2 className="section-title">Device Management</h2>
        
        <div className="section-content">
          <div className="card device-card">
            <h3 className="card-title">Add New Device</h3>
            <form onSubmit={handleAddDevice}>
              <div className="form-group animated">
                <label htmlFor="deviceName">Device Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">📱</span>
                  <input
                    id="deviceName"
                    type="text"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                    placeholder="Enter device name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group animated">
                <label htmlFor="deviceType">Device Type</label>
                <div className="select-with-icon">
                  <span className="input-icon">🔌</span>
                  <select
                    id="deviceType"
                    value={newDevice.deviceType}
                    onChange={(e) => setNewDevice({...newDevice, deviceType: e.target.value})}
                    required
                  >
                    <option value="bluetooth">Bluetooth Device</option>
                    <option value="esp32">ESP32 Node</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group animated">
                <label htmlFor="identifier">
                  {newDevice.deviceType === 'bluetooth' ? 'MAC Address' : 'IMEI/Serial Number'}
                </label>
                <div className="input-with-icon">
                  <span className="input-icon">🔢</span>
                  <input
                    id="identifier"
                    type="text"
                    value={newDevice.identifier}
                    onChange={(e) => setNewDevice({...newDevice, identifier: e.target.value})}
                    placeholder={newDevice.deviceType === 'bluetooth' ? 'Format: AA:BB:CC:DD:EE:FF' : 'Enter identifier'}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block">
                <span className="btn-icon">➕</span>
                Register Device
              </button>
            </form>
          </div>
          
          <div className="card device-card">
            <h3 className="card-title">Registered Devices</h3>
            
            {registeredDevices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📱</div>
                <div className="empty-message">No devices registered yet</div>
                <div className="empty-action">Register your first device to get started</div>
              </div>
            ) : (
              <div className="device-list">
                {registeredDevices.map(device => (
                  <div key={device.id} className="registered-device">
                    <div className="device-info">
                      <div className="device-header">
                        <h4 className="device-name">{device.name}</h4>
                        <span className={`device-status-badge ${device.status === 'registered' ? 'success' : 'pending'}`}>
                          {device.status === 'registered' ? 'Registered' : 'Pending'}
                        </span>
                      </div>
                      <div className="device-meta">
                        <span className="device-type">{device.deviceType}</span>
                        <span className="meta-separator">•</span>
                        <span className="device-id">{device.identifier}</span>
                      </div>
                    </div>
                    <div className="device-actions">
                      <button 
                        className="device-action-btn edit"
                        onClick={() => {
                          showToast(`Editing ${device.name}...`);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="device-action-btn delete"
                        onClick={() => {
                          setRegisteredDevices(registeredDevices.filter(d => d.id !== device.id));
                          showToast(`Device "${device.name}" has been removed`);
                          addActivityLogEntry(`Device "${device.name}" was removed from registry`);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // BLE Monitoring
  const BLEMonitoring = () => {
    return (
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Bluetooth Devices Monitoring</h2>
          <button 
            className={`btn btn-primary ${isScanning ? 'loading' : ''}`}
            onClick={startScanning}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <span className="spinner small"></span>
                Scanning...
              </>
            ) : (
              <>
                <span className="btn-icon">🔍</span>
                Scan for Devices
              </>
            )}
          </button>
        </div>
        
        <div className="card ble-card">
          <div className="card-header">
            <h3 className="card-title">Connected Devices ({bleDevices.filter(d => d.isConnected).length})</h3>
            <div className="card-meta">Last updated: just now</div>
          </div>
          
          {bleDevices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📡</div>
              <div className="empty-message">No Bluetooth devices detected</div>
              <div className="empty-action">Click the Scan button to search for nearby devices</div>
            </div>
          ) : (
            <div className="ble-device-list">
              {bleDevices.map(device => (
                <div key={device.id} className="ble-device">
                  <div className="device-main-info">
                    <div className="device-header">
                      <h4 className="device-name">{device.name}</h4>
                      {device.isConnected ? (
                        <span className="status-badge connected">Connected</span>
                      ) : (
                        <span className="status-badge disconnected">Disconnected</span>
                      )}
                    </div>
                    <div className="device-address">{device.address}</div>
                  </div>
                  
                  <div className="device-stats">
                    <div className="stat-group">
                      <div className="stat-label">Signal Strength</div>
                      <div className={`signal-strength ${device.signal > -70 ? 'good' : 'weak'}`}>
                        <div className="signal-bar" style={{ height: `${Math.min(100, 100 + device.signal + 30)}%` }}></div>
                        <div className="signal-bar" style={{ height: `${Math.min(100, 100 + device.signal + 50)}%` }}></div>
                        <div className="signal-bar" style={{ height: `${Math.min(100, 100 + device.signal + 70)}%` }}></div>
                        <div className="signal-value">{device.signal} dBm</div>
                      </div>
                    </div>
                    
                    <div className="stat-group">
                      <div className="stat-label">Battery</div>
                      <div className="battery-indicator">
                        <div 
                          className={`battery-level ${device.battery < 20 ? 'low' : device.battery < 50 ? 'medium' : 'high'}`}
                          style={{ width: `${device.battery}%` }}
                        ></div>
                        <div className="battery-value">{device.battery}%</div>
                      </div>
                    </div>
                    
                    <div className="stat-group">
                      <div className="stat-label">Temperature</div>
                      <div className="temperature-indicator">
                        <div className="temperature-icon">🌡️</div>
                        <div className="temperature-value">{device.temperature}°C</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="device-actions">
                    {device.isConnected ? (
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleDisconnectDevice(device.id)}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleConnectDevice(device.id)}
                      >
                        Connect
                      </button>
                    )}
                    <button className="btn btn-outline">Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Scheduling component
  const Scheduling = () => {
    return (
      <div className="section-container">
        <h2 className="section-title">Device Scheduling</h2>
        
        <div className="section-content">
          <div className="card schedule-card">
            <h3 className="card-title">Create New Schedule</h3>
            <form onSubmit={handleAddSchedule}>
              <div className="form-group animated">
                <label htmlFor="deviceSelect">Select Device</label>
                <div className="select-with-icon">
                  <span className="input-icon">📱</span>
                  <select
                    id="deviceSelect"
                    value={newSchedule.deviceId}
                    onChange={(e) => setNewSchedule({ ...newSchedule, deviceId: e.target.value })}
                    required
                  >
                    <option value="">-- Select Device --</option>
                    {[...registeredDevices, ...bleDevices].map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name} ({device.address || device.identifier})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="time-inputs">
                <div className="form-group animated">
                  <label htmlFor="startTime">Start Time</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🕒</span>
                    <input
                      id="startTime"
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group animated">
                  <label htmlFor="endTime">End Time</label>
                  <div className="input-with-icon">
                    <span className="input-icon">🕘</span>
                    <input
                      id="endTime"
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Active Days</label>
                <div className="days-selector">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`day-button ${newSchedule.days.includes(day) ? 'selected' : ''}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block">
                <span className="btn-icon">📅</span>
                Create Schedule
              </button>
            </form>
          </div>
          
          <div className="card schedule-card">
            <h3 className="card-title">Active Schedules</h3>
            
            {schedules.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <div className="empty-message">No schedules created yet</div>
                <div className="empty-action">Create your first schedule to automate your devices</div>
              </div>
            ) : (
              <div className="schedules-list">
                {schedules.map(schedule => {
                  const device = [...registeredDevices, ...bleDevices].find(d => d.id === parseInt(schedule.deviceId));
                  return (
                    <div key={schedule.id} className="schedule-item">
                      <div className="schedule-header">
                        <h4 className="schedule-device">{device ? device.name : 'Unknown Device'}</h4>
                        <div className="schedule-actions">
                          <button className="schedule-action edit" onClick={() => {
                            showToast('Editing schedule...');
                          }}>
                            Edit
                          </button>
                          <button className="schedule-action delete" onClick={() => {
                            setSchedules(schedules.filter(s => s.id !== schedule.id));
                            showToast('Schedule deleted');
                            addActivityLogEntry('Device schedule was deleted');
                          }}>
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="schedule-time">
                        <span className="time-icon">🕒</span>
                        <span className="time-range">{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                      
                      <div className="schedule-days">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <span 
                            key={day} 
                            className={`day-indicator ${schedule.days.includes(day) ? 'active' : 'inactive'}`}
                          >
                            {day[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // ESP32 Status component
  const ESP32Status = () => {
    return (
      <div className="section-container">
        <h2 className="section-title">ESP32 Mesh Network</h2>
        
        <div className="card esp32-card">
          <div className="card-header">
            <h3 className="card-title">Network Nodes</h3>
            <button className="refresh-button" onClick={() => {
              showToast('Refreshing node status...');
              addActivityLogEntry('Manual refresh of node status');
              
              // Simulate refresh
              setTimeout(() => {
                showToast('Node status updated');
              }, 1000);
            }}>
              <span className="refresh-icon">🔄</span>
              Refresh
            </button>
          </div>
          
          <div className="mesh-visualization">
            <div className="mesh-chart">
              <div className="root-node">
                <span className="node-icon">📶</span>
                <span className="node-name">Root</span>
              </div>
              <div className="mesh-connections">
                {esp32Devices.filter(d => d.id !== 1).map((device, index) => (
                  <div key={device.id} className={`mesh-connection ${device.status === 'offline' ? 'offline' : ''}`} style={{
                    transform: `rotate(${(index * 120) - 60}deg)`
                  }}>
                    <div className="connection-line"></div>
                    <div className="mesh-node">
                      <span className="node-icon">{device.status === 'online' ? '📶' : '❌'}</span>
                      <span className="node-name">{device.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="esp32-device-list">
            {esp32Devices.map(device => (
              <div key={device.id} className="esp32-device">
                <div className="device-main-info">
                  <div className="device-header">
                    <h4 className="device-name">{device.name}</h4>
                    <span className={`status-badge ${device.status === 'online' ? 'online' : 'offline'}`}>
                      {device.status}
                    </span>
                  </div>
                  <div className="device-last-seen">
                    Last seen: {new Date(device.lastSeen).toLocaleString()}
                  </div>
                </div>
                
                {device.status === 'online' && (
                  <div className="device-metrics">
                    <div className="metric">
                      <div className="metric-label">CPU</div>
                      <div className="metric-progress">
                        <div className="progress-bar" style={{ width: `${device.cpuLoad}%` }}></div>
                        <span className="metric-value">{device.cpuLoad}%</span>
                      </div>
                    </div>
                    
                    <div className="metric">
                      <div className="metric-label">Memory</div>
                      <div className="metric-progress">
                        <div className="progress-bar" style={{ width: `${device.memoryUsage}%` }}></div>
                        <span className="metric-value">{device.memoryUsage}%</span>
                      </div>
                    </div>
                    
                    <div className="metric">
                      <div className="metric-label">Uptime</div>
                      <div className="metric-value">{device.uptime} hours</div>
                    </div>
                  </div>
                )}
                
                <div className="device-actions">
                  <button className="btn btn-outline" onClick={() => {
                    if (device.status === 'offline') {
                      showToast(`Attempting to restart ${device.name}...`);
                      addActivityLogEntry(`Restart attempt for ${device.name}`);
                      
                      // Simulate restart
                      setTimeout(() => {
                        setEsp32Devices(prev => 
                          prev.map(d => 
                            d.id === device.id 
                              ? {...d, status: 'online', lastSeen: new Date().toISOString()} 
                              : d
                          )
                        );
                        showToast(`${device.name} is now online!`);
                        addActivityLogEntry(`${device.name} is back online`);
                      }, 3000);
                    } else {
                      showToast(`Diagnostic data for ${device.name} requested`);
                    }
                  }}>
                    {device.status === 'offline' ? 'Restart' : 'Diagnostics'}
                  </button>
                  <button className="btn btn-outline">Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Network Map
  const NetworkMap = () => {
    return (
      <div className="section-container">
        <h2 className="section-title">Network Map</h2>
        
        <div className="card map-card">
          <div className="card-header">
            <h3 className="card-title">Device Location & Connectivity</h3>
            <div className="map-controls">
              <button className="btn btn-text" onClick={() => {
                showToast('Map refreshed');
              }}>
                <span className="btn-icon">🔄</span>
                Refresh
              </button>
              <button className="btn btn-text" onClick={() => {
                setShowMap(!showMap);
                showToast(showMap ? 'Switched to list view' : 'Switched to map view');
              }}>
                <span className="btn-icon">{showMap ? '📋' : '🗺️'}</span>
                {showMap ? 'List View' : 'Map View'}
              </button>
            </div>
          </div>
          
          {showMap ? (
            <div className="network-map">
              <div className="map-container">
                <svg width="100%" height="400" viewBox="0 0 400 400">
                  {/* Connection lines */}
                  {mapNodes.filter(node => !node.isOffline).map(node => (
                    <line 
                      key={`line-${node.id}`}
                      x1="150" 
                      y1="80" 
                      x2={node.x} 
                      y2={node.y}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={node.type === 'meshNode' ? "5,5" : ""}
                    />
                  ))}
                  
                  {/* Nodes */}
                  {mapNodes.map(node => {
                    const device = esp32Devices.find(d => d.id === node.deviceId);
                    return (
                      <g key={node.id}>
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r="15"
                          fill={node.isOffline ? "#fee2e2" : node.type === 'rootNode' ? "#d1fae5" : "#dbeafe"}
                          stroke={node.isOffline ? "#b91c1c" : node.type === 'rootNode' ? "#065f46" : "#1e40af"}
                          strokeWidth="2"
                        />
                        <text 
                          x={node.x} 
                          y={node.y}
                          textAnchor="middle" 
                          dominantBaseline="central"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {node.deviceId}
                        </text>
                        <text 
                          x={node.x} 
                          y={node.y + 30}
                          textAnchor="middle" 
                          fontSize="12"
                        >
                          {device ? device.name : 'Unknown'}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-marker root"></div>
                  <div className="legend-label">Root Node</div>
                </div>
                <div className="legend-item">
                  <div className="legend-marker mesh"></div>
                  <div className="legend-label">Mesh Node</div>
                </div>
                <div className="legend-item">
                  <div className="legend-marker offline"></div>
                  <div className="legend-label">Offline Node</div>
                </div>
              </div>
            </div>
          ) : (
            <table className="network-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Last Seen</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {esp32Devices.map(device => (
                  <tr key={device.id} className={device.status === 'offline' ? 'inactive-row' : ''}>
                    <td>{device.id}</td>
                    <td>{device.name}</td>
                    <td>{device.id === 1 ? 'Root Node' : 'Mesh Node'}</td>
                    <td>
                      <span className={`table-status ${device.status}`}>
                        {device.status}
                      </span>
                    </td>
                    <td>{new Date(device.lastSeen).toLocaleString()}</td>
                    <td>
                      <button className="table-action" onClick={() => {
                        showToast(`Details for ${device.name}`);
                      }}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  // Render the appropriate page based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'devices':
        return <DeviceRegistration />;
      case 'ble':
        return <BLEMonitoring />;
      case 'scheduling':
        return <Scheduling />;
      case 'esp32':
        return <ESP32Status />;
      case 'map':
        return <NetworkMap />;
      default:
        return <Dashboard />;
    }
  };

  // App structure
  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <ToastNotification />
      <Navigation />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;