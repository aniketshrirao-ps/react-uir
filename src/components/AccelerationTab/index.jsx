import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "./style.scss";

const tabs = [
  {
    id: 0,
    label: "PETROL",
    heading: "V6 NETTUNO",
    description:
      "The Grecale’s V6 3000-cc twin turbo engine is an engineering marvel based on pre-chamber architecture able to deliver outstanding power or improved efficiency, depending on your driving desires.",
    image: 'https://picsum.photos/1440/810?random=1',
  },
  {
    id: 1,
    label: "MILD HYBRID",
    heading: "MILD POWER",
    description:
      "Turbocharged four-cylinder engine with mild-hybrid technology, combining efficiency with dynamic performance.",
    image: 'https://picsum.photos/1440/810?random=2',
  },
  {
    id: 2,
    label: "BEV",
    heading: "FULL ELECTRIC",
    description:
      "Turbocharged four-cylinder engine with mild-hybrid technology, combining efficiency with dynamic performance.",
    image: 'https://picsum.photos/1440/810?random=3',
  },
];

export default function AccelerationTab() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [backgroundStack, setBackgroundStack] = useState([tabs[0].image]);
  const directionRef = useRef(1);
  const headingRefs = useRef([]);
  const descRefs = useRef([]);
  const prevIndex = useRef(0);
  const isAnimatingRef = useRef(false); // Ref to track animation state

  const handleTabClick = (index) => {
    if (index === activeIndex || isAnimatingRef.current) return; // Block if same tab or animating
    isAnimatingRef.current = true; // Set animating flag
    directionRef.current = index > activeIndex ? 1 : -1;
    prevIndex.current = activeIndex;
    setActiveIndex(index);
    setBackgroundStack((prev) => [...prev, tabs[index].image]);
  };

  useEffect(() => {
    const direction = directionRef.current;
    const prev = prevIndex.current;

    // Kill previous animations on the elements to prevent conflicts
    if (headingRefs.current[prev]) {
      gsap.killTweensOf(headingRefs.current[prev]);
      gsap.to(headingRefs.current[prev], {
        y: -80 * direction,
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
    }

    if (headingRefs.current[activeIndex]) {
      gsap.killTweensOf(headingRefs.current[activeIndex]);
      gsap.fromTo(
        headingRefs.current[activeIndex],
        { y: 80 * direction, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut",
        }
      );
    }

    if (descRefs.current[prev]) {
      gsap.killTweensOf(descRefs.current[prev]);
      gsap.to(descRefs.current[prev], {
        y: 15 * direction, // Corrected y translation value
        opacity: 0,
        duration: 1.5, 
        ease: "power2.inOut",
      });
    }

    if (descRefs.current[activeIndex]) {
      gsap.killTweensOf(descRefs.current[activeIndex]);
      gsap.fromTo(
        descRefs.current[activeIndex],
        { y: -15 * direction, opacity: 0 }, // Corrected y translation value
        {
          y: 0, 
          opacity: 1,
          duration: 1.5, 
          ease: "power2.inOut",
        }
      );
    }
  }, [activeIndex]);

  useEffect(() => {
    if (backgroundStack.length < 2) return;
    const images = document.querySelectorAll(".background-image");
    const newImg = images[images.length - 1];
    const direction = directionRef.current;

    gsap.set(newImg, {
      x: direction === 1 ? "-100%" : "100%",
      opacity: 1,
    });

    gsap.to(newImg, {
      x: "0%",
      opacity: 1,
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        setBackgroundStack((stack) => stack.slice(-1));
        isAnimatingRef.current = false; // Reset animating flag when background animation completes
      },
    });
  }, [backgroundStack]);

  return (
    <div className="tab-component">
      <div className="tab-menu">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={activeIndex === index ? "active" : ""}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="background-container">
        <div className="background-layer">
          {backgroundStack.map((bg, i) => (
            <div
              key={i}
              className="background-image"
              style={{ backgroundImage: `url(${bg})` }}
            />
          ))}
        </div>
      </div>

      <div className="content">
        <div className="scroll-stack heading-wrapper">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`scroll-item heading-block ${
                index === activeIndex ? "active" : ""
              }`}
              ref={(el) => (headingRefs.current[index] = el)}
            >
              {tab.heading}
            </div>
          ))}
        </div>
      </div>

      <div className="buttom-container">
        <div className="scroll-stack desc-wrapper">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`scroll-item desc-block ${
                index === activeIndex ? "active" : ""
              }`}
              ref={(el) => (descRefs.current[index] = el)}
            >
              {tab.description}
            </div>
          ))}
        </div>
        <button className="discover-button">DISCOVER MORE</button>
      </div>
    </div>
  );
}
