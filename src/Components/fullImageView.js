import React from "react";
import "../CSS/FullImageView.css"; // Import the CSS specific to FullImageView

function FullImageView({ images, currentIndex, onClose, onNext, onPrev }) {
  if (!images || images.length === 0) {
    return null; // Handle the case when images array is empty or undefined
  }

  const currentImage = images[currentIndex];

  return (
    <div className="FullImageView">
      <button className="CloseButton" onClick={onClose}>X</button>
      <button className="NavButton" onClick={onPrev}>&lt;</button>
      <img src={currentImage.url} alt={currentImage.title} />
      <button className="NavButton" onClick={onNext}>&gt;</button>
      </div>
  );
}

export default FullImageView;
