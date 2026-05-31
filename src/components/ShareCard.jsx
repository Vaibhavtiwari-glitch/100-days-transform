import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './ShareCard.css';

const ShareCard = ({ goal, day, percent }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#141414',
        scale: 3, 
        logging: false,
        useCORS: true
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement('a');
      link.download = '100-Day-Transformation.png';
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error generating share card:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card share-card animate-fade-in delay-600">
      <h2 className="text-secondary text-sm share-label">SHARE PROGRESS</h2>
      
      <div className="share-preview" ref={cardRef} style={{ padding: '24px', margin: '-24px', marginBottom: '20px' }}>
        <div className="share-header">
          <div className="share-streak">🔥 DAY {day} / 100</div>
        </div>
        
        <div className="share-body">
          <div className="share-goal-label text-secondary text-xs">GOAL</div>
          <div className="share-goal-title">{goal}</div>
        </div>
        
        <div className="share-footer">
          <div className="share-percent text-accent">{percent}% Complete</div>
          <div className="share-logo">100-DAY TRANSFORMATION</div>
        </div>
      </div>
      
      <button className="share-btn" onClick={handleShare} disabled={isGenerating}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="share-icon">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
        {isGenerating ? 'Generating...' : 'Generate Share Card'}
      </button>
    </div>
  );
};

export default ShareCard;
