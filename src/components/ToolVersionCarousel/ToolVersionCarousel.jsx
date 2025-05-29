import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './ToolVersionCarousel.scss';

gsap.registerPlugin(ScrollToPlugin);

const ToolVersionCarousel = ({ 
  items = [],
  showHeadline = true,
  className = 'tool-version-carousel',
  ctaLabel = 'Technical Specifications',
  headline = '',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const modelNameRef = useRef([]); // Changed to array ref
  const modelDescRef = useRef([]);
  const [disabled, setDisabled] = useState(false);
  const slidesToShow = 1;
  const trackRef = useRef(null);
  const slidesRef = useRef([]);
  const containerRef = useRef(null);
  const totalSlides = items.length;
  const [hasIntersected, setHasIntersected] = useState(false);
  const prevIndex = useRef(0); // Changed to useRef for consistency
  const directionRef = useRef(1); // Changed to useRef for consistency

  const rtl = document.querySelector('html').dir === 'rtl';

  useEffect(() => {
    centerSlide(0);
  }, []);

  const centerSlide = (index) => {
    if (!slidesRef.current[index] || !trackRef.current) return;
    
    const slide = slidesRef.current[index];
    const slideWidth = slide.offsetWidth;
    const trackWidth = trackRef.current.offsetWidth;
    
    // Calculate the center position
    const centerPosition = (trackWidth - slideWidth) / 2;
    const slideOffset = slide.offsetLeft;
    const translateX = -(slideOffset - centerPosition);

    // Update direction for animations
    if (index > prevIndex.current) {
      directionRef.current = 1;
    } else if (index < prevIndex.current) {
      directionRef.current = -1;
    }

    gsap.to(trackRef.current, {
      x: translateX,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  const goToSlide = (newIndex) => {
    if (newIndex < 0 || newIndex >= items.length || newIndex === currentSlide) return;
    setCurrentSlide(newIndex);
    centerSlide(newIndex);
  };

  function handlePrevClick() {
    if (currentSlide === 0 || disabled) {
      return;
    }
    setCurrentSlide(currentSlide - 1);
    goToSlide(currentSlide - 1)
  }

  function handleNextClick() {
    if (currentSlide >= totalSlides - slidesToShow || disabled) {
      return;
    }
    setCurrentSlide(currentSlide + 1);
    goToSlide(currentSlide + 1)
  }

  useEffect(() => {
    // IntersectionObserver for entry animation
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasIntersected(true);
            observer.unobserve(containerElement);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    observer.observe(containerElement);

    return () => {
      observer.disconnect();
    };
  }, []); // Run once on mount

  // Replace the existing animation useEffect with this updated version
  useEffect(() => {
    const direction = directionRef.current;
    const prev = prevIndex.current;

    // Kill previous animations on the elements to prevent conflicts
    if (modelNameRef.current[prev]) {
      gsap.killTweensOf(modelNameRef.current[prev]);
      gsap.to(modelNameRef.current[prev], {
        y: -80 * direction,
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }

    if (modelNameRef.current[currentSlide]) {
      gsap.killTweensOf(modelNameRef.current[currentSlide]);
      gsap.fromTo(
        modelNameRef.current[currentSlide],
        { y: 80 * direction, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        }
      );
    }

    if (modelDescRef.current[prev]) {
      gsap.killTweensOf(modelDescRef.current[prev]);
      gsap.to(modelDescRef.current[prev], {
        y: 15 * direction,
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }

    if (modelDescRef.current[currentSlide]) {
      gsap.killTweensOf(modelDescRef.current[currentSlide]);
      gsap.fromTo(
        modelDescRef.current[currentSlide],
        { y: -15 * direction, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        }
      );
    }

    prevIndex.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    // GSAP animation when intersected
    if (hasIntersected) {
      const images = document.querySelectorAll(`.${className}__card img`);
      const slideElements =document.querySelectorAll(`.${className}__card`);

      if (slideElements.length > 0) {
        gsap.from(images, {
          clipPath: "inset(30% 30% 0% 30%)",
          y: 60,
          scale: 0.5, // Adjusted from 0.5
          opacity: 1,
          duration: 3, // Adjusted from 5
          ease: "power1.out",
          stagger: 0, // Animate images one after another
        });
      }
    }
  }, [hasIntersected]);

  if (totalSlides === 0) {
    return <div>No slides to display.</div>;
  }

  return (
    <div className={className} ref={containerRef}>
      {showHeadline && (
        <h2 className={`${className}__headline`}>{headline}</h2>
      )}

      <div className={`${className}__card-container`}>
        <div className={`${className}__content-wrapper`}>
          <div className={`${className}__card-slides`} ref={trackRef}>
            {items.map((item, index) => (
              <div 
                key={index}
                className={`${className}__card ${index === currentSlide ? 'active' : ''}`}
                ref={(el) => (slidesRef.current[index] = el)}
              >
                <img 
                  src={item.image} 
                  alt={item.altText || `Slide ${index + 1}`}
                  className={`${className}__card-image`}
                />
              </div>
            ))}
          </div>

          <div className={`${className}__model-specs`}>
            <h3>{items[currentSlide].specs}</h3>
          </div>

          {items.length > 1 && (
            <div className={`${className}__navigation`}>
              <button 
                className={`${className}__nav-button ${className}__prev-btn ${currentSlide === 0 ? 'disabled' : ''}`}
                onClick={handlePrevClick}
              >
                <span className="icon-right-arrow left-arrow"></span>
              </button>
              <button 
                className={`${className}__nav-button ${className}__next-btn ${currentSlide >= totalSlides - slidesToShow ? 'disabled' : ''}`}
                onClick={handleNextClick}
              >
                <span className="icon-right-arrow"></span>
              </button>
            </div>
          )}

          <div className={`${className}__model-name-wrapper`}>
            {items.map((item, index) => (
              <div
                key={index}
                ref={(el) => (modelNameRef.current[index] = el)}
                className={`${className}__model-name ${index === currentSlide ? 'active' : ''}`}
              >
                <h2>{item.modelName}</h2>
              </div>
            ))}
          </div>

          <div className={`${className}__model-desc-wrapper`}>
            {items.map((item, index) => (
              <div
                key={index}
                ref={(el) => (modelDescRef.current[index] = el)}
                className={`${className}__model-desc ${index === currentSlide ? 'active' : ''}`}
              >
                {item.description}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${className}__button-container`}>
        <a className={`${className}__button btn-secondary-dark`}>
          <span>{items[currentSlide].buttonLabel}</span>
        </a>
        <a className={`${className}__button ${className}__cta-link`}>{ctaLabel}</a>
      </div>
    </div>
  );
};

export default ToolVersionCarousel;