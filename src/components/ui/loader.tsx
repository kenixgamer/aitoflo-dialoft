interface SpinnerProps {
  variant?: 'dark' | 'light' | 'blue';
  className?: string;
}

const Spinner = ({ variant = 'dark', className = '' }: SpinnerProps) => {
  const styles = {
    dark: {
      circle: 'rgba(255, 255, 255, 0.2)',
      path: '#FFFFFF'
    },
    light: {
      circle: '#374151',
      path: '#3B82F6'
    },
    blue: {
      circle: 'rgba(255, 255, 255, 0.2)',
      path: '#FFFFFF'
    }
  };

  const currentStyle = styles[variant];

  return (
    <svg 
      width="38" 
      height="38" 
      viewBox="0 0 38 38" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`ml-2 ${className}`}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle 
            stroke={currentStyle.circle} 
            strokeOpacity={variant === 'light' ? "0.25" : "1"} 
            cx="18" 
            cy="18" 
            r="18" 
          />
          <path 
            d="M36 18c0-9.94-8.06-18-18-18" 
            stroke={currentStyle.path}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
};

export default Spinner