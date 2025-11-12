// Card.js
import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const Card = ({ title, message, icon, primaryAction, secondaryAction, variant = 'diagonal' }) => {
  return (
    <StyledWrapper variant={variant}>
      <div className="brutalist-card">
        <div className="brutalist-card__header">
          <div className="brutalist-card__icon">{icon}</div>
          <div className="brutalist-card__alert">{title}</div>
        </div>
        <div className="brutalist-card__message">{message}</div>
        <div className="brutalist-card__actions">
          {primaryAction && (
            <a className="brutalist-card__button brutalist-card__button--mark" href={primaryAction.link}>
              {primaryAction.label}
            </a>
          )}
          {secondaryAction && (
            <a className="brutalist-card__button brutalist-card__button--read" href={secondaryAction.link}>
              {secondaryAction.label}
            </a>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default Card;

// Animations
const gradientDiagonal = keyframes`
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
`;

const gradientWave = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 75%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 25%; }
  100% { background-position: 0% 50%; }
`;

const gradientSpin = keyframes`
  0% { background-position: 0% 0%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
`;

const getAnimation = (variant) => {
  switch (variant) {
    case 'wave':
      return css`${gradientWave} 8s ease infinite`;
    case 'spin':
      return css`${gradientSpin} 10s ease infinite`;
    case 'diagonal':
    default:
      return css`${gradientDiagonal} 8s ease infinite`;
  }
};

// Styled Component
const StyledWrapper = styled.div`




  ${({ variant }) => css`
    .brutalist-card {
      position: relative;
      width: 320px;
      background-color: #f8f9fa;  // Lighter background color
      padding: 1.5rem;
      font-family: "Arial", sans-serif;
      transition: transform 0.2s ease;
      z-index: 1;
      border-radius: 0.5rem;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);  // Lighter, softer shadow
    }

    .brutalist-card::before {
      content: "";
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      background: linear-gradient(270deg, #ff99cc, #a3b9ff, #c1c8e4, #ff99cc);  // Light pastel gradient
      background-size: 600% 600%;
      z-index: -1;
      border-radius: 0.5rem;
      animation: ${getAnimation(variant)};
    }

    .brutalist-card:hover {
      transform: translateY(-5px);
      box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);  // Subtle hover shadow
    }

    .brutalist-card__header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e2e2e2;  // Lighter border color
      padding-bottom: 1rem;
    }

    .brutalist-card__icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e2e2e2;  // Lighter icon background
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 1.25rem;
      color: #fff;
      width: 2.5rem;
      height: 2.5rem;
    }

    .brutalist-card__alert {
      font-weight: 900;
      color: #333;  // Darker text color for readability
      font-size: 1.5rem;
      text-transform: uppercase;
    }

    .brutalist-card__message {
      margin-top: 1rem;
      color: #555;  // Slightly lighter text color for message
      font-size: 0.95rem;
      line-height: 1.4;
      border-bottom: 2px solid #e2e2e2;
      padding-bottom: 1rem;
      font-weight: 500;
    }

    .brutalist-card__actions {
      margin-top: 1rem;
    }

    .brutalist-card__button {
      display: block;
      width: 90%;
      padding: 0.75rem;
      text-align: center;
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      border: 3px solid #e2e2e2;  // Lighter border for buttons
      background-color: #fff;
      color: #333;  // Darker text for better readability
      position: relative;
      transition: all 0.2s ease;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      text-decoration: none;
      margin-bottom: 1rem;
    }

    .brutalist-card__button::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        120deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: all 0.6s;
    }

    .brutalist-card__button:hover::before {
      left: 100%;
    }

    .brutalist-card__button:hover {
      transform: translate(-2px, -2px);
      box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.15);
    }

    .brutalist-card__button:active {
      transform: translate(5px, 5px);
      box-shadow: none;
    }
  `}
`;

