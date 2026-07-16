import React, { useState } from 'react';
import { calculateGPA } from './api/api';
import FileUploader from './components/FileUploader';
import SubjectsTable from './components/SubjectsTable';
import GPAPredictor from './components/GPAPredictor';
import './index.css';

function App() {
  const [gpaData, setGpaData] = useState({
    totalCredits: 0,
    currentGpa: 0,
    subjects: []
  });

  const handleUploadSuccess = async (file) => {
    const data = await calculateGPA(file);
    setGpaData({
      totalCredits: data.total_credits,
      currentGpa: data.current_gpa,
      subjects: data.subjects
    });
  };

  return (

    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in">
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>
          GPA Master
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          Smart GPA Calculation & Prediction System
        </p>
      </header>

      <main>
        <FileUploader onUploadSuccess={handleUploadSuccess} />
        
        {gpaData.totalCredits > 0 && (
          <>
            <GPAPredictor 
              currentCredits={gpaData.totalCredits} 
              currentGpa={gpaData.currentGpa} 
            />
            <SubjectsTable 
              subjects={gpaData.subjects} 
              currentGpa={gpaData.currentGpa} 
              totalCredits={gpaData.totalCredits} 
            />
          </>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
        <p>© 2026 - Retro Pixel Art Design</p>
      </footer>
    </div>
  )
}

export default App
