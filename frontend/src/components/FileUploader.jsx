import React, { useState } from 'react';

const FileUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Please select a CSV or Excel file (.xlsx, .xls)');
      }
    }
  };

  const handleCalculate = async () => {
    if (!file) {
      setError('You haven\'t selected a file yet!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onUploadSuccess(file);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during calculation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <h2 style={{ marginBottom: '16px' }}>Upload Transcript</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        Supports CSV or Excel files with columns: Subject Name, Credits, Score.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }} 
            onChange={handleFileChange}
            accept=".csv, .xlsx, .xls"
          />
          <label htmlFor="file-upload" className="btn btn-secondary" style={{ width: '100%' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {file ? file.name : 'Select File (CSV/Excel)'}
          </label>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={handleCalculate} 
          disabled={isLoading || !file}
        >
          {isLoading ? 'Calculating...' : 'Calculate GPA'}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '16px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
