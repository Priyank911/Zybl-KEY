import React, { useState, useEffect } from 'react';
import '../styles/Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: "Alex Rodriguez",
    position: "CTO at BlockChainX",
    quote: "Zybl has transformed how we approach security in our DeFi platform. Their Sybil-resistance layer is unmatched in the market, providing us with peace of mind and our users with a safer experience.",
    avatar: "AR"
  },
  {
    id: 2,
    name: "Sophia Chen",
    position: "Security Lead at MetaDAO",
    quote: "We've reduced fraudulent accounts by 98% since implementing Zybl's solution. The intuitive dashboard and real-time alerts allow us to respond to threats immediately.",
    avatar: "SC"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    position: "Founder of CryptoSecure",
    quote: "As someone who's worked in blockchain security for years, I can confidently say that Zybl offers the most comprehensive Sybil-resistance solution I've encountered. It's now an essential part of our security stack.",
    avatar: "MJ"
  },
  {
    id: 4,
    name: "Elena Petrova",
    position: "Product Manager at ChainGuard",
    quote: "The implementation process was seamless, and the results were immediate. Zybl's team was responsive and helped us customize the solution for our specific needs.",
    avatar: "EP"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Clients Say</h2>
          <p className="testimonials-subtitle">
            Trusted by leading blockchain projects and Web3 innovators
          </p>
        </div>

        <div className="testimonials-carousel">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
              style={{ transform: `translateX(${(index - activeIndex) * 100}%)` }}
            >
              <div className="testimonial-content">
                <div className="quote-mark">"</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-position">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        <div className="testimonial-cta">
          <p>Ready to secure your Web3 project like these companies?</p>
          <a href="/demo" className="testimonial-cta-button">Schedule a Demo</a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
