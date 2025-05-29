import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./GenericCarousel.scss"; // Adjusted SCSS import

gsap.registerPlugin(ScrollTrigger);

const BREAKPOINTS = {
  MOBILE: 550,
  TABLET: 768,
  TABLET_LANDSCAPE: 1024,
  DESKTOP: 1440,
  LARGE_DESKTOP: 2560
};

// Define slides to show inside container based on image orientation and device width
const SLIDES_TO_SHOW = {
  DESKTOP: {
    LANDSCAPE: 1,
    PORTRAIT: 2,
    'RESPONSIVE-HEIGHT': 1
  },
  TABLET: {
    LANDSCAPE: 1,
    PORTRAIT: 1,
    'RESPONSIVE-HEIGHT': 1
  },
  TABLET_LANDSCAPE: {
    LANDSCAPE: 1,
    PORTRAIT: 1,
    'RESPONSIVE-HEIGHT': 1
  },
  MOBILE: {
    LANDSCAPE: 1,
    PORTRAIT: 1,
    'RESPONSIVE-HEIGHT': 1
  }
};

const GenericCarousel = function ({
  primaryPopup = false,
  secondaryPopup = false,
  orientation = "",
  children,
  // useEffect, // Removed, will be imported from 'react'
  // useRef,    // Removed, will be imported from 'react'
  // useState,  // Removed, will be imported from 'react'
  // React,     // Removed, will be imported from 'react'
  className = "",
  items = [], // items prop is kept as it's used for itemsLength, though children is primary for slides
  showArrows = true,
  showProgressBar = true,
  showSecondaryButtons = false,
  primaryShowCta = false,
  secondaryShowCta = false,
  primaryCtaLink = "",
  primaryCtaLabel = "",
  secondaryCtaLink = "",
  secondaryCtaLabel = "",
}) {

  const genericCarouselClassName = "generic-carousel-uir";
  const slidesRef = useRef(null);
  const progressBarRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [rtl, setRtl] = useState(false); // Assuming LTR default, can be made a prop if needed
  const spacing = windowWidth < BREAKPOINTS.TABLET ? 8 : 16; // This was not a prop, assuming it's a fixed value
  const totalSlides = React.Children.count(children);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; // minimum distance for swipe detection
  // const itemsLength = items.length; // itemsLength is not used in the provided snippet, can be removed if truly unused
  const [hasIntersected, setHasIntersected] = useState(false); // For entry animation
  const carouselContainerRef = useRef(null); // Ref for the main container for IntersectionObserver

  function getOrientation(orientationProp) {
    if (orientationProp === 'portrait') return true;
    if (orientationProp === 'landscape') return false;
    if (orientationProp === 'responsive-height') return 'responsive-height';
    return window.innerHeight > window.innerWidth; // Default based on window dimensions
  }

  const isPortrait = getOrientation(orientation);
  const device = windowWidth > BREAKPOINTS.MOBILE ? (windowWidth > BREAKPOINTS.TABLET ? (windowWidth > BREAKPOINTS.TABLET_LANDSCAPE ? 'DESKTOP' : 'TABLET_LANDSCAPE') : 'TABLET') : 'MOBILE';
  const orientationType = isPortrait === 'responsive-height' ? 'RESPONSIVE-HEIGHT' : isPortrait ? 'PORTRAIT' : 'LANDSCAPE';
  const slidesToShow = SLIDES_TO_SHOW[device][orientationType];

  useEffect(() => {
    // This effect handles CTA clicks for overlays.
    // In a sandbox, the overlay elements (data-overlayelementid) might not exist
    // or might need to be mocked. For now, keeping it as is.
    // If issues arise, this part might need simplification or removal for the sandbox.
    const container = slidesRef.current.closest(`.${genericCarouselClassName}__container`);
    if (!container) return;

    const handleCtaClick = (event) => {
      const target = event.target.closest('a[data-overlayid]');
      if (target && target.getAttribute('role') === 'button') {
        event.preventDefault();
        const overlayId = target.dataset.overlayid;
        const overlayElement = document.querySelector(`[data-overlayelementid="${overlayId}"]`);
        if (overlayElement) {
           overlayElement.classList.add('open');
           document.body.classList.add('locked');

           const closeButton = overlayElement.querySelector('.close');
           if (closeButton) {
             const handleCloseOverlay = () => {
               overlayElement.classList.remove('open');
               document.body.classList.remove('locked');
               closeButton.removeEventListener('click', handleCloseOverlay);
             };
             closeButton.addEventListener('click', handleCloseOverlay);
           }
         } else {
          console.warn(`Sandbox: Overlay element with ID "${overlayId}" not found. This is expected if overlays are not part of the sandbox.`);
        }
      }
    };

    container.addEventListener('click', handleCtaClick);

    return () => {
      container.removeEventListener('click', handleCtaClick);
    };
  }, [primaryPopup, secondaryPopup, primaryCtaLink, secondaryCtaLink, genericCarouselClassName]);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      function later() {
        clearTimeout(timeout);
        func(...args);
      }
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, currentX: 0 });

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    dragRef.current.startX = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    dragRef.current.currentX = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < totalSlides - slidesToShow) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }

    setTouchEnd(null);
    setTouchStart(null);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    dragRef.current.startX = e.pageX;
    setTouchStart(e.pageX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    dragRef.current.currentX = e.pageX;
    setTouchEnd(e.pageX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      handleTouchEnd();
    }
  };

  function updateCarousel() {
    const container = slidesRef.current.parentElement;
    const slideTracker = slidesRef.current;

    if (!container) return;
  
    // Calculate slide width dynamically based on container and viewport dimensions
        // New calculation for translation percentage:        
        let translationPercentage = 0;
        if (slidesToShow > 0) { // Use slidesToShow (defined in component scope)
            translationPercentage = 100 / slidesToShow;
        }
        if(isPortrait === true) {
          // adjust translation percentage based on mobile/tablet
          if (windowWidth < BREAKPOINTS.MOBILE) {
              translationPercentage = translationPercentage + 2; // 100% width for mobile
          } else if (windowWidth <= BREAKPOINTS.TABLET) {
              translationPercentage = 61; // 50% width for tablet
          } 
          else if (windowWidth <= BREAKPOINTS.TABLET_LANDSCAPE) {
              translationPercentage = 71; // 50% width for tablet landscape
          } else {
              translationPercentage = 50; // 33.33% width for desktop
          }
        } else if(!isPortrait || isPortrait ==='responsive-height') {
          if(windowWidth <= BREAKPOINTS.MOBILE) {
            translationPercentage = translationPercentage + 2; // 100% width for mobile
          } else if(windowWidth < BREAKPOINTS.TABLET_LANDSCAPE) {
            translationPercentage = 66; // 50% width for tablet
          } else if(windowWidth > BREAKPOINTS.DESKTOP && windowWidth <= BREAKPOINTS.LARGE_DESKTOP) {
            translationPercentage = 57;
          } else if(windowWidth > BREAKPOINTS.LARGE_DESKTOP)  {
            translationPercentage = parseFloat(40) / parseFloat(slidesToShow);          
          } else {
            translationPercentage = translationPercentage + 2 / parseFloat(slidesToShow);
          }
        }

        // Apply the translation
        // slideTracker is slidesRef.current, currentSlide is the state variable
        slideTracker.style.transform = `translateX(${(rtl ? 1 : -1) * translationPercentage * currentSlide}%)`;

    if (showProgressBar && progressBarRef.current) {
      const progress = Math.min(100, Math.max(20, (currentSlide / (totalSlides - slidesToShow)) * 100));
      gsap.to(progressBarRef.current, {
        width: progress + '%',
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }
    setDisabled(false);
  }

  useEffect(function() {
    const timeline = gsap.timeline();
    updateCarousel();
    // Handle window resize
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
      setCurrentSlide(0); // Reset to first slide on resize
      setDisabled(false); // Ensure carousel is enabled after resize
    }, 250);
    window.addEventListener('resize', handleResize);

    return function() {
      timeline.kill();
      window.removeEventListener('resize', handleResize);
    }
  }, [currentSlide, items, spacing, rtl, windowWidth, slidesToShow, totalSlides, showProgressBar, updateCarousel]); // Added dependencies based on usage

  useEffect(function() {
    if (showProgressBar && progressBarRef.current) {
      gsap.set(progressBarRef.current, {
        width: '20%'
      });
    }
  }, [showProgressBar]);

  useEffect(() => {
    // IntersectionObserver for entry animation
    const containerElement = carouselContainerRef.current;
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

  useEffect(() => {
    // GSAP animation when intersected
    if (hasIntersected && slidesRef.current) {
      const images = slidesRef.current.querySelectorAll(`.${genericCarouselClassName}__slide img`);
      const slideElements = slidesRef.current.querySelectorAll(`.${genericCarouselClassName}__slide`);

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
      // Optionally animate other elements like navigation buttons if desired
      // gsap.from(carouselContainerRef.current.querySelectorAll('.generic-carousel-uir__navigation-btns button'), { ... });
      
      // Set hasIntersected to false after animation to prevent re-triggering if component re-renders for other reasons
      // and observer is already disconnected. Or, ensure this effect only runs once.
      // For simplicity, we'll let it run if hasIntersected is true. If re-animation on prop changes is an issue, add more logic.
    }
  }, [hasIntersected, genericCarouselClassName]);


  function handlePrevClick() {
    if (currentSlide === 0 || disabled) {
      return;
    }
    setDisabled(true);
    setCurrentSlide(prev => prev - 1);
  }

  function handleNextClick() {
    if (currentSlide >= totalSlides - slidesToShow || disabled) {
      return;
    }
    setDisabled(true);
    setCurrentSlide(prev => prev + 1);
  }

  if (totalSlides === 0) {
    return <div>No slides to display.</div>;
  }

  return (
    <div 
      className={`${genericCarouselClassName}__container ${className}__container`} 
      ref={carouselContainerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleMouseLeave}>
      <div
        className={`${genericCarouselClassName}__slides ${className}__slides`}
        ref={slidesRef}
      >
        {children}
      </div>
      {showSecondaryButtons && (
          <div className={`${genericCarouselClassName}__ctas`}>
            {primaryShowCta && (
              <a 
                href={primaryPopup ? '#' : (primaryCtaLink ? primaryCtaLink : '#')}
                className={`${genericCarouselClassName}__cta ${genericCarouselClassName}__ctas__primary`}
                role={primaryPopup ? 'button' : undefined}
                data-overlayid={primaryPopup ? `overlay-${primaryCtaLink}` : undefined}
                target={!primaryPopup && primaryCtaLink ? '_blank' : undefined}
                rel={!primaryPopup && primaryCtaLink ? 'noopener noreferrer' : undefined}
              >
                {primaryCtaLabel}
              </a>
            )}
            {secondaryShowCta && (
              <a 
                href={secondaryPopup ? '#' : (secondaryCtaLink ? secondaryCtaLink : '#')}
                className={`${genericCarouselClassName}__cta ${genericCarouselClassName}__ctas__secondary`}
                role={secondaryPopup ? 'button' : undefined}
                data-overlayid={secondaryPopup ? `overlay-${secondaryCtaLink}` : undefined}
                target={!secondaryPopup && secondaryCtaLink ? '_blank' : undefined}
                rel={!secondaryPopup && secondaryCtaLink ? 'noopener noreferrer' : undefined}
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        )
      }
      <div className={`${genericCarouselClassName}__navigation ${className}__navigation`}>
        {showProgressBar && (
          <div className={`${genericCarouselClassName}__progress-bar ${className}__progress-bar`}>
            <div className={`${genericCarouselClassName}__progress-bar-fill ${className}__progress-bar-fill`} ref={progressBarRef}></div>
          </div>
        )}
        {showArrows && (
          <div className={`${genericCarouselClassName}__navigation-btns ${className}__navigation-btns`}>
            <button className={`${genericCarouselClassName}__prev-btn ${className}__prev-btn ${currentSlide === 0 ? 'disabled' : ''}`}  onClick={handlePrevClick} disabled={currentSlide === 0 || disabled}>
              <span className="icon-right-arrow left-arrow"></span> {/* Assuming icon font is available or replaced by SVG/image */}
            </button>
            <button className={`${genericCarouselClassName}__next-btn ${className}__next-btn ${currentSlide >= totalSlides - slidesToShow ? 'disabled' : ''}`}  onClick={handleNextClick} disabled={currentSlide >= totalSlides - slidesToShow || disabled}>
              <span className="icon-right-arrow"></span> {/* Assuming icon font is available */}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericCarousel;
