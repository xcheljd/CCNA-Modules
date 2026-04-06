import React from 'react';
import { Heart } from 'lucide-react';

function AboutTab() {
  return (
    <div className="settings-tab-content">
      <div className="about-section">
        <div className="about-header">
          <Heart className="about-icon" size={32} />
          <h3>Course Credit</h3>
        </div>

        <div className="about-content">
          <p className="about-intro">
            This application is built around the excellent <strong>CCNA 200-301 Complete Course</strong> created by <strong>Jeremy McDowell</strong> of Jeremy's IT Lab.
          </p>

          <div className="instructor-info">
            <h4>About the Instructor</h4>
            <p>
              Jeremy McDowell provides comprehensive, high-quality networking education through his YouTube channel and various platforms. His CCNA course is widely recognized as one of the best free resources available for CCNA certification preparation.
            </p>
          </div>

          <div className="placeholder-section">
            <h4>Support Jeremy's Work</h4>
            <p className="placeholder-text">
              Links to Jeremy's socials, donation options, course resources, and affiliate links will be added here soon.
            </p>
            <p className="placeholder-note">
              Stay tuned for ways to support Jeremy and access additional resources!
            </p>
          </div>

          <div className="about-footer">
            <p>
              Thank you, Jeremy, for making quality networking education accessible to everyone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutTab;
