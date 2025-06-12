import './App.css';
import Logo from './assets/Logo.png';

// Placeholder for the Ethereum icon (replace with actual image)
const EthereumIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L0 17.65L12 24L24 17.65L12 0ZM12 4.79L19.21 17.65L12 19.21L4.79 17.65L12 4.79Z" fill="#8EDCFF"/>
  </svg>
);

function App() {
  return (
    <div className="container">
      <div className="content">
        <div className="logo-container">
          <img src={Logo} alt="Zybl Logo" className="logo-image" />
          <span className="app-name">Zybl</span>
        </div>
        <h1 className="main-title">Unlock the best of web3</h1>
        <p className="tagline">
          Zybl is the next-gen Sybil-resistance layer for Web3.<br />
          <span className="highlight">Real people. Real proofs. Real revenue.</span>
        </p>
        <p className="description">
          Access a world of Web3 opportunities<br />securely with a single sign-in.
        </p>
        <div className="button-wrapper">
          <button className="sign-in-button">
            <img src={Logo} alt="Zybl Logo" className="button-logo" />
            Sign in to Zybl
          </button>
          <button className="about-button">
            About
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
