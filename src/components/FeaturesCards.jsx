// FeatureCards.js
import React from 'react';
import Card from './Card';
import DailyQuotesCard from './DailyQuotesCard';
import './FeaturesCards.css';

const FeatureCards = () => {
  return (
    <div id="features" className="features-container">
    
      <div className="quotes-wrapper">
        <DailyQuotesCard />
      </div>
  <div className="cards-grid">
        <Card
          title="Notes"
          message="Capture thoughts, ideas, or to-dos in seconds—organized and always accessible."
          icon={<span role="img" aria-label="note">📝</span>}
          primaryAction={{ label: "Start Writing", link: "/login" }}
          variant="diagonal"
        />
        <Card
          title="Time Capsules"
          message="Write something now, open it later. Perfect for future reflections."
          icon={<span role="img" aria-label="time-capsule">⏳</span>}
          primaryAction={{
            label: "Create Capsule",
            link: "/login",
            onClick: (e) => {
              e.preventDefault();
              alert("Coming soon! We're working on this feature! ⏳");
            }
          }}
          variant="wave"
        />
        <Card
          title="Confessions"
          message="Say what you can't out loud. Private, honest, and judgment-free."
          icon={<span role="img" aria-label="confession">🤐</span>}
          primaryAction={{ label: "Confess Now", link: "#" }}
          variant="spin"
        />
      </div>
    </div>
  );
};

export default FeatureCards;