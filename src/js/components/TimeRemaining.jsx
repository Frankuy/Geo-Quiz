import React from 'react';
import { interpolateRgb } from 'd3';

const TimeRemaining = ({ time, maxTime }) => {
    const height = 12;

    return (
        <g>
            <rect height={height} fill="white" width={innerWidth}></rect>
            { window.innerWidth * (time / maxTime) >= 0 &&
                <rect
                    height={height}
                    fill={time > 10000 ? "#1DA2D8" : interpolateRgb("#1DA2D8", "red")((10000 - time) / 10000)}
                    width={window.innerWidth * (time / maxTime) + 'px'}
                >
                </rect>
            }
        </g>
    );
}

export default TimeRemaining;