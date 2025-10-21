import React from 'react';

const Logo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "w-24 h-6",
    default: "w-32 h-8", 
    large: "w-40 h-10"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 400 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <text 
          x="50%" 
          y="60%" 
          textAnchor="middle"
          fontFamily="Poppins, sans-serif"
          fontSize="48" 
          fontWeight="700"
          fill="#1DB954" 
          letterSpacing="2"
        >
          Stalify
        </text>
      </svg>
    </div>
  );
};

export default Logo;
