import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Car, User, LogOut, Menu, X, Moon, Sun, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Book Slots', path: '/' },
        { name: 'About', path: '/about' },
        ...(user?.role === 'customer' ? [{ name: 'Profile', path: '/profile' }] : []),
        ...(user?.role === 'business' ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
        ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
            ? 'bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md py-4 border-b border-slate-100 dark:border-brand-dark-card shadow-sm' 
            : 'bg-white dark:bg-brand-dark py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center shadow-yellow group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Car className="w-7 h-7 text-brand-black" strokeWidth={3} />
                    </div>
                    <span className="text-2xl font-black text-brand-black dark:text-white tracking-tighter">
                        PARK<span className="text-brand-yellow">EASE</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-brand-yellow ${
                                location.pathname === link.path ? 'text-brand-yellow' : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-brand-dark-card border-none flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    >
                        {theme === 'light' ? <Moon size={20} className="text-slate-400" /> : <Sun size={20} className="text-brand-yellow" />}
                    </button>

                    {user ? (
                        <div className="flex items-center space-x-6">
                            <Link to={user.role === 'admin' ? '/admin' : user.role === 'business' ? '/dashboard' : '/profile'} className="flex items-center space-x-3 group">
                                <div className="text-right">
                                     <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                                     <p className="text-xs font-black text-brand-black dark:text-white group-hover:text-brand-yellow transition-colors">{user.name}</p>
                                </div>
                                <div className="w-12 h-12 bg-slate-100 dark:bg-brand-dark-card rounded-xl flex items-center justify-center group-hover:border-2 group-hover:border-brand-yellow transition-all">
                                    <User size={20} className="text-slate-400" />
                                </div>
                            </Link>
                            <button onClick={logout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login">
                                <Button variant="ghost" className="text-[10px]">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button size="md">Join Network</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-4">
                     <button onClick={toggleTheme} className="p-2 text-slate-400 dark:text-slate-500">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-brand-yellow" />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-brand-black dark:text-white">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white dark:bg-brand-dark border-b border-slate-100 dark:border-brand-dark-card shadow-xl p-6 md:hidden z-40"
                    >
                        <div className="flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 border-b border-slate-50 dark:border-brand-dark-card pb-4"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {!user && (
                                <div className="flex flex-col space-y-4 pt-4">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="secondary" className="w-full">Sign In</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">Create Account</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
