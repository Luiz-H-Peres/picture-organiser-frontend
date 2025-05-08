import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Button = ({ onclick, title, children, href, variations = 'primary', className, disabled, ...props }) => {

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
 
    const handleClick = useCallback(async () => {    
      if(disabled) {
        return;
      }

      setIsLoading(true);    
      
      if(onclick instanceof Promise) {
        await onclick();
      } else {
        onclick?.();
      }

      if(href) {
        navigate(href);
      }
      setIsLoading(false);
    }, [onclick, href, navigate, disabled]);

    const variationsClasses = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        success: 'bg-green-500 hover:bg-green-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        info: 'bg-blue-500 hover:bg-blue-600 text-white',
        light: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        dark: 'bg-gray-800 hover:bg-gray-900 text-white',
        link: 'text-blue-500 hover:text-blue-600',
        outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    }

  return (
    <button
    onClick={handleClick}
    className={`flex gap-2 justify-center items-center px-6 py-3 mt-4 rounded-md transition duration-300 ${variationsClasses[disabled ? 'secondary' : variations]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={disabled}
    {...props}
    >
        {isLoading && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className='w-8 h-8'>
                <linearGradient id="a11">
                    <stop offset="0" stopColor="#FF156D" stopOpacity="0"></stop>
                    <stop offset="1" stopColor="#FF156D"></stop>
                </linearGradient>
                <circle fill="none" stroke="url(#a11)" strokeWidth="15" strokeLinecap="round" strokeDasharray="0 44 0 44 0 44 0 44 0 360" cx="100" cy="100" r="70" transformOrigin="center">
                    <animateTransform type="rotate" attributeName="transform" calcMode="discrete" dur="2" values="360;324;288;252;216;180;144;108;72;36" repeatCount="indefinite"></animateTransform>
                </circle>
            </svg>
        )}
        {title}
        {children}
    </button>
  );
}
