import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DetailCarouselUIR from './components/DetailCarouselUIR/DetailCarouselUIR';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import './App.css'; // For any global App-specific styles
import AccelerationTab from './components/AccelerationTab';
import ToolVersionCarousel from './components/ToolVersionCarousel/ToolVersionCarousel';
import { Carosuels } from './hooks/Carousels.example';
import { mockCarouselData, toolVersionData } from './data';

// Mock data will be defined here or imported
const CarouselDemo = ({ title, component }) => {
  return (
    <div className="carousel-demo">
      <h1>{title} Sandbox</h1>
      <p style={{ height: '50vh', background: '#f0f0f0', padding: '20px', margin: '20px 0' }}>Scroll down to see the carousel animation. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <p style={{ height: '50vh', background: '#e0e0e0', padding: '20px', margin: '20px 0' }}>More content to ensure scrolling.</p>
      <div className={`detail-carousel-uir generic-carousel-uir js-detail-carousel-uir background-white ${mockCarouselData.orientation}`}>
        {component}
      </div>
      <p style={{ height: '50vh', background: '#d0d0d0', padding: '20px', margin: '20px 0' }}>Even more content after the carousel.</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<CarouselDemo title='Detail Carousel' component={<DetailCarouselUIR initialData={mockCarouselData} />} />} />
          <Route path="/about" element={<About />} />
          <Route path="/acceleration" element={<AccelerationTab />} />
          <Route path='/toolversion' 
            element={
              <CarouselDemo title='Tool Version Carousel' component={<ToolVersionCarousel items={toolVersionData.toolItems} showHeadline={true} headline={toolVersionData.headline} ctaLabel={toolVersionData.ctaLabel} />} />
            }
          />
        <Route path="/carousels" element={<Carosuels />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
