import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import HBTIResultDisplay from '../components/quiz_common/HbtiResultDisplay';
import './QuizResult.css';

// Progress Bar Component
const ProgressBar = ({ progress }) => (
  <div className="progress-bar-container">
    <div 
      className="progress-bar"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Circle Progress Component
const CircleProgress = ({ percentage }) => {
  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circle-progress">
      <svg className="circle-progress-svg">
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="#f5f5f5"
          strokeWidth="8"
          fill="none"
          className="circle-bg"
        />
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="#EE8989"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className="circle-progress-bar"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset
          }}
        />
      </svg>
      <span className="circle-progress-text">
        {percentage}%
      </span>
    </div>
  );
};

// Updated PercentageDisplay component
const traitPairs = {
  'M': { opposite: 'B', label: '의료적/미용적' },
  'I': { opposite: 'E', label: '즉흥형/계획형' },
  'C': { opposite: 'N', label: '유산소형/근력형' },
  'P': { opposite: 'G', label: '개인형/단체형' }
};

const TraitBar = ({ trait, score }) => {
  const opposite = traitPairs[trait]?.opposite;
  const label = traitPairs[trait]?.label;
  const [leftTrait, rightTrait] = label?.split('/') || [];
  
  // Determine which trait is dominant
  const isFirstTraitDominant = score > 50;
  const dominantScore = isFirstTraitDominant ? score : 100 - score;

  return (
    <div className="trait-bar-container">
      {/* Top labels with scores */}
      <div className="trait-scores">
        <span className={`trait-score ${isFirstTraitDominant ? 'dominant' : ''}`}>
          {score}%
        </span>
        <span className={`trait-score ${!isFirstTraitDominant ? 'dominant' : ''}`}>
          {(100 - score).toFixed(1)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="trait-bar-wrapper">
        <span className="trait-label left">{leftTrait}</span>
        <div className="trait-bar">
          <div 
            className={`trait-progress ${isFirstTraitDominant ? 'left' : 'right'}`}
            style={{ 
              width: `${dominantScore}%`,
              left: isFirstTraitDominant ? '0' : 'auto',
              right: isFirstTraitDominant ? 'auto' : '0'
            }}
          />
        </div>
        <span className="trait-label right">{rightTrait}</span>
      </div>

      {/* Trait letters */}
      <div className="trait-letters">
        <span className={`trait-letter ${isFirstTraitDominant ? 'dominant' : ''}`}>
          {trait}
        </span>
        <span className={`trait-letter ${!isFirstTraitDominant ? 'dominant' : ''}`}>
          {opposite}
        </span>
      </div>
    </div>
  );
};

const PercentageDisplay = ({ percentages }) => {
  // Sort the traits to maintain consistent order: M/B, I/E, C/N, P/G
  const orderedTraits = ['M', 'I', 'C', 'P'];
  
  return (
    <div className="percentages-section">
      <h2>나의 운동 성향</h2>
      <div className="percentages-grid">
        {orderedTraits.map(trait => (
          <TraitBar 
            key={trait} 
            trait={trait} 
            score={percentages[trait] || 0} 
          />
        ))}
      </div>
    </div>
  );
};

// Description Display Component
const DescriptionDisplay = ({ details }) => (
  <div className="description-section">
    <h2>{details.label}</h2>
    <p>{details.fullDescription}</p>
  </div>
);

// Match Card Component
const MatchCard = ({ match }) => (
  <div className="match-card">
    {match.details?.dogImage && (
      <img 
        src={`${import.meta.env.VITE_Server}${match.details.dogImage}`}
        alt={match.hbtiType}
        className="match-image"
      />
    )}
    <h3>{match.details?.label} 선생님과 함께 운동을 시작해보아요!</h3>
    <div className="match-info">
      <CircleProgress percentage={match.score} />
      <div className="match-type">
        <div>{match.hbtiType}</div>
      </div>
    </div>
  </div>
);

// Matches Display Component
const MatchesDisplay = ({ topMatches }) => (
  <div className="matches-section">
    <h2>Top Matching Trainers</h2>
    <div className="matches-grid">
      {topMatches.map((match, index) => (
        <MatchCard key={index} match={match} />
      ))}
    </div>
  </div>
);

// Navigation Button Component
const NavigationButton = ({ direction, onClick, children }) => (
  <button
    onClick={onClick}
    className={`nav-button ${direction}-button`}
  >
    {children}
  </button>
);

// Main Component
const QuizResult = () => {
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPanel, setCurrentPanel] = useState(1); // 1: Percentage, 2: Description, 3: Matches
  const { userId } = useParams();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch results data
  useEffect(() => {
    const fetchDetailedResults = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await fetch(`${import.meta.env.VITE_Server}/api/hbti/${userId}/result`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 302) {
          throw new Error('Please log in to view your results');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch detailed results');
        }
        
        const data = await response.json();
        setResultData(data);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message);
      }
    };

    if (userId) {
      fetchDetailedResults();
    }
  }, [userId]);

  // Loading and error states
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!resultData) return <div className="loading">Loading...</div>;

  const { hbtiType, percentages, details, topMatches } = resultData;

  // Navigation handlers
  const handleNext = () => {
    setCurrentPanel(prev => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentPanel(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="quiz-result-container">
      <div className="result-content-box">
        <div className="panel-layout">
          {/* Left Panel */}
          <div className="left-panel">
            <HBTIResultDisplay 
              hbtiData={{ 
                hbtiType, 
                details,
                dogImage: details?.dogImage 
              }} 
            />
          </div>
          
          {/* Right Panel */}
          <div className="right-panel">
            {currentPanel === 1 && (
              <>
                <PercentageDisplay percentages={percentages} />
                <NavigationButton direction="next" onClick={handleNext}>
                  다음
                </NavigationButton>
              </>
            )}
            
            {currentPanel === 2 && (
              <>
                <NavigationButton direction="prev" onClick={handlePrevious}>
                  이전
                </NavigationButton>
                <DescriptionDisplay details={details} />
                <NavigationButton direction="next" onClick={handleNext}>
                  다음
                </NavigationButton>
              </>
            )}
            
            {currentPanel === 3 && (
              <>
                <NavigationButton direction="prev" onClick={handlePrevious}>
                  이전
                </NavigationButton>
                <MatchesDisplay topMatches={topMatches} />
                <div className="match-button-container">
                  <button
                    onClick={() => navigate(`/quiz/${userId}/result/match`, {
                      state: { hbtiTypes: [hbtiType] }
                    })}
                    className="match-button"
                  >
                    트레이너 매칭하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;