interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className = '' }: SpinnerProps) => {
  return (
    <svg 
      width="19" 
      height="19" 
      viewBox="0 0 38 38" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`ml-2 ${className}`}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle 
            stroke="rgba(255, 255, 255, 0.2)"
            cx="18" 
            cy="18" 
            r="18" 
          />
          <path 
            d="M36 18c0-9.94-8.06-18-18-18" 
            stroke="#FFFFFF"
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

export default Spinner;