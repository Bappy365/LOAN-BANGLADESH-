
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#006a4e] text-white shadow-md hover:bg-[#00523c]",
    secondary: "bg-[#f42a41] text-white shadow-md hover:bg-[#d32438]",
    outline: "border-2 border-[#006a4e] text-[#006a4e] hover:bg-emerald-50",
    danger: "bg-red-500 text-white shadow-md hover:bg-red-600"
  };

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
