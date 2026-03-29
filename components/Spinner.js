'use client';

export default function Spinner({ fullScreen = false, size = 'md' }) {
  if (fullScreen) {
    return (
      <div className="spinner-overlay">
        <div className="spinner"></div>
      </div>
    );
  }
  return <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`}></div>;
}
