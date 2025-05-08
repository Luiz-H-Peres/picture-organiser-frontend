import { useState, useEffect } from 'react';

export const Message = ({ message, variations = 'info' }) => {
  
  const [show, setShow] = useState(true);

    const messageClasses = {
        error: "text-red-500 border-red-500",
        success: "text-green-500 border-green-500",
        warning: "text-yellow-500 border-yellow-500",
        info: "text-blue-500 border-blue-500",
    }

    useEffect(() => {
      if(!message) {
        setShow(false);
        return;
      } else {
        setShow(true);
      }
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

    return () => clearTimeout(timer);
  }, [message]);
 
  if(!show) return null;
  return (
    <div className={`w-full border p-4 rounded-md text-center ${messageClasses[variations]}`}>
      { message}
    </div>
  );
}
