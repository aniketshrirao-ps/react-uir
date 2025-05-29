import React from 'react';
import { useCarousel } from './useCarousel';
import { mockCarouselData, toolVersionData } from '../data';

export const Carosuels = () => {
  return (
    <div>
      <ToolVersionCarouselExample items={toolVersionData.toolItems}  />
      <DetailCarouselExample items={mockCarouselData.items} orientation={'landscape'} />
    </div>
  );
}

// Example for ToolVersionCarousel
export const ToolVersionCarouselExample = ({ items }) => {
  const {
    currentSlide,
    disabled,
    hasIntersected,
    slidesRef,
    containerRef,
    handlePrevClick,
    handleNextClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCarousel({
    totalSlides: items.length,
    className: 'tool-version-carousel',
    animationConfig: {
      useGsap: true,
      onSlideChange: (direction, currentSlide) => {
        // Custom animation logic for tool version carousel
      }
    }
  });

  return (
    <div ref={containerRef} className="tool-version-carousel">
      <div 
        ref={slidesRef}
        className="tool-version-carousel__card-slides"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div 
            key={index}
            className={`tool-version-carousel__card ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={item.image} alt={item.altText} />
          </div>
        ))}
      </div>
      
      {items.length > 1 && (
        <div className="tool-version-carousel__navigation">
          <button 
            onClick={handlePrevClick} 
            disabled={currentSlide === 0 || disabled}
            className="tool-version-carousel__nav-button tool-version-carousel__prev-btn"
          >
            <span className="icon-right-arrow left-arrow" />
          </button>
          <button 
            onClick={handleNextClick}
            disabled={currentSlide >= items.length - 1 || disabled}
            className="tool-version-carousel__nav-button tool-version-carousel__next-btn"
          >
            <span className="icon-right-arrow" />
          </button>
        </div>
      )}
    </div>
  );
};

// Example for DetailCarouselUIR
export const DetailCarouselExample = ({ items, orientation }) => {
  const {
    currentSlide,
    disabled,
    hasIntersected,
    slidesRef,
    containerRef,
    handlePrevClick,
    handleNextClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    slidesToShow
  } = useCarousel({
    totalSlides: items.length,
    orientation,
    className: 'detail-carousel-uir',
    animationConfig: {
      useGsap: true
    }
  });

  return (
    <div ref={containerRef} className="detail-carousel-uir">
      <div 
        ref={slidesRef}
        className="detail-carousel-uir__slides"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((slide, index) => (
          <div 
            key={index}
            className={`detail-carousel-uir__slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.image} alt={slide.altText} />
            <div className="detail-carousel-uir-text-container">
              <h3>{slide.title}</h3>
              <p>{slide.slideDescriptionText}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="detail-carousel-uir__navigation">
          <button 
            onClick={handlePrevClick}
            disabled={currentSlide === 0 || disabled}
            className="detail-carousel-uir__nav-button detail-carousel-uir__prev-btn"
          >
            <span className="icon-right-arrow left-arrow" />
          </button>
          <button 
            onClick={handleNextClick}
            disabled={currentSlide >= items.length - slidesToShow || disabled}
            className="detail-carousel-uir__nav-button detail-carousel-uir__next-btn"
          >
            <span className="icon-right-arrow" />
          </button>
        </div>
      )}
    </div>
  );
};
