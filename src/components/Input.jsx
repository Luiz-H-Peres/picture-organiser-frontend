export const Input = ({ type = 'text', label, validationError = '', ...props}) => {

  const inputClassName = validationError ? 'border-red-500' : 'border-gray-600';
 
  return (
    <>
    <input 
        type={type}
        placeholder={label}
        className={`border p-2 w-full mt-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 ${inputClassName}`}
        {...props}
    />
    {validationError && (
      <p className="text-red-500 text-sm mt-1">{validationError}</p>
    )}
    </>
  );
}
