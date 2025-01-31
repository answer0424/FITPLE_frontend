import React, { useState, useEffect } from 'react';

const QuizResult = () => {
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const userId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchDetailedResults = async () => {
      try {
        const response = await fetch(`/api/hbti/${userId}/result`);
        if (!response.ok) throw new Error('Failed to fetch detailed results');
        const data = await response.json();
        setResultData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId) {
      fetchDetailedResults();
    }
  }, [userId]);

  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  if (!resultData) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;

  const { hbtiType, percentages, details, topMatches } = resultData;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Your HBTI Type: {hbtiType}
      </h1>

      {/* Percentages Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Your Scores</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '20px' 
        }}>
          {Object.entries(percentages).map(([trait, score]) => (
            <div key={trait} style={{ 
              textAlign: 'center',
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ fontWeight: 'bold' }}>{trait}</div>
              <div style={{ fontSize: '24px' }}>{score.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Type Details Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Your Type Details</h2>
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <img 
            src={details.dogImage} 
            alt={hbtiType}
            style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
          />
          <h3>{details.label}</h3>
          <p>{details.description}</p>
        </div>
      </div>

      {/* Matching Trainers Section */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>Top Matching Trainers</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          {topMatches.map((match, index) => (
            <div key={index} style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <img 
                src={match.details.dogImage} 
                alt={match.hbtiType}
                style={{ maxWidth: '100%', height: 'auto', marginBottom: '15px' }}
              />
              <h3 style={{ marginBottom: '10px' }}>{match.details.label}</h3>
              <div>Match Score: {match.score}%</div>
              <div>Type: {match.hbtiType}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;