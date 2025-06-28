import React from 'react';

const AlphaBanner = () => (
  <div
    style={{
      backgroundColor: '#faad14',
      color: '#000',
      textAlign: 'center',
      padding: '4px 8px',
      fontSize: '12px',
    }}
  >
    This project is in alpha. Found an issue?{' '}
    <a
      href="https://github.com/issues"
      target="_blank"
      rel="noopener noreferrer"
    >
      Report here
    </a>
    .
  </div>
);

export default AlphaBanner;
