import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BREAKPOINTS = {
  MOBILE: 550,
  TABLET: 768,
  TABLET_LANDSCAPE: 1024,
  DESKTOP: 1440,
  LARGE_DESKTOP: 2560
};

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

export const useCarousel = ({
  totalSlides,
  orientation = '',
  className = '',
  animationConfig = {},
  rtlSupport = false
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [rtl, setRtl] = useState(rtlSupport && document.querySelector('html')?.dir === 'rtl');
  const [hasIntersected, setHasIntersected] = useState(false);
  
  const slidesRef = useRef(null);
  const containerRef = useRef(null);
  const timeline = useRef(null);

  // Get orientation and responsive configuration
  const getOrientation = (orientationProp) => {
    if (orientationProp === 'portrait') return true;
    if (orientationProp === 'landscape') return false;
    if (orientationProp === 'responsive-height') return 'responsive-height';
    return window.innerHeight > window.innerWidth;
  };

  const isPortrait = getOrientation(orientation);
  const device = windowWidth > BREAKPOINTS.MOBILE 
    ? (windowWidth > BREAKPOINTS.TABLET 
      ? (windowWidth > BREAKPOINTS.TABLET_LANDSCAPE ? 'DESKTOP' : 'TABLET_LANDSCAPE') 
      : 'TABLET') 
    : 'MOBILE';
  const orientationType = isPortrait === 'responsive-height' ? 'RESPONSIVE-HEIGHT' : isPortrait ? 'PORTRAIT' : 'LANDSCAPE';
  const slidesToShow = SLIDES_TO_SHOW[device][orientationType];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize GSAP timeline
  useEffect(() => {
    if (animationConfig.useGsap) {
      timeline.current = gsap.timeline({
        paused: true,
        defaults: { duration: 0.8, ease: 'power3.out' }
      });
    }
  }, [animationConfig.useGsap]);

  // Handle intersection observer for entry animations
  useEffect(() => {
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
      { threshold: 0.1 }
    );

    observer.observe(containerElement);
    return () => observer.disconnect();
  }, []);

  // Handle slide animation
  const animateSlide = (direction = 'next') => {
    if (!slidesRef.current) return;

    const slideWidth = 100 / totalSlides;
    const translateValue = (rtl ? 1 : -1) * slideWidth * currentSlide;
    
    if (animationConfig.useGsap) {
      gsap.to(slidesRef.current, {
        x: `${translateValue}%`,
        duration: 0.8,
        ease: 'power3.out'
      });
    } else {
      slidesRef.current.style.transform = `translateX(${translateValue}%)`;
    }

    // Custom animation callback if provided
    if (animationConfig.onSlideChange) {
      animationConfig.onSlideChange(direction, currentSlide);
    }
  };

  // Navigation handlers
  const handlePrevClick = () => {
    if (currentSlide === 0 || disabled) return;
    setDisabled(true);
    setCurrentSlide(currentSlide - 1);
    animateSlide('prev');
    setTimeout(() => setDisabled(false), 800);
  };

  const handleNextClick = () => {
    if (currentSlide >= totalSlides - slidesToShow || disabled) return;
    setDisabled(true);
    setCurrentSlide(currentSlide + 1);
    animateSlide('next');
    setTimeout(() => setDisabled(false), 800);
  };

  // Touch handling for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < totalSlides - slidesToShow) {
      handleNextClick();
    }
    if (isRightSwipe && currentSlide > 0) {
      handlePrevClick();
    }

    setTouchEnd(null);
    setTouchStart(null);
  };

  return {
    // State
    currentSlide,
    disabled,
    hasIntersected,
    rtl,
    slidesToShow,

    // Refs
    slidesRef,
    containerRef,
    timeline,

    // Methods
    handlePrevClick,
    handleNextClick,
    animateSlide,

    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,

    // Responsive info
    device,
    windowWidth,
    orientation: orientationType
  };
};