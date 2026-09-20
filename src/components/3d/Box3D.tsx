import React from 'react';

interface Box3DProps {
  width: number;
  height: number;
  depth: number;
  className?: string;
  faceClassName?: string;
  topContent?: React.ReactNode;
  frontContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

export const Box3D: React.FC<Box3DProps> = ({
  width,
  height,
  depth,
  className = '',
  faceClassName = 'bg-slate-900/90 border border-sky-500/20',
  topContent,
  frontContent,
  leftContent,
  rightContent,
  onClick,
  ariaLabel,
}) => {
  const hw = width / 2;
  const hh = height / 2;
  const hd = depth / 2;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front Face */}
      <div
        className={`absolute inset-0 flex flex-col justify-center items-center overflow-hidden transition-colors ${faceClassName}`}
        style={{
          transform: `translateZ(${hd}px)`,
          backfaceVisibility: 'hidden',
        }}
      >
        {frontContent}
      </div>

      {/* Back Face */}
      <div
        className={`absolute inset-0 flex flex-col justify-center items-center overflow-hidden ${faceClassName}`}
        style={{
          transform: `rotateY(180deg) translateZ(${hd}px)`,
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Top Face */}
      <div
        className={`absolute left-0 top-0 flex flex-col justify-center items-center overflow-hidden ${faceClassName}`}
        style={{
          width: `${width}px`,
          height: `${depth}px`,
          transform: `rotateX(90deg) translateZ(${hd}px) translateY(${hd - hh}px)`,
          backfaceVisibility: 'hidden',
        }}
      >
        {topContent}
      </div>

      {/* Bottom Face */}
      <div
        className={`absolute left-0 bottom-0 ${faceClassName}`}
        style={{
          width: `${width}px`,
          height: `${depth}px`,
          transform: `rotateX(-90deg) translateZ(${height - hd}px) translateY(${hh - hd}px)`,
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Left Face */}
      <div
        className={`absolute left-0 top-0 flex flex-col justify-center items-center overflow-hidden ${faceClassName}`}
        style={{
          width: `${depth}px`,
          height: `${height}px`,
          transform: `rotateY(-90deg) translateZ(${hd}px) translateX(${hd - hw}px)`,
          backfaceVisibility: 'hidden',
        }}
      >
        {leftContent}
      </div>

      {/* Right Face */}
      <div
        className={`absolute right-0 top-0 flex flex-col justify-center items-center overflow-hidden ${faceClassName}`}
        style={{
          width: `${depth}px`,
          height: `${height}px`,
          transform: `rotateY(90deg) translateZ(${width - hd}px) translateX(${hd - hw}px)`,
          backfaceVisibility: 'hidden',
        }}
      >
        {rightContent}
      </div>
    </div>
  );
};
