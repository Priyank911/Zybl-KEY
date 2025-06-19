import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenAddress } from '../utils/coinbaseAuthUtils';
import { getPaymentHistory, getLatestRevenueSplit } from '../services/paymentService';
import RevenueSplitChart from '../components/RevenueSplitChart';
import ActivityFeed from '../components/ActivityFeed';
import NFTPassport from '../components/NFTPassport';
import StatsCard, { StatsIcons } from '../components/StatsCard';
import '../styles/Dashboard.css';
import '../styles/Dashboard-modern.css'; // New modern styles
import '../styles/chain-indicators.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [payments, setPayments] = useState([]);
  const [revenueSplit, setRevenueSplit] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
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
        
        // If user has verification status, use it, otherwise use sample data
        if (parsedData.verificationStatus) {
          verificationStatus.status = parsedData.verificationStatus.status;
          verificationStatus.score = parsedData.verificationStatus.score;
          verificationStatus.lastVerified = new Date(parsedData.verificationStatus.lastVerified).toLocaleDateString();
        }
        
        setIsLoading(false);
        
        // Load payment history and revenue split
        loadDashboardData(parsedData.address);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem('zybl_user_data');
        navigate('/signin');
      }
    };
    
    checkAuth();
  }, [navigate]);
    // Load payment history and revenue split data
  const loadDashboardData = async (walletAddress) => {
    setIsLoadingData(true);
    try {
      // Get payment history
      const paymentHistory = await getPaymentHistory(walletAddress);
      setPayments(paymentHistory || []);
      
      // Get latest revenue split
      const latestSplit = await getLatestRevenueSplit(walletAddress);
      setRevenueSplit(latestSplit);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // In a real app, you'd show an error message to the user
      // For demo, we'll set empty data
      setPayments([]);
      setRevenueSplit(null);
    } finally {
      setIsLoadingData(false);
    }
  };

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
          </a>          <a 
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
            className={`nav-item ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Revenue Split
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
          <div className="dashboard-main modern">
            <div className="dashboard-grid">
              <div className="dashboard-column main-column">
                {/* Stats Cards Row */}                <div className="stats-cards-container">
                  <StatsCard 
                    title="Verification Score" 
                    value={`${verificationStatus.score}%`} 
                    change={15} 
                    icon={StatsIcons.verification} 
                    color="green" 
                  />
                  <StatsCard 
                    title="Total Payments" 
                    value={payments.length || 5} 
                    change={100} 
                    icon={StatsIcons.payments} 
                    color="blue" 
                  />
                  <StatsCard 
                    title="Last Verified" 
                    value="20/6/2025" 
                    icon={StatsIcons.activity} 
                    color="purple" 
                  />
                </div>
                
                {/* Wallet Card */}
                <div className="dashboard-card wallet-card modern-card">
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
                
                {/* Payments Card */}
                <div className="dashboard-card payments-card modern-card">
                  <div className="card-header">
                    <h2>Payment History</h2>
                  </div>
                  <div className="card-content">
                    {isLoadingData ? (
                      <div className="loading-data">
                        <div className="loading-spinner small"></div>
                        <p>Loading payment history...</p>
                      </div>
                    ) : payments.length > 0 ? (
                      <div className="payment-history">
                        <table className="payment-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Transaction ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map(payment => (
                              <tr key={payment.id}>
                                <td>{new Date(payment.timestamp).toLocaleDateString()}</td>
                                <td>
                                  <div className="amount-cell">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="12" cy="12" r="11" fill="#2775CA" stroke="#FFFFFF" strokeWidth="1"/>
                                      <path d="M16.95 10.8C16.95 10.2.5 9.5 9.6 9.5 8.75 6.5 12 6.5 12 6.5C8.35 6.5 5.4 9.45 5.4 13.1C5.4 16.75 8.35 19.7 12 19.7C15.65 19.7 18.6 16.75 18.6 13.1C18.6 12.3 18.45 11.55 18.15 10.8H16.95ZM13.2 15.8V17H10.8V15.8H9.6V13.4H14.4V15.8H13.2ZM13.2 12.2H10.8V11H13.2V12.2ZM14.4 9.8H9.6V8.4H10.8V7.2H13.2V8.4H14.4V9.8Z" fill="white"/>
                                    </svg>
                                    <span>{payment.amount} {payment.currency}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className={`status-pill ${payment.status}`}>
                                    {payment.status}
                                  </span>
                                </td>
                                <td className="transaction-id">
                                  {payment.transactionId.substring(0, 8)}...
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="no-payments">
                        <p>No payment history available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right sidebar column */}              <div className="dashboard-column side-column">
                {/* NFT Passport Card */}
                <div className="dashboard-card nft-card modern-card">
                  <div className="card-header">
                    <h2>Zybl Passport NFT</h2>
                  </div>
                  <div className="card-content">
                    <NFTPassport userData={userData} />
                  </div>
                </div>
                
                {/* Activity Feed */}
                <div className="dashboard-card activity-card modern-card">
                  <div className="card-header">
                    <h2>Recent Activity</h2>
                    <span className="activity-badge">3</span>
                  </div>
                  <div className="card-content">
                    <ActivityFeed />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Revenue Split Card - Full Width */}
            {revenueSplit && (
              <div className="dashboard-card revenue-card modern-card full-width">
                <div className="card-header">
                  <h2>Revenue Split Overview</h2>
                </div>
                <div className="card-content">
                  <div className="revenue-chart">
                    <RevenueSplitChart data={revenueSplit} />
                  </div>
                  <div className="revenue-info">
                    <div className="info-item">
                      <span className="info-label">Total Amount</span>
                      <span className="info-value">{revenueSplit.totalAmount} USDC</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Distribution Date</span>
                      <span className="info-value">{new Date(revenueSplit.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
          {activeTab === 'verification' && (
          <div className="dashboard-main modern">
            <div className="dashboard-grid">
              <div className="dashboard-column main-column">
                {/* Verification Status Card */}                <div className="dashboard-card verification-card modern-card">
                  <div className="card-header">
                    <h2>Verification Status</h2>
                  </div>
                  <div className="card-content">
                    <div className="verification-status-container">
                      <div className="verification-score-circle">
                        <svg viewBox="0 0 100 100">
                          <circle className="score-bg" cx="50" cy="50" r="45"></circle>
                          <circle className="score-fill" cx="50" cy="50" r="45" 
                            style={{strokeDashoffset: `${(100 - verificationStatus.score) * 2.83}`}}></circle>
                        </svg>
                        <div className="score-value">{verificationStatus.score}%</div>
                      </div>
                      <div className="verification-details">
                        <div className="detail-item">
                          <span className="detail-label">Status</span>
                          <span className="status-pill verified">{verificationStatus.status}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Last Verified</span>
                          <span className="detail-value">{verificationStatus.lastVerified}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Verification Level</span>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: `${verificationStatus.score}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Verification Methods Card */}
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Verification Methods</h2>
                  </div>
                  <div className="card-content">
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
                          <div className="method-status verified">Verified</div>
                          <div className="method-description">Your biometric verification is active and up to date</div>
                        </div>
                        <button className="method-button">Manage</button>
                      </div>
                      
                      <div className="verification-method">
                        <div className="method-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B'}}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 9H9V15H15V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="method-details">
                          <div className="method-name">Two-Factor Authentication</div>
                          <div className="method-status" style={{background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B'}}>Optional</div>
                          <div className="method-description">Add an extra layer of security with 2FA</div>
                        </div>
                        <button className="method-button">Setup</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right sidebar column */}              <div className="dashboard-column side-column">
                {/* Activity Feed */}
                <div className="dashboard-card activity-card modern-card">
                  <div className="card-header">
                    <h2>Verification History</h2>
                  </div>
                  <div className="card-content">
                    <div className="feed-content">
                      <div className="feed-items">
                        <div className="feed-item verification">
                          <div className="activity-icon verification">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="activity-content">
                            <div className="activity-header">
                              <h4>Wallet Verification</h4>
                              <span className="activity-time">yesterday</span>
                            </div>
                            <p className="activity-description">Successfully verified wallet ownership through message signing</p>
                          </div>
                        </div>
                        
                        <div className="feed-item verification">
                          <div className="activity-icon verification">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="activity-content">
                            <div className="activity-header">
                              <h4>Biometric Verification</h4>
                              <span className="activity-time">3 days ago</span>
                            </div>
                            <p className="activity-description">Completed biometric verification process</p>
                          </div>
                        </div>
                        
                        <div className="feed-item wallet">
                          <div className="activity-icon wallet">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M3 10H21" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="activity-content">
                            <div className="activity-header">
                              <h4>Wallet Connected</h4>
                              <span className="activity-time">5 days ago</span>
                            </div>
                            <p className="activity-description">Connected wallet for verification process</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tips Card */}
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Verification Tips</h2>
                  </div>
                  <div className="card-content">
                    <div className="tips-list">
                      <div className="tip-item">
                        <div className="tip-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 16V12" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8H12.01" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="tip-content">
                          <h4>Keep Connected</h4>
                          <p>Ensure your wallet stays connected to maintain your verification status</p>
                        </div>
                      </div>
                      <div className="tip-item">
                        <div className="tip-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 16V12" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8H12.01" stroke="#0052FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="tip-content">
                          <h4>Re-verify Regularly</h4>
                          <p>Refresh your verification status every 30 days for optimal security</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'revenue' && (
          <div className="dashboard-main modern">
            <div className="dashboard-grid">
              <div className="dashboard-column main-column">
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Revenue Split Details</h2>
                  </div>
                  <div className="card-content">
                    {isLoadingData ? (
                      <div className="loading-data">
                        <div className="loading-spinner small"></div>
                        <p>Loading revenue data...</p>
                      </div>
                    ) : revenueSplit ? (
                      <div className="revenue-details">
                        <div className="revenue-chart-container">
                          <h3>Distribution Overview</h3>
                          <RevenueSplitChart data={revenueSplit} />
                          
                          <div className="revenue-legend">
                            <div className="legend-item">
                              <div className="legend-color" style={{background: 'rgba(0, 82, 255, 0.8)'}}></div>
                              <div className="legend-label">User Treasury (40%)</div>
                            </div>
                            <div className="legend-item">
                              <div className="legend-color" style={{background: 'rgba(26, 201, 100, 0.8)'}}></div>
                              <div className="legend-label">Protocol (25%)</div>
                            </div>
                            <div className="legend-item">
                              <div className="legend-color" style={{background: 'rgba(124, 58, 237, 0.8)'}}></div>
                              <div className="legend-label">Validators (20%)</div>
                            </div>
                            <div className="legend-item">
                              <div className="legend-color" style={{background: 'rgba(245, 158, 11, 0.8)'}}></div>
                              <div className="legend-label">Community (15%)</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="revenue-details-section">
                          <h3>Payment Information</h3>
                          <div className="revenue-info-grid">
                            <div className="info-block">
                              <span className="info-label">Total Amount</span>
                              <span className="info-value primary">{revenueSplit.totalAmount} USDC</span>
                            </div>
                            <div className="info-block">
                              <span className="info-label">Transaction ID</span>
                              <span className="info-value detail-value address">{shortenAddress(revenueSplit.transactionId)}</span>
                            </div>
                            <div className="info-block">
                              <span className="info-label">Date</span>
                              <span className="info-value">{new Date(revenueSplit.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="info-block">
                              <span className="info-label">Wallet</span>
                              <span className="info-value detail-value address">{shortenAddress(revenueSplit.walletAddress)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="revenue-details-section">
                          <h3>Split Breakdown</h3>
                          <div className="split-table-container">
                            <table className="split-table">
                              <thead>
                                <tr>
                                  <th>Recipient</th>
                                  <th>Percentage</th>
                                  <th>Amount (USDC)</th>
                                  <th>Wallet Address</th>
                                </tr>
                              </thead>
                              <tbody>
                                {revenueSplit.splits.map((split, index) => (
                                  <tr key={index}>
                                    <td>{split.recipient}</td>
                                    <td>
                                      <div className="percentage-bar">
                                        <div className="percentage-fill" style={{
                                          width: `${split.percentage}%`,
                                          background: index === 0 ? 'var(--primary-color)' : 
                                                     index === 1 ? 'var(--secondary-color)' : 
                                                     index === 2 ? 'var(--accent-color)' : 'var(--warning-color)'
                                        }}></div>
                                        <span>{split.percentage}%</span>
                                      </div>
                                    </td>
                                    <td>{split.amount.toFixed(2)}</td>
                                    <td className="address">{shortenAddress(split.walletAddress)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="no-revenue-data">
                        <div className="empty-state">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 20V10" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 20V4" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 20V14" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <h3>No Revenue Split Data Available</h3>
                          <p>Complete the verification and payment process to see your revenue split details.</p>
                          <button 
                            className="dashboard-button primary"
                            onClick={() => navigate('/verification')}
                          >
                            Start Verification
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="dashboard-column side-column">
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Revenue Split Explanation</h2>
                  </div>
                  <div className="card-content">
                    <div className="explanation-content">
                      <p>Your payment is distributed to support the ecosystem in the following ways:</p>
                      <ul>
                        <li><strong>User Treasury (40%):</strong> Allocated to a treasury controlled by verified users, supporting governance and community initiatives.</li>
                        <li><strong>Protocol (25%):</strong> Supports ongoing development, maintenance, and security of the Zybl platform.</li>
                        <li><strong>Validators (20%):</strong> Rewards the network validators who secure the verification process.</li>
                        <li><strong>Community (15%):</strong> Funds community growth, education, and ecosystem development.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Recent Transactions</h2>
                  </div>
                  <div className="card-content">
                    {payments && payments.length > 0 ? (
                      <div className="mini-transactions">
                        {payments.slice(0, 3).map((payment, index) => (
                          <div key={index} className="mini-transaction-item">
                            <div className="transaction-icon payment">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14.31 8L20.05 17.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9.69 8H21.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7.38 12.0001L13.12 2.06006" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9.69 16.0001L3.95 6.06006" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14.31 16H2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16.62 12L10.88 21.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="transaction-content">
                              <div className="transaction-top">
                                <span className="transaction-amount">{payment.amount} {payment.currency}</span>
                                <span className="transaction-date">{new Date(payment.timestamp).toLocaleDateString()}</span>
                              </div>
                              <div className="transaction-bottom">
                                <span className="transaction-id">{shortenAddress(payment.transactionId)}</span>
                                <span className={`status-pill ${payment.status}`}>{payment.status}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-activity">
                        <p>No transactions to display</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="dashboard-main modern">
            <div className="dashboard-grid">
              <div className="dashboard-column main-column">
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Profile Settings</h2>
                  </div>
                  <div className="card-content">
                    <div className="settings-form">
                      <div className="form-group">
                        <label>Display Name</label>
                        <input type="text" placeholder="Enter display name" className="modern-input" />
                      </div>
                      <div className="form-group">
                        <label>Email (Optional)</label>
                        <input type="email" placeholder="Enter email for notifications" className="modern-input" />
                      </div>
                      <div className="form-group">
                        <label>Bio</label>
                        <textarea placeholder="A short bio about yourself" className="modern-textarea" rows="3"></textarea>
                      </div>
                      <button className="settings-button">Save Changes</button>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Privacy Settings</h2>
                  </div>
                  <div className="card-content">
                    <div className="settings-toggles">
                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-label">Share verification status with applications</div>
                          <div className="toggle-description">Allow third-party applications to view your verification status</div>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-label">Allow applications to view your wallet address</div>
                          <div className="toggle-description">Applications can see your connected wallet address</div>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-label">Receive email notifications</div>
                          <div className="toggle-description">Get important updates about your account via email</div>
                        </div>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>
                      </div>
                      
                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-label">Share anonymized data for platform improvement</div>
                          <div className="toggle-description">Help us improve by sharing anonymous usage statistics</div>
                        </div>
                        <label className="switch">
                          <input type="checkbox" checked />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-column side-column">
                <div className="dashboard-card modern-card">
                  <div className="card-header">
                    <h2>Wallet Settings</h2>
                  </div>
                  <div className="card-content">
                    <div className="connected-wallet">
                      <div className="wallet-icon coinbase-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                          <path d="M12 6.80005C9.20067 6.80005 6.92 9.07738 6.92 11.8734C6.92 14.6694 9.20067 16.9467 12 16.9467C14.7993 16.9467 17.08 14.6694 17.08 11.8734C17.08 9.07738 14.7993 6.80005 12 6.80005ZM12 14.5601C10.5206 14.5601 9.32 13.3621 9.32 11.8867C9.32 10.4114 10.5206 9.21338 12 9.21338C13.4794 9.21338 14.68 10.4114 14.68 11.8867C14.68 13.3621 13.4794 14.5601 12 14.5601Z" fill="white"/>
                        </svg>
                      </div>
                      <div className="wallet-details">
                        <div className="wallet-name">Coinbase Wallet</div>
                        <div className="wallet-address">{userData.address}</div>
                        <div className="connection-details">
                          <span>Connected {new Date(userData.lastSignIn).toLocaleDateString()}</span>
                          <span className="chain-name">
                            {userData.chainId === 1 ? 'Ethereum Mainnet' : 
                             userData.chainId === 137 ? 'Polygon Mainnet' : 
                             `Chain ID: ${userData.chainId}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="wallet-actions">
                      <button className="wallet-action-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20.49 9C19.2214 6.52323 16.9593 4.7266 14.225 4.14178C11.4907 3.55695 8.64975 4.23442 6.39344 5.90385C4.13713 7.57328 2.70656 10.0749 2.43787 12.8334C2.16918 15.5919 3.09436 18.3381 4.95 20.39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19.05 3.61001L23 4.00001L22.3 7.80001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4.95 20.39L1 20L1.7 16.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Change Wallet
                      </button>
                      <button className="wallet-action-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Manage Networks
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-card modern-card danger-zone-card">
                  <div className="card-header">
                    <h2>Danger Zone</h2>
                  </div>
                  <div className="card-content">
                    <div className="danger-zone">
                      <div className="danger-action">
                        <div className="danger-info">
                          <h4>Reset Verification Status</h4>
                          <p>Clear all verification data and start the verification process again</p>
                        </div>
                        <button className="danger-button">Reset</button>
                      </div>
                      
                      <div className="danger-action">
                        <div className="danger-info">
                          <h4>Disconnect Wallet</h4>
                          <p>Remove your wallet connection and log out from Zybl Passport</p>
                        </div>
                        <button className="danger-button">Disconnect</button>
                      </div>
                      
                      <div className="danger-action">
                        <div className="danger-info">
                          <h4>Delete Account Data</h4>
                          <p>Permanently delete all your account data from Zybl Passport</p>
                        </div>
                        <button className="danger-button">Delete</button>
                      </div>
                    </div>
                  </div>
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
