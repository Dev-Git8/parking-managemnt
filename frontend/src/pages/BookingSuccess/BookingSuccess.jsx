import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';

const BookingSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-brand-light-bg dark:bg-brand-dark transition-colors duration-300 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-yellow/5 blur-[150px] rounded-full"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white dark:bg-brand-dark-card rounded-[3.5rem] p-12 text-center shadow-premium border border-slate-50 dark:border-brand-dark-card">
                    <div className="mb-12 relative flex justify-center">
                        <motion.div 
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className="w-32 h-32 bg-brand-yellow rounded-[2.5rem] flex items-center justify-center shadow-yellow relative z-10"
                        >
                            <Check className="w-16 h-16 text-brand-black" strokeWidth={4} />
                        </motion.div>
                        
                        {/* Pulse Ring */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 0.3, scale: 1.5 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 border-4 border-brand-yellow rounded-[2.5rem]"
                        ></motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl font-black text-brand-black dark:text-white tracking-tighter uppercase">Success</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-12">Transaction Finalized</p>
                        
                        <div className="bg-slate-50 dark:bg-brand-dark p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 mb-10">
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
                                Your reservation node has been successfully deployed. Access details are now available in your management terminal.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-4">
                            <Link to="/profile">
                                <Button className="w-full py-5 rounded-2xl shadow-yellow" size="lg">
                                    <span>Manage Bookings</span>
                                    <ArrowRight className="w-5 h-5 ml-4" />
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button variant="ghost" className="w-full text-[10px]">
                                    Back to Network Map
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="mt-12 flex items-center justify-center space-x-3 text-slate-300 dark:text-slate-700">
                             <ShieldCheck className="w-5 h-5" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Secure Reservation</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
