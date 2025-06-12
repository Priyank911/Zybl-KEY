import React, { useState } from 'react';
import '../styles/FAQ.css';

const faqItems = [
  {
    id: 1,
    question: "What is Sybil resistance, and why is it important for Web3?",
    answer: "Sybil resistance refers to a system's ability to prevent Sybil attacks, where a single entity creates multiple fake identities to gain disproportionate influence. In Web3, this is crucial for maintaining fair governance, preventing voting manipulation, and ensuring equitable distribution of resources. Zybl provides advanced Sybil resistance to protect the integrity of decentralized platforms."
  },
  {
    id: 2,
    question: "How does Zybl's solution work without compromising privacy?",
    answer: "Zybl uses a combination of zero-knowledge proofs, on-chain analysis, and behavioral patterns to verify unique human identities without requiring sensitive personal information. Our approach preserves privacy by design, allowing users to prove their uniqueness without revealing their actual identity. This maintains the pseudonymous nature of blockchain while preventing Sybil attacks."
  },
  {
    id: 3,
    question: "Can Zybl integrate with our existing blockchain infrastructure?",
    answer: "Yes, Zybl is designed to be blockchain-agnostic and can seamlessly integrate with existing infrastructure across various protocols including Ethereum, Solana, Polkadot, and others. Our solution provides flexible APIs and SDKs that make integration straightforward with minimal changes to your existing codebase."
  },
  {
    id: 4,
    question: "What kind of attacks can Zybl prevent?",
    answer: "Zybl can prevent various types of attacks including Sybil attacks (multiple fake identities), collusion attacks, bot-driven manipulation, and certain forms of MEV exploitation. Our system continuously monitors for suspicious patterns and provides real-time alerts when potential threats are detected."
  },
  {
    id: 5,
    question: "Do you offer custom solutions for different types of Web3 projects?",
    answer: "Absolutely. We understand that different projects have unique requirements, whether you're running a DAO, DeFi protocol, NFT marketplace, or game. Zybl offers customizable solutions tailored to your specific needs, with different tiers of service and features that can be adjusted based on your security requirements and user base."
  },
  {
    id: 6,
    question: "How quickly can we implement Zybl for our project?",
    answer: "Implementation typically takes 1-2 weeks depending on the complexity of your project and the level of customization required. Our team provides comprehensive onboarding support, documentation, and technical assistance throughout the process to ensure a smooth integration. For most standard implementations, you can be up and running within days."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Find answers to common questions about Zybl's Sybil-resistance solutions
          </p>
        </div>

        <div className="faq-accordion">
          {faqItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                {item.question}
                <span className="faq-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-more">
          <p>Have more questions? We're here to help.</p>
          <a href="/contact" className="faq-contact-button">Contact Us</a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
