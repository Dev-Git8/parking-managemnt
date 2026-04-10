import React from 'react';

const Badge = ({ children, variant = 'slate', className = '' }) => {
    const variants = {
        success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500",
        warning: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-500",
        danger: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500",
        brand: "bg-brand-yellow text-brand-black",
        accent: "bg-brand-black text-white dark:bg-white dark:text-brand-black",
        slate: "bg-slate-100 text-slate-500 dark:bg-brand-dark-card dark:text-slate-400"
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all duration-300 ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
