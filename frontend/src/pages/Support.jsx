import React, { useState } from 'react';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create mailto link
    const mailtoLink = `mailto:abhishekgiri1978@gmail.com?subject=Support: ${formData.subject}&body=Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    alert('Opening your email client to send the message!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modern-support-page">
      <div className="modern-support-container">
        <div className="modern-support-header">
          <div className="support-icon">🛠️</div>
          <h1>Support Center</h1>
          <p>Need help? We're here to assist you with any questions or issues</p>
        </div>

        <div className="modern-support-grid">
          <div className="modern-faq-card">
            <div className="card-icon">❓</div>
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-list">
              <div className="modern-faq-item">
                <h3>How do I create a multiplayer room?</h3>
                <p>Go to Multiplayer mode, click "Create Room", set your preferences, and share the room code with friends.</p>
              </div>

              <div className="modern-faq-item">
                <h3>Why can't I join a room?</h3>
                <p>Check if the room code is correct and the room isn't full (max 4 players). The room might also be in an active game.</p>
              </div>

              <div className="modern-faq-item">
                <h3>How does the AI difficulty work?</h3>
                <p>AI adapts based on your performance. It becomes more challenging as you improve your guessing skills.</p>
              </div>

              <div className="modern-faq-item">
                <h3>Can I play without creating an account?</h3>
                <p>You need an account to save progress, access leaderboards, and play multiplayer games.</p>
              </div>

              <div className="modern-faq-item">
                <h3>How are leaderboard rankings calculated?</h3>
                <p>Rankings are based on total points, win rate, average guesses per game, and recent performance.</p>
              </div>
            </div>
          </div>

          <div className="modern-contact-card">
            <div className="card-icon">📧</div>
            <h2>Contact Support</h2>
            <form onSubmit={handleSubmit} className="modern-support-form">
              <div className="modern-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modern-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modern-form-group">
                <label>Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Gameplay Question">Gameplay Question</option>
                  <option value="Account Problem">Account Problem</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modern-form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your issue or question in detail..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="modern-submit-btn">
                Send Message
              </button>
            </form>
          </div>

          <div className="modern-info-cards">
            <div className="modern-info-card">
              <div className="info-icon">🕐</div>
              <h3>Response Time</h3>
              <p>We typically respond within 24 hours during business days</p>
            </div>
            <div className="modern-info-card">
              <div className="info-icon">🌐</div>
              <h3>Community</h3>
              <p>Join our community for tips, tricks, and player discussions</p>
            </div>
            <div className="modern-info-card">
              <div className="info-icon">📱</div>
              <h3>Social Media</h3>
              <p>Follow us for updates, announcements, and gaming news</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;