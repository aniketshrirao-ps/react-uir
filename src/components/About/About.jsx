import React from 'react';
import './About.scss';

const About = () => {
  return (
    <div className="about-container">
      <h1>About the Carousel Demo</h1>
      <div className="about-content">
        <p>
          This is a demonstration of a responsive, feature-rich carousel component built with React.
          The carousel supports various features including:
        </p>
        <ul>
          <li>Touch and drag interactions</li>
          <li>Responsive design</li>
          <li>Progress bar navigation</li>
          <li>Custom navigation arrows</li>
          <li>Multiple orientation support</li>
        </ul>
        <p>
          The carousel is built using modern React practices and includes smooth animations
          powered by GSAP (GreenSock Animation Platform).
        </p>
      </div>
    </div>
  );
};

export default About;