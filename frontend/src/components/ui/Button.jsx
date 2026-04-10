import React from 'react';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    disabled = false, 
    ...props 
}) => {
    const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-brand-yellow text-brand-black hover:bg-brand-black hover:text-white shadow-yellow hover:shadow-premium-hover",
        secondary: "bg-white text-brand-black border-2 border-slate-100 hover:border-brand-yellow dark:bg-brand-dark-card dark:text-white dark:border-brand-dark-card dark:hover:border-brand-yellow shadow-premium",
        accent: "bg-brand-black text-white hover:bg-brand-yellow hover:text-brand-black dark:bg-white dark:text-brand-black dark:hover:bg-brand-yellow shadow-premium",
        ghost: "bg-transparent text-slate-500 hover:text-brand-black dark:text-slate-400 dark:hover:text-white",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-premium"
    };

    const sizes = {
        sm: "px-5 py-2.5 text-[10px] rounded-xl",
        md: "px-7 py-3.5 text-xs rounded-2xl",
        lg: "px-9 py-4.5 text-sm rounded-[1.25rem]",
        xl: "px-12 py-5.5 text-base rounded-[1.5rem]"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
