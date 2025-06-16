import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from '../utils/coinbaseAuthUtils';
import '../styles/Dashboard.css';
import '../styles/chain-indicators.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sample data for dashboard display
  const verificationStatus = {
    status: 'Verified',
    score: 95,
    lastVerified: new Date().toLocaleDateString(),
  };

  useEffect(() => {
    // Check authentication from localStorage
    const checkAuth = () => {
      const storedData = localStorage.getItem('zybl_user_data');
      if (!storedData) {
        // Not authenticated, redirect to signin
        navigate('/signin');
        return;
      }
      
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        setIsLoading(false);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem('zybl_user_data');
        navigate('/signin');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('zybl_user_data');
    navigate('/signin');
  };

  // If still checking authentication, show loading
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not signed in, show authentication required
  if (!userData) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-error">
          <h2>Authentication Required</h2>
          <p>Please sign in to access your dashboard.</p>
          <button 
            className="dashboard-button primary"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="dashboard-logo">
          <img src="/src/assets/Logo.png" alt="Zybl Logo" />
          <span>Zybl Passport</span>
        </div>
        
        <nav className="dashboard-nav">
          <a 
            href="#" 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </a>
          <a 
            href="#" 
            className={`nav-item ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Verification
          </a>
          <a 
            href="#" 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Settings
          </a>
        </nav>
        
        <div className="dashboard-user">
          <div className="user-wallet">
            <div className="coinbase-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                <path d="M12 6.80005C9.20067 6.80005 6.92 9.07738 6.92 11.8734C6.92 14.6694 9.20067 16.9467 12 16.9467C14.7993 16.9467 17.08 14.6694 17.08 11.8734C17.08 9.07738 14.7993 6.80005 12 6.80005ZM12 14.5601C10.5206 14.5601 9.32 13.3621 9.32 11.8867C9.32 10.4114 10.5206 9.21338 12 9.21338C13.4794 9.21338 14.68 10.4114 14.68 11.8867C14.68 13.3621 13.4794 14.5601 12 14.5601Z" fill="white"/>
              </svg>
            </div>
            <div className="user-info">
              <span className="user-address">{userData.shortenedAddress || shortenAddress(userData.address)}</span>
              <span className="connection-info">Connected with Coinbase Wallet</span>
            </div>
          </div>
          <button 
            className="signout-button"
            onClick={handleSignOut}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to Zybl Passport</h1>
          <p>Your secure gateway to Sybil-resistant applications</p>
        </div>

        {activeTab === 'dashboard' && (
          <div className="dashboard-main">
            <div className="dashboard-card wallet-card">
              <div className="card-header">
                <h2>Your Wallet</h2>
              </div>
              <div className="card-content">
                <div className="wallet-details">
                  <div className="wallet-detail">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{userData.address}</span>
                  </div>
                  <div className="wallet-detail">
                    <span className="detail-label">Connected With</span>
                    <div className="detail-value with-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                        <path d="M12 6.80005C9.20067 6.80005 6.92 9.07738 6.92 11.8734C6.92 14.6694 9.20067 16.9467 12 16.9467C14.7993 16.9467 17.08 14.6694 17.08 11.8734C17.08 9.07738 14.7993 6.80005 12 6.80005ZM12 14.5601C10.5206 14.5601 9.32 13.3621 9.32 11.8867C9.32 10.4114 10.5206 9.21338 12 9.21338C13.4794 9.21338 14.68 10.4114 14.68 11.8867C14.68 13.3621 13.4794 14.5601 12 14.5601Z" fill="white"/>
                      </svg>
                      Coinbase Wallet
                    </div>
                  </div>
                  <div className="wallet-detail">
                    <span className="detail-label">Network</span>
                    <span className="detail-value chain-badge">
                      {userData.chainId === 1 ? 'Ethereum Mainnet' : 
                       userData.chainId === 137 ? 'Polygon Mainnet' : 
                       `Chain ID: ${userData.chainId}`}
                    </span>
                  </div>
                  <div className="wallet-detail">
                    <span className="detail-label">Last Connected</span>
                    <span className="detail-value">{new Date(userData.lastSignIn).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card verification-card">
              <div className="card-header">
                <h2>Verification Status</h2>
              </div>
              <div className="card-content">
                <div className="verification-status">
                  <div className="status-badge verified">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {verificationStatus.status}
                  </div>
                  <div className="sybil-score">
                    <span className="score-label">Sybil Resistance Score</span>
                    <div className="score-value">{verificationStatus.score}</div>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${verificationStatus.score}%` }}></div>
                    </div>
                  </div>
                  <div className="verification-detail">
                    <span className="detail-label">Last Verified</span>
                    <span className="detail-value">{verificationStatus.lastVerified}</span>
                  </div>
                  <div className="verification-detail">
                    <span className="detail-label">Wallet</span>
                    <div className="detail-value with-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                        <path d="M12 6.80005C9.20067 6.80005 6.92 9.07738 6.92 11.8734C6.92 14.6694 9.20067 16.9467 12 16.9467C14.7993 16.9467 17.08 14.6694 17.08 11.8734C17.08 9.07738 14.7993 6.80005 12 6.80005ZM12 14.5601C10.5206 14.5601 9.32 13.3621 9.32 11.8867C9.32 10.4114 10.5206 9.21338 12 9.21338C13.4794 9.21338 14.68 10.4114 14.68 11.8867C14.68 13.3621 13.4794 14.5601 12 14.5601Z" fill="white"/>
                      </svg>
                      Coinbase Wallet Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card apps-card">
              <div className="card-header">
                <h2>Compatible Applications</h2>
              </div>
              <div className="card-content">
                <div className="app-list">
                  <div className="app-item">
                    <div className="app-icon coinbase-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                        <path d="M12 6.80005C9.20067 6.80005 6.92 9.07738 6.92 11.8734C6.92 14.6694 9.20067 16.9467 12 16.9467C14.7993 16.9467 17.08 14.6694 17.08 11.8734C17.08 9.07738 14.7993 6.80005 12 6.80005ZM12 14.5601C10.5206 14.5601 9.32 13.3621 9.32 11.8867C9.32 10.4114 10.5206 9.21338 12 9.21338C13.4794 9.21338 14.68 10.4114 14.68 11.8867C14.68 13.3621 13.4794 14.5601 12 14.5601Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="app-details">
                      <div className="app-name">Coinbase Base Chain</div>
                      <div className="app-description">Access Coinbase's Base Chain with your verified identity</div>
                    </div>
                    <button className="app-button">Launch</button>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#6C5CE7"/>
                        <path d="M12 6L16 12L12 18L8 12L12 6Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="app-details">
                      <div className="app-name">Zybl Governance</div>
                      <div className="app-description">Participate in decentralized governance with your verified identity</div>
                    </div>
                    <button className="app-button">Launch</button>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#2ECE7D"/>
                        <path d="M17 9C17 12.866 13.866 16 10 16C6.13401 16 3 12.866 3 9C3 5.13401 6.13401 2 10 2C13.866 2 17 5.13401 17 9Z" fill="white"/>
                        <path d="M21 15C21 17.7614 18.7614 20 16 20C13.2386 20 11 17.7614 11 15C11 12.2386 13.2386 10 16 10C18.7614 10 21 12.2386 21 15Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="app-details">
                      <div className="app-name">DeFi Platform</div>
                      <div className="app-description">Access exclusive DeFi opportunities with Sybil protection</div>
                    </div>
                    <button className="app-button">Coming Soon</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'verification' && (
          <div className="dashboard-main">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Verification Settings</h2>
              </div>
              <div className="card-content">
                <p>Manage your verification settings and methods here.</p>
                <div className="verification-methods">
                  <div className="verification-method">
                    <div className="method-icon coinbase-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                        <path d="M12 6.80005C9.20067 6.80005 6.92 9.07738 6.92 11.8734C6.92 14.6694 9.20067 16.9467 12 16.9467C14.7993 16.9467 17.08 14.6694 17.08 11.8734C17.08 9.07738 14.7993 6.80005 12 6.80005ZM12 14.5601C10.5206 14.5601 9.32 13.3621 9.32 11.8867C9.32 10.4114 10.5206 9.21338 12 9.21338C13.4794 9.21338 14.68 10.4114 14.68 11.8867C14.68 13.3621 13.4794 14.5601 12 14.5601Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="method-details">
                      <div className="method-name">Coinbase Wallet Authentication</div>
                      <div className="method-status verified">Verified</div>
                      <div className="method-description">Your wallet has been verified through secure message signing</div>
                    </div>
                    <button className="method-button">Renew</button>
                  </div>
                  
                  <div className="verification-method">
                    <div className="method-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="#2ECE7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 4L12 14.01L9 11.01" stroke="#2ECE7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="method-details">
                      <div className="method-name">Biometric Verification</div>
                      <div className="method-status pending">Optional</div>
                      <div className="method-description">Add an extra layer of security with biometric verification</div>
                    </div>
                    <button className="method-button">Enable</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="dashboard-main">
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Account Settings</h2>
              </div>
              <div className="card-content">
                <p>Manage your account settings and preferences.</p>
                <div className="settings-section">
                  <h3>Profile Information</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label>Display Name</label>
                      <input type="text" placeholder="Enter display name" />
                    </div>
                    <div className="form-group">
                      <label>Email (Optional)</label>
                      <input type="email" placeholder="Enter email for notifications" />
                    </div>
                    <button className="settings-button">Save Changes</button>
                  </div>
                </div>
                
                <div className="settings-section">
                  <h3>Privacy Settings</h3>
                  <div className="settings-toggle">
                    <div className="toggle-label">Share verification status with applications</div>
                    <label className="switch">
                      <input type="checkbox" checked />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="settings-toggle">
                    <div className="toggle-label">Allow applications to view your wallet address</div>
                    <label className="switch">
                      <input type="checkbox" checked />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                
                <div className="settings-section danger-zone">
                  <h3>Danger Zone</h3>
                  <button className="danger-button">Reset Verification Status</button>
                  <button className="danger-button">Disconnect Wallet</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
