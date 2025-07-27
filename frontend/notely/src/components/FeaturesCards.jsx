// FeatureCards.js
import React from 'react';
import Card from './Card'; 
import DailyQuotesCard from './DailyQuotesCard'; 

const FeatureCards = () => {
  return (



    
    <div id="features" style={{
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '3rem',
      height: '85vh',
      display: 'flex',
      columnGap: '4rem',
      // gap: '4rem',
      alignItems: 'center',
      width: '100%',
      '--color': 'rgba(114, 114, 114, 0.3)',
      backgroundImage: `linear-gradient(
        0deg,
        transparent 24%,
        var(--color) 25%,
        var(--color) 26%,
        transparent 27%,
        transparent 74%,
        var(--color) 75%,
        var(--color) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        var(--color) 25%,
        var(--color) 26%,
        transparent 27%,
        transparent 74%,
        var(--color) 75%,
        var(--color) 76%,
        transparent 77%,
        transparent
      )`,
      backgroundSize: '55px 55px'
    }}>
      {/* Container for quotes card with full width */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '2rem',
        padding: '0 1rem'
      }}>
        <DailyQuotesCard />
      </div>

      {/* Original feature cards */}
      <Card
        title="Notes"
        message="Capture thoughts, ideas, or to-dos in seconds—organized and always accessible."
        icon={<span role="img" aria-label="note">📝</span>}
        primaryAction={{ label: "Start Writing", link: "/login" }}
        variant="diagonal"  // Light variant
      />
      <Card
        title="Time Capsules"
        message="Write something now, open it later. Perfect for future reflections."
        icon={<span role="img" aria-label="time-capsule">⏳</span>}
        primaryAction={{
          label: "Create Capsule", link: "/login",
          onClick: (e) => {
      e.preventDefault(); // Prevent navigation
      alert("Coming soon! We're working on this feature! ⏳");
    }
        }}
        variant="wave"  // Light variant
      />
      <Card
        title="Confessions"
        message="Say what you can't out loud. Private, honest, and judgment-free."
        icon={<span role="img" aria-label="confession">🤐</span>}
        primaryAction={{ label: "Confess Now", link: "#" }}
        variant="spin"  // Light variant
      />
    </div>
  );
};

export default FeatureCards;