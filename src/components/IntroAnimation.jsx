import React, { useState, useEffect, useRef } from 'react';
import './IntroAnimation.css';

const IntroAnimation = ({ onComplete }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [stage, setStage] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (!hasStarted) return;

    // Timeline starts exactly when clicked
    const t1 = setTimeout(() => setStage(1), 1500); // "Do you want to remain..." appears
    const t2 = setTimeout(() => setStage(2), 3500); // Text 1 fades out, Image fade begins
    const t3 = setTimeout(() => setStage(3), 4000); // Text 2 appears + Image visible
    const t4 = setTimeout(() => setStage(4), 8000); // Text 2 fades out, Image fully defined, Hotspots emerge
    const t5 = setTimeout(() => setStage(5), 9000); // "Choose." appears

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      }
    }, 2000);
  };

  const handleRedPill = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleBluePill = () => {
    setIsRejected(true);
  };

  const resetIntro = () => {
    setIsRejected(false);
    setStage(0);
    setTimeout(() => setStage(1), 1500);
    setTimeout(() => setStage(2), 3500);
    setTimeout(() => setStage(3), 4000);
    setTimeout(() => setStage(4), 8000);
    setTimeout(() => setStage(5), 9000);
  };

  if (isRejected) {
    return (
      <div className="intro-container">
        <div className="rejection-state">
          <p className="rejection-text">You chose to stay where you are. No transformation.</p>
          <button className="leave-btn" onClick={resetIntro}>Leave</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`intro-container ${isFadingOut ? 'fade-out' : ''}`}>
      <audio ref={audioRef} src="/Bg voice.mp3" preload="auto" />

      {!hasStarted && (
        <div className="start-screen" onClick={handleStart}>
          <div className="start-text">Click anywhere to begin.</div>
        </div>
      )}

      {hasStarted && (
        <>
          <div className="bg-image-wrapper">
            <img 
              src="/Bg img.png" 
              alt="Transformation Sequence" 
              className={`bg-image ${stage >= 3 ? (stage >= 4 ? 'defined' : 'visible') : ''}`} 
            />

            {/* Hotspots overlaying the image */}
            <div className={`choice-layer ${stage >= 4 ? 'visible' : ''}`}>
              {/* Red Pill (Viewer's Left) */}
              <div className="hotspot hotspot-red bg-transparent" onClick={handleRedPill}>
                <div className="pill-text">Become</div>
              </div>

              {/* Blue Pill (Viewer's Right) */}
              <div className="hotspot hotspot-blue bg-transparent" onClick={handleBluePill}>
                <div className="pill-text">Remain</div>
              </div>
            </div>
          </div>

          {/* Narrative Text Layer */}
          <div className="intro-text-layer">
            <div className={`intro-text ${stage === 1 ? 'visible' : 'hidden'}`}>
              Do you want to remain who you are...
            </div>
            <div className={`intro-text ${(stage >= 3 && stage < 4) ? 'visible' : 'hidden'}`}>
              ...or become the person you've always imagined?
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IntroAnimation;
