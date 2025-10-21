import React from 'react';

const Logo = ({ className = "", size = "default" }) => {
  const sizeClasses = {
    small: "w-16 h-16",
    default: "w-20 h-20", 
    large: "w-32 h-32"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 220 220" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background */}
        <rect width="220" height="220" rx="40" fill="#191414"/>

        {/* Equalizer bars (centered group) */}
        <g transform="translate(55,45)">
          <rect x="0" y="45" width="10" height="40" rx="3" fill="#1DB954"/>
          <rect x="22" y="25" width="10" height="80" rx="3" fill="#1DB954"/>
          <rect x="44" y="35" width="10" height="60" rx="3" fill="#1DB954"/>
          <rect x="66" y="15" width="10" height="100" rx="3" fill="#1DB954"/>
          <rect x="88" y="40" width="10" height="50" rx="3" fill="#1DB954"/>
        </g>

        {/* Text */}
        <text 
          x="50%" 
          y="192" 
          textAnchor="middle"
          fontFamily="Poppins, Inter, sans-serif"
          fontSize="26" 
          fontWeight="600"
          fill="#FFFFFF" 
          letterSpacing="1"
        >
          Stalify
        </text>
      </svg>
    </div>
  );
};

export default Logo;
