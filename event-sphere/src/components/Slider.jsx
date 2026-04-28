import React, { useState, useEffect, useRef } from 'react';

const SLIDES_MOCK = [
  '/images/Banner 1.jpg',
  '/images/Banner 2.jpg',
  '/images/Banner 3.jpg',
  '/images/Banner 4.jpg',
];

export default function Slider() {
  const slidesContainerRef = useRef(null);
  const totalOriginalSlides = SLIDES_MOCK.length;
  // Initialize with the 1-based index (for the first real slide after the clone)
  const [slideIndex, setSlideIndex] = useState(1); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Effect to set initial position
  useEffect(() => {
    const container = slidesContainerRef.current;
    if (!container) return;
    container.style.transform = `translateX(-${slideIndex * 100}%)`;
  }, [slideIndex]);

  // Effect to handle CSS transition end and infinite loop logic
  useEffect(() => {
    const container = slidesContainerRef.current;
    if (!container) return;
    
    const handleTransitionEnd = () => {
      setIsTransitioning(false);
      let newIndex = slideIndex;

      // Reset from first clone (index totalOriginalSlides + 1) back to first real slide (index 1)
      if (slideIndex === totalOriginalSlides + 1) { 
        newIndex = 1;
      } 
      // Reset from last clone (index 0) back to last real slide (index totalOriginalSlides)
      else if (slideIndex === 0) {
        newIndex = totalOriginalSlides;
      }
      
      if (newIndex !== slideIndex) {
        // Jump without transition
        container.style.transition = 'none';
        container.style.transform = `translateX(-${newIndex * 100}%)`;
        setSlideIndex(newIndex);
        // Force reflow to ensure the transition is removed before next animation
        container.offsetHeight;
      }
    };
    
    container.addEventListener('transitionend', handleTransitionEnd);
    return () => container.removeEventListener('transitionend', handleTransitionEnd);
  }, [slideIndex, totalOriginalSlides]);

  // Separate effect for auto-slide to avoid recreating interval
  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      if (!isTransitioning) {
        handleSlideChange(1);
      }
    }, 3000);

    return () => clearInterval(autoSlideInterval);
  }, [isTransitioning]);

  // Function to move the slider
  const handleSlideChange = (direction) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newIndex = slideIndex + direction;
    const container = slidesContainerRef.current;
    if (!container) return;

    // Apply smooth transition before updating the index state
    container.style.transition = 'transform 1.4s cubic-bezier(0.77, 0, 0.175, 1)';
    container.style.transform = `translateX(-${newIndex * 100}%)`;
    setSlideIndex(newIndex);
  };
  
  // Array includes clones for infinite loop: [Last, 1, 2, 3, 4, First]
  const fullSlides = [SLIDES_MOCK[totalOriginalSlides - 1], ...SLIDES_MOCK, SLIDES_MOCK[0]];
  
  // Calculate which dot should be active
  const activeDotIndex = (slideIndex - 1 + totalOriginalSlides) % totalOriginalSlides;

  return (
    <div className="banner_section">
      <div className="slider">
        <div className="slides" id="slides" ref={slidesContainerRef}>
          {fullSlides.map((src, index) => (
            <div className="slide" key={index}>
              <img src={src} alt={`Slide ${index}`} />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button className="nav-btn" id="prevBtn" onClick={() => handleSlideChange(-1)}>&#10094;</button>
        <button className="nav-btn" id="nextBtn" onClick={() => handleSlideChange(1)}>&#10095;</button>
        
        {/* Dots */}
        <div className="dots">
          {SLIDES_MOCK.map((_, index) => (
            <span 
              key={index}
              className={`dot ${index === activeDotIndex ? 'active-dot' : ''}`}
              onClick={() => handleSlideChange(index + 1 - slideIndex)} // Calculate difference to get to target slide index
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
