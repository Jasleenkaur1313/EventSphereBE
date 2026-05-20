import React from 'react';

export default function Footer() {
  // SVG paths simplified for brevity, assuming social-icon style works from global.css
  const SocialIcon = ({ d }) => (
    <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d={d} />
    </svg>
  );

  return (
    <footer className="footer">
      <p>Powered by Chitkara University</p>
      <div className="footer-social-links">
        <a href="https://www.linkedin.com/school/chitkara-university/" target="_blank">
          <SocialIcon d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.8 53.8 0 11107.59 0c0 29.7-24.09 54.3-53.8 54.3zM447.9 448h-92.4V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.6V448h-92.5V148.9h88.8v40.8h1.3c12.4-23.4 42.5-48.3 87.4-48.3 93.6 0 110.9 61.6 110.9 141.7V448z" />
        </a>
        <a href="https://www.instagram.com/chitkarau/" target="_blank">
          <SocialIcon d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8c63.6 0 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 188.2c-40.5 0-73.4-32.9-73.4-73.4s32.9-73.4 73.4-73.4 73.4 32.9 73.4 73.4-32.9 73.4-73.4 73.4zm146.4-194.3c0 14.9-12.1 27-27 27s-27-12.1-27-27 12.1-27 27-27 27 12.1 27 27zM398.8 80c-8.4-21.3-24.9-37.8-46.2-46.2C325.3 24 256 24 256 24s-69.3 0-96.6 9.8c-21.3 8.4-37.8 24.9-46.2 46.2C104 107.3 104 176.6 104 176.6s0 69.3 9.8 96.6c8.4 21.3 24.9 37.8 46.2 46.2C186.7 329 256 329 256 329s69.3 0 96.6-9.8c21.3-8.4 37.8-24.9 46.2-46.2 9.8-27.3 9.8-96.6 9.8-96.6s0-69.3-9.8-96.6z" />
        </a>
        <a href="https://twitter.com/ChitkaraU" target="_blank">
          <SocialIcon d="M459.4 151.7c.3 4.5 .3 9 .3 13.6 0 138.7-105.6 298.9-298.9 298.9-59.5 0-114.9-17.2-161.5-47 8.4 1 16.8 1.6 25.7 1.6 49.1 0 94.2-16.8 130.1-45.5-46-1-84.8-31.1-98.1-72.8a106.3 106.3 0 0047.7-1.6c-48.1-9.7-84.2-52-84.2-102.6v-1.3c14.1 7.8 30.2 12.6 47.4 13.2a104.9 104.9 0 01-46.6-87.5c0-19.5 5.2-37.5 14.1-53a298.6 298.6 0 00216.5 109.8c-15.9-76.1 41.4-137.7 112.5-137.7 33 0 62.8 13.8 83.7 36.3a208 208 0 0065.8-25.2c-6.8 21.3-21.3 39.1-40.4 50.5a211 211 0 0060.5-16.1c-13.2 20.4-30.1 38.4-49.5 52.6z" />
        </a>
        <a href="https://www.facebook.com/ChitkaraU/" target="_blank">
          <SocialIcon d="M279.1 288l14.2-92.7h-88.9v-60.1c0-25.4 12.4-50.1 52.2-50.1H296V6.3S273.7 0 252.1 0c-73.5 0-121.6 44.4-121.6 124.7v70.6H64v92.7h66.5V512h100.2V288z" />
        </a>
      </div>
      <p>&copy; 2025 Chitkara University. All rights reserved.</p>
    </footer>
  );
}