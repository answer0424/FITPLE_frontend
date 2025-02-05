import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './QuizResult.css';

const QuizResult = () => {
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

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

  if (error) return <div className="error-message">Error: {error}</div>;
  if (!resultData) return <div className="loading">Loading...</div>;

  const { hbtiType, percentages, details, topMatches } = resultData;

  return (
    <div className="quiz-result-container">
      {details && (
        <div className="details-section">
          
          {/* [1] */}
          <div className="hbti-header">
            <h1>
              나의 HBTI는<br />
              {hbtiType}
            </h1>
            {details.dogImage && (
              <img 
                src={`${import.meta.env.VITE_Server}${details.dogImage}`}
                alt={hbtiType}
                className="dog-image"
              />
            )}
          </div>

          <div className="result-content">

            {/* [2] */}
            <h2>Percentage</h2>
            <div className="percentages-grid">
              {Object.entries(percentages || {}).map(([trait, score]) => (
                <div key={trait} className="percentage-card">
                  <div className="trait">{trait}</div>
                  <div className="score">{score.toFixed(1)}%</div>
                </div>
              ))}
            </div>

            {/* [3] */}
            <h2>{details.label}</h2>
            <h4>{details.fullDescription}</h4>
          </div>
        </div>
      )}

      {topMatches && topMatches.length > 0 && (
        <div className="matches-section">
          <h2>Top Matching Trainers</h2>
          <div className="matches-grid">
            {topMatches.map((match, index) => (
              <div key={index} className="match-card">
                {match.details?.dogImage && (
                  <img 
                    src={`${import.meta.env.VITE_Server}${match.details.dogImage}`}
                    alt={match.hbtiType}
                    className="match-image"
                  />
                )}
                <h3>{match.details?.label} 선생님과 함께 운동을 시작해보아요!</h3>
                <div className="match-score">{match.score}%</div>
                <div className="match-type">{match.hbtiType}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-button-container">
        <button
          onClick={() => navigate(`/quiz/${userId}/result/match`, {
            state: { hbtiTypes: [hbtiType] }
          })}
          className="match-button"
        >
          트레이너 매칭하기
        </button>
      </div>
    </div>
  );
};

export default QuizResult;