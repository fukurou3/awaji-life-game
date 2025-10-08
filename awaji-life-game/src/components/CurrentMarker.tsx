import React from 'react';

interface CurrentMarkerProps {
  isVisible: boolean;
  isMoving: boolean;
  className?: string;
}

export const CurrentMarker: React.FC<CurrentMarkerProps> = ({
  isVisible,
  isMoving,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`
        absolute inset-0 pointer-events-none transition-all duration-200
        ${isMoving ? 'animate-pulse' : 'animate-pulse'}
        ${className}
      `}
    >
      {/* グロー効果 */}
      <div className="absolute inset-0 bg-emerald-400 rounded-lg opacity-30 blur-sm" />

      {/* ピン */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        {/* ピンの針 */}
        <div className="w-0.5 h-2 bg-emerald-500 mx-auto" />
      </div>

      {/* 波紋エフェクト */}
      <div className="absolute inset-0 rounded-lg border-2 border-emerald-400 animate-ping opacity-75" />
    </div>
  );
};