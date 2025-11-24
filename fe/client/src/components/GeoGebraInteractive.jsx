import React, { useEffect, useState } from 'react';
import './GeoGebraInteractive.css'; // <--- Import CSS

const GeoGebraInteractive = ({ base64, title, width = "100%", height = 600 }) => {
  const containerId = `ggb-interactive-${Math.random().toString(36).substr(2, 9)}`;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!base64 || !window.GGBApplet) return;

    const applet = new window.GGBApplet({
      appName: "geometry",
      width: 800, // Width nội bộ
      height: height,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      ggbBase64: base64,
      allowUpscale: true,
      scaleContainerClass: 'ggb-wrapper' // Class để GeoGebra tự responsive
    }, true);
    
    applet.inject(containerId);
    setIsLoaded(true);
  }, [base64, height]);

  return (
    <div className="ggb-interactive-container">
      {title && <h4 className="ggb-title">{title}</h4>}
      <div className="ggb-wrapper">
        <div id={containerId}></div>
      </div>
      {!isLoaded && <div className="ggb-loading">Đang tải hình học...</div>}
    </div>
  );
};

export default GeoGebraInteractive;