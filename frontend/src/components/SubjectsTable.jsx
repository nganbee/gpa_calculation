import React from 'react';

const SubjectsTable = ({ subjects, currentGpa, totalCredits }) => {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>Subject List</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: '#ffb3ba', border: '3px solid var(--border-color)', padding: '8px 16px', borderRadius: '0px', boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Total Credits</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalCredits}</div>
          </div>
          <div style={{ background: '#baffc9', border: '3px solid var(--border-color)', padding: '8px 16px', borderRadius: '0px', boxShadow: '4px 4px 0px 0px var(--shadow-color)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Current GPA (10-scale)</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{currentGpa}</div>
          </div>
        </div>
      </div>

      <div className="glass-table-wrapper">
        <table className="glass-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Subject</th>
              <th>Credits</th>
              <th>Score (10-scale)</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sub['Môn học']}</td>
                <td>{sub['Số tín chỉ']}</td>
                <td>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: sub['Điểm'] >= 8 ? '#047857' : 
                           sub['Điểm'] >= 5 ? 'var(--text-main)' : '#b91c1c' 
                  }}>
                    {sub['Điểm']}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectsTable;
