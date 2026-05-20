import React, { useEffect, useRef, useState } from 'react';

export default function AboutSection({ title, text, imgSrc, altText, fadeDirection }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer logic to trigger the fade animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsVisible(entry.isIntersecting);
      });
    }, { threshold: 0.2 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animationClass = `${fadeDirection} ${isVisible ? 'show' : ''}`;

  return (
    <section 
      id="about" 
      className={`about-section ${animationClass}`} 
      ref={sectionRef}
    >
      <div className="about-text">
        <h2>{title}</h2>
        {/* Use dangerouslySetInnerHTML to allow HTML list items from HomePage.jsx */}
        <p dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }}></p>
      </div>
      <div className="about-img">
        <img 
          src={imgSrc} 
          alt={altText} 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/420x280/8A2BE2/ffffff?text=Image+Missing'; }}
        />
      </div>
    </section>
  );
}