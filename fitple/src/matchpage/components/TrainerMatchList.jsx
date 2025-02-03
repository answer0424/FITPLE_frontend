import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const TrainerMatchList = ({ userId, hbtiTypes }) => {
  const [trainers, setTrainers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchingTrainers = async () => {
      try {
        const token = Cookies.get('accessToken');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(
          `${import.meta.env.VITE_Server}/api/quiz/${userId}/result/match?hbti=${hbtiTypes.join(',')}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch matching trainers');
        }

        const data = await response.json();
        setTrainers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId && hbtiTypes.length > 0) {
      fetchMatchingTrainers();
    }
  }, [userId, hbtiTypes]);

  if (error) return (
    <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
      Error: {error}
    </div>
  );
  
  if (!trainers) return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      Loading...
    </div>
  );

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px'
    }}>
      {trainers.map(trainer => (
        <div key={trainer.trainerId} style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {trainer.profileImage && (
            <img 
              src={trainer.profileImage} 
              alt={trainer.trainerName}
              style={{ 
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                marginBottom: '15px',
                objectFit: 'cover'
              }}
            />
          )}
          <h3 style={{ marginBottom: '10px' }}>{trainer.trainerName}</h3>
          <p>Nickname: {trainer.nickname}</p>
          <p>HBTI: {trainer.hbti}</p>
          <p>Gym: {trainer.gymName}</p>
        </div>
      ))}
    </div>
  );
};

export default TrainerMatchList;