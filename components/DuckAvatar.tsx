import React from 'react';

interface DuckAvatarProps {
    size?: number;
}

const DuckAvatar: React.FC<DuckAvatarProps> = ({ size = 40 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
            {/* Main Head/Background */}
            <circle cx="50" cy="50" r="50" fill="#FFD639" />

            {/* Eyes */}
            <circle cx="35" cy="40" r="8" fill="#2D2D2D" />
            <circle cx="65" cy="40" r="8" fill="#2D2D2D" />

            {/* Cheeks */}
            <circle cx="22" cy="65" r="12" fill="#FFC900" />
            <circle cx="78" cy="65" r="12" fill="#FFC900" />

            {/* Beak */}
            <path 
                d="M 42 60 C 40 68, 60 68, 58 60 C 59 55, 41 55, 42 60 Z" 
                fill="#FF9F4A"
                stroke="#E88D34"
                strokeWidth="1.5"
            />
        </svg>
    );
};

export default DuckAvatar;
