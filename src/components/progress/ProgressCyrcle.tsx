import React from 'react';

interface ProgressCyrcleProps {
  color?: string;
  size?: number;
  percentage: number;
}

function ProgressCyrcle({
  color = 'text-primary',
  size = 24,
  percentage = 0,
}: ProgressCyrcleProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <circle
          className="text-gray-300"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          cx="18"
          cy="18"
          r="16"
          strokeDasharray={percentage === 0 ? '20 5' : '0'} /* Dashed only if percentage is 0 */
        />
        <circle
          className={color}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          cx="18"
          cy="18"
          r="16"
          strokeDasharray="100 100"
          strokeDashoffset={isNaN(100 - percentage) ? 0 : 100 - percentage}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs"></div>
    </div>
  );
}

export default ProgressCyrcle;
