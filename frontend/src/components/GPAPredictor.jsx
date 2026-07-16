import React, { useState } from 'react';
import { predictGPA } from '../api/api';

const GPAPredictor = ({ currentCredits, currentGpa }) => {
  const [remainingCredits, setRemainingCredits] = useState('');
  const [targetType, setTargetType] = useState('9.0'); // Default to Excellent
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const targetOptions = [
    { label: 'Excellent (>= 9.0)', value: '9.0' },
    { label: 'Good (>= 8.0)', value: '8.0' },
    { label: 'Fair (>= 7.0)', value: '7.0' },
    { label: 'Average (>= 5.0)', value: '5.0' },
  ];

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!remainingCredits || isNaN(remainingCredits) || Number(remainingCredits) <= 0) {
      setError('Please enter a valid number of credits (> 0)');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const data = await predictGPA({
        current_credits: currentCredits,
        current_gpa: currentGpa,
        remaining_credits: Number(remainingCredits),
        target_gpa: Number(targetType)
      });
      setPrediction(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentCredits === 0) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      <h2 style={{ marginBottom: '16px' }}>GPA Predictor</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Calculate the required score for your remaining subjects to achieve your target GPA.
      </p>

      <form onSubmit={handlePredict} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Remaining Credits</label>
          <input 
            type="number" 
            className="glass-input" 
            placeholder="e.g. 30" 
            value={remainingCredits}
            onChange={(e) => setRemainingCredits(e.target.value)}
            min="1"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem' }}>Target Classification</label>
          <select 
            className="glass-select"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
          >
            {targetOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ height: '48px' }}>
          {isLoading ? 'Calculating...' : 'Predict Now'}
        </button>
      </form>

      {error && (
        <div style={{ marginBottom: '16px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {prediction && (
        <div style={{ 
          padding: '20px', 
          borderRadius: '0px',
          background: prediction.is_possible ? '#baffc9' : '#ffb3ba',
          border: `3px solid var(--border-color)`
        }}>
          <h3 style={{ 
            color: 'var(--text-main)', 
            marginBottom: '8px' 
          }}>
            {prediction.is_possible ? 'Plan is possible!' : 'Target is too difficult!'}
          </h3>
          {/* Note: In a real app we'd translate the backend message too, but for now we just show it. */}
          {/* Since backend returns Vietnamese messages, let's override them based on is_possible to keep UI fully English */}
          <p style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
            {prediction.is_possible 
              ? `You need an average of ${prediction.required_gpa} for the remaining ${remainingCredits} credits.`
              : `Impossible! You need an average of ${prediction.required_gpa}, but the maximum score is 10.0.`}
          </p>
          {prediction.is_possible && prediction.required_gpa > 0 && (
            <div style={{ marginTop: '16px', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              Required: <span className="text-gradient">{prediction.required_gpa}</span> / 10.0
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GPAPredictor;
