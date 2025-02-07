import React from "react";
import "./PanelNavigation.css";

const PanelNavigation = ({
  currentPanel,
  totalPanels,
  onNext,
  onPrevious,
  showNext = true,
  showPrevious = true,
  className = "",
  nextButtonContent,
  previousButtonContent,
}) => {
  return (
    <div className={`panel-navigation ${className}`}>
      {showPrevious && currentPanel > 1 && (
        <button
          onClick={onPrevious}
          className="nav-button prev-button"
          aria-label="Previous panel"
        >
          {previousButtonContent || (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      {showNext && currentPanel < totalPanels && (
        <button
          onClick={onNext}
          className="nav-button next-button"
          aria-label="Next panel"
        >
          {nextButtonContent || (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default PanelNavigation;
