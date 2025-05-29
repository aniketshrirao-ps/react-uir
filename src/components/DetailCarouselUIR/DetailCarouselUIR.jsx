import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GenericCarousel from '../GenericCarousel/GenericCarousel.jsx';
import './DetailCarouselUIR.scss'; // We will create this SCSS file next

gsap.registerPlugin(ScrollTrigger);
const className = "detail-carousel-uir";
const genericCarouselClassName = "generic-carousel-uir"; // Keep consistent if used by GenericCarousel

// This was originally MASERATI.DetailCarouselUIR.prototype.DetailCarouselSlideUIR
const DetailCarouselSlideUIR = (props) => {
  const { slide } = props;
  return (
      <div className={`${genericCarouselClassName}__slide ${className}__slide`}>
        <img src={slide.image} alt={slide.altText} />
        <div className={`${className}-text-container`}>
          <h3>{slide.title}</h3>
          <p>{slide.slideDescriptionText}</p>
        </div>
      </div>
  );
}

const DetailCarouselUIR = ({ initialData }) => {
  // The 'el' (this.$el) from the original constructor is not directly needed 
  // as React handles the DOM element where this component is rendered.
  // The data is now passed via props (initialData).

  const [carouselData, setCarouselData] = useState(initialData);

  // The original getData logic is now handled by passing initialData
  // If data needed to be fetched or processed from a source other than props,
  // useEffect would be used here.
  useEffect(() => {
    if (initialData) {
      setCarouselData(initialData);
    }
    // Example: If data needed to be fetched from an API or processed:
    // const fetchData = async () => { /* ... fetch logic ... */ };
    // fetchData();
  }, [initialData]);

  if (!carouselData || !carouselData.items || !carouselData.items.length) {
    console.warn("No carousel items to render.");
    // In a React component, you'd typically return null or some placeholder UI
    return <div>No carousel items to render. Please check the data.</div>;
  }

  // The original render method's content is now the return statement of the component.
  // ReactDOM.createRoot is handled by main.jsx for the whole app.
  return (
    <>
      <GenericCarousel
        className={className} // Pass the specific className for DetailCarousel styling
        // React, useEffect, useRef, useState are imported directly in GenericCarousel.jsx
        orientation={carouselData.orientation}
        showArrows={true} // Defaulting as per original, can be made dynamic if needed
        showProgressBar={true} // Defaulting as per original
        showSecondaryButtons={true} // Defaulting as per original
        primaryShowCta={carouselData.primaryShowCta}
        secondaryShowCta={carouselData.secondaryShowCta}
        primaryCtaLink={carouselData.primaryCtaLink}
        primaryCtaLabel={carouselData.primaryCtaLabel}
        secondaryCtaLink={carouselData.secondaryCtaLink}
        secondaryCtaLabel={carouselData.secondaryCtaLabel}
        primaryPopup={carouselData.primaryPopup}
        secondaryPopup={carouselData.secondaryPopup}
        items={carouselData.items} // Pass items for GenericCarousel to know its length if needed
      >
        {carouselData.items.map((slide, index) => (
          <DetailCarouselSlideUIR 
            key={index} 
            slide={slide}
          />
        ))}
      </GenericCarousel>
    </>
  );
};

export default DetailCarouselUIR;
