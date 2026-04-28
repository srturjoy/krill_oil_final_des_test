import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-brand">Antarctic Fish Krill Oil</div>
            <div className="footer-description">
                <p>অ্যান্টার্কটিক মাছের কৃল তেল আপনি স্বাস্থ্যের জন্য অপরিহার্য।</p>
            </div>
            <div className="footer-benefits">
                <h3>Benefits:</h3>
                <ul>
                    <li>Rich in Omega-3 fatty acids</li>
                    <li>Supports heart health</li>
                    <li>Promotes joint health</li>
                    <li>Boosts immune system</li>
                </ul>
            </div>
            <div className="footer-contact">
                <h3>Contact Us:</h3>
                <p>Email: info@antarcticfishkrilloil.com</p>
                <p>Phone: +1-800-123-4567</p>
            </div>
            <div className="footer-trust-badges">
                <img src="/assets/trust-badge-1.png" alt="Trust Badge 1" />
                <img src="/assets/trust-badge-2.png" alt="Trust Badge 2" />
            </div>
            <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Refund Policy</a>
            </div>
            <div className="footer-disclaimer">
                <p>Disclaimer: This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
            </div>
            <div className="footer-copyright">&copy; 2026 Antarctic Fish Krill Oil. All rights reserved.</div>
        </footer>
    );
};

export default Footer;