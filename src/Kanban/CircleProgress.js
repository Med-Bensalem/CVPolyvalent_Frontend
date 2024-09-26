import React from 'react';

const CircularProgress = ({ score }) => {
    const percentage = Math.min(Math.max(score, 0), 100); // Clamp the score between 0 and 100
    const size = 40; // Change this value to decrease size
    const radius = (size - 4) / 2; // Adjust radius based on strokeWidth
    const strokeWidth = 4; // Keep the stroke width consistent

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e6e6e6"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#4caf50"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${percentage * 2 * Math.PI * radius / 100} ${2 * Math.PI * radius}`}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px' }}>{percentage}%</p> {/* Adjust font size as needed */}
            </div>
        </div>
    );
};

export default CircularProgress;
