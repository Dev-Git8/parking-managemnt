import React from 'react';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-brand-yellow">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
                        w-full bg-white dark:bg-brand-dark-card border-2 border-slate-50 dark:border-brand-dark-card
                        py-4 ${Icon ? 'pl-14' : 'px-6'} pr-6 rounded-2xl text-sm font-bold
                        placeholder:text-slate-300 dark:placeholder:text-slate-700
                        focus:outline-none focus:border-brand-yellow dark:focus:border-brand-yellow
                        transition-all duration-300 shadow-premium
                        ${error ? 'border-red-500 dark:border-red-500' : ''}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-2 text-xs font-medium text-red-500 px-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
