import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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

  if (error) return (
    <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
      Error: {error}
    </div>
  );
  
  if (!resultData) return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      Loading...
    </div>
  );

  const { hbtiType, percentages, details, topMatches } = resultData;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {details && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
            <h1 style={{ marginBottom: '30px' }}>
              나의 HBTI는<br />
              {hbtiType}
            </h1>
            {details.dogImage && (
              <img 
                src={`${import.meta.env.VITE_Server}${details.dogImage}`}
                alt={hbtiType}
                style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
              />
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: '20px' }}>Percentage</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '20px' 
            }}>
              {Object.entries(percentages || {}).map(([trait, score]) => (
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
            <h2 style={{ marginBottom: '20px' }}>{details.label}</h2>
            <h4>{details.fullDescription}</h4>
          </div>
        </div>
      )}

      {topMatches && topMatches.length > 0 && (
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
                {match.details?.dogImage && (
                  <img 
                    src={`${import.meta.env.VITE_Server}${match.details.dogImage}`}
                    alt={match.hbtiType}
                    style={{ maxWidth: '100%', height: 'auto', marginBottom: '15px' }}
                  />
                )}
                <h3 style={{ marginBottom: '10px' }}>{match.details?.label} 선생님과 함께 운동을 시작해보아요!</h3>
                <div>{match.score}%</div>
                <div>{match.hbtiType}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResult;