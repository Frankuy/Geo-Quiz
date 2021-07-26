import React from 'react';

const Score = ({ score }) => {
    const top = innerWidth <= 740 ? 64 : 80;
    const left = 60;
    const radius = innerWidth <= 740 ? 32 : 40;
    const fontSize = innerWidth <= 740 ? 24 : 32;

    return (
        <g transform={`translate(${left}, ${top})`}>
            <circle
                r={radius}
                fill={'#2E8CB2'}
                stroke={'white'}
                strokeWidth={2}
            />
            <text
                fontSize={fontSize}
                fill={'white'}
                textAnchor="middle"
                dominantBaseline="middle"
                dy="2"
            >
                {score}
            </text>
        </g>
    );
}

export default Score;