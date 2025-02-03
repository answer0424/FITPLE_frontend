import React from 'react';
import TrainerMatchList from '../components/TrainerMatchList';
import { useParams } from 'react-router-dom';

const MatchPage = () => {
  const { userId } = useParams();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Matching Trainers</h1>
      <TrainerMatchList userId={userId} />
    </div>
  );
};

export default MatchPage;