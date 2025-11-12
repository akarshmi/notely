// DailyQuotesCard.js
import React from 'react';
import './DailyQuotesCard.css'; // Import the CSS file

const DailyQuotesCard = () => {
    const quotes = [
        { text: "Sometimes, the best way to finish a sentence is to start a new one. ✍️", author: "Unknown" },
        { text: "Don't be afraid to be a beginner. It's how you start that matters. 🚀", author: "Unknown" },
        { text: "Your first draft is just a tool to help you get to the good stuff. Don’t be too hard on it. 📝", author: "Unknown" },
        { text: "Take notes like nobody's going to read them. That’s where the magic happens. 🤫", author: "Unknown" },
        { text: "A pen can be mightier than a keyboard if you remember to use it. 🖊️", author: "Unknown" },
        { text: "Remember, no idea is too silly. It might just be your best note yet! 🤪", author: "Unknown" },
        { text: "Procrastination is just a way of storing up notes for later use. 😅", author: "Unknown" },
        { text: "The best notes come when your brain is still waking up. That's when the good stuff happens. ☕💡", author: "Unknown" },
        { text: "You can never have too many notes. Just ask your future self. 📚", author: "Unknown" },
        { text: "Take notes like a ninja — stealthy but impactful! 🥷", author: "Unknown" },
        { text: "A note today is a reminder tomorrow. ⏰", author: "Unknown" },
        { text: "Great ideas are like paper airplanes — they need the right note to soar. ✈️", author: "Unknown" },
        { text: "Don’t just take notes, make them into a story. 📖", author: "Unknown" },
        { text: "If you're not taking notes, are you even learning? 🤔", author: "Unknown" },
        { text: "A notebook is where your ideas go to grow. 🌱", author: "Unknown" },
        { text: "The more notes you take, the fewer regrets you’ll have later. 🤷‍♂️", author: "Unknown" },
        { text: "Take notes that inspire action, not just reflection. 🚶‍♀️💭", author: "Unknown" },
        { text: "Your notes are your ideas in motion. Don’t let them sit still! 🔄", author: "Unknown" },
        { text: "The best notes are often the messy ones — they hold the magic. ✨", author: "Unknown" },
        { text: "Don’t wait for inspiration. Take notes and let it find you. ✨💡", author: "Unknown" },
        { text: "When in doubt, write it down. ✍️", author: "Unknown" },
        { text: "Every note you take is a step closer to your next big idea. 🏃‍♂️💭", author: "Unknown" },
        { text: "Even the smallest note can lead to the biggest breakthrough. 🌍", author: "Unknown" },
        { text: "Note-taking isn’t about perfection; it’s about capturing potential. 🎯", author: "Unknown" },
        { text: "The art of note-taking is knowing when to stop and when to start. 🖋️🛑", author: "Unknown" }
      ];
      

  // Duplicate quotes array to create a seamless loop effect
  const duplicatedQuotes = [...quotes, ...quotes];

  return (
    <div className="daily-quotes-card">
      <div className="card-content">
        <h2 className="card-title">Fun Facts</h2>
        
        <div className="marquee-container">
          <div className="marquee-content">
            {duplicatedQuotes.map((quote, index) => (
              <div key={index} className="quote-item">
                <span className="quote-text">"{quote.text}"</span>
                <span className="quote-author"> — {quote.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuotesCard;