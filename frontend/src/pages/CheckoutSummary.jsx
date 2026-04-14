import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, Clock, AlertTriangle, CheckCircle, CreditCard, ArrowRight, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const CheckoutSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking } = location.state || {};
    const [isPaying, setIsPaying] = useState(false);
    const [paid, setPaid] = useState(false);

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-light-bg dark:bg-brand-dark transition-colors duration-300">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-brand-black dark:text-white uppercase">No Booking Data Found</h2>
                    <Button onClick={() => navigate('/profile')} className="mt-6">Return to Profile</Button>
                </div>
            </div>
        );
    }

    const { 
        id, 
        start_time, 
        end_time, 
        actual_end_time, 
        total_price, 
        penalty_amount,
        business_name 
    } = booking;

    const basePrice = parseFloat(total_price);
    const penalty = parseFloat(penalty_amount || 0);
    const finalTotal = basePrice + penalty;
    
    // Calculate durations
    const scheduledEnd = new Date(end_time);
    const actualEnd = new Date(actual_end_time || new Date());
    const isOverdue = actualEnd > scheduledEnd;
    
    const handlePay = () => {
        setIsPaying(true);
        // Simulate payment processing
        setTimeout(() => {
            setPaid(true);
            setIsPaying(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-brand-light-bg dark:bg-brand-dark transition-colors duration-300 py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {!paid ? (
                        <motion.div
                            key="billing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-brand-dark-card rounded-[3rem] shadow-premium overflow-hidden border border-slate-100 dark:border-white/5"
                        >
                            {/* Header Section */}
                            <div className="bg-brand-black p-10 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Receipt size={120} />
                                </div>
                                <div className="relative z-10">
                                    <Badge variant="brand" className="mb-4">Parking Receipt</Badge>
                                    <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">Booking Summary</h1>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center">
                                        Booking ID: {id} | {business_name}
                                    </p>
                                </div>
                            </div>

                            <div className="p-10 lg:p-16 space-y-12">
                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Time</p>
                                            <p className="text-xl font-black text-brand-black dark:text-white uppercase">
                                                {new Date(start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scheduled Exit</p>
                                            <p className="text-xl font-black text-brand-black dark:text-white uppercase">
                                                {new Date(end_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actual Exit</p>
                                            <p className="text-xl font-black text-emerald-500 uppercase">
                                                {new Date(actual_end_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                        {isOverdue && (
                                            <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-2xl border border-red-100 dark:border-red-500/20 flex items-start space-x-3">
                                                <AlertTriangle size={18} className="text-red-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-black text-red-600 uppercase tracking-tight">Overstay Detected</p>
                                                    <p className="text-[10px] font-bold text-red-500/80 uppercase">A penalty multiplier has been applied to this booking.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Billing Breakdown */}
                                <div className="border-t-2 border-dashed border-slate-100 dark:border-white/5 pt-12 space-y-6">
                                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                        <span className="font-bold uppercase tracking-widest text-xs">Base Parking Fee</span>
                                        <span className="font-black font-outfit text-lg text-brand-black dark:text-white">${basePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold uppercase tracking-widest text-xs text-red-500">Service Penalty</span>
                                            {isOverdue && (
                                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                            )}
                                        </div>
                                        <span className="font-black font-outfit text-lg text-red-500">${penalty.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-brand-dark p-8 rounded-[2rem] flex justify-between items-end mt-10">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount Due</p>
                                            <p className="text-4xl font-black text-brand-black dark:text-white font-outfit">${finalTotal.toFixed(2)}</p>
                                        </div>
                                        <Clock className="text-brand-yellow w-10 h-10 opacity-20" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Button 
                                        className="w-full text-lg py-5 group" 
                                        onClick={handlePay}
                                        disabled={isPaying}
                                    >
                                        {isPaying ? (
                                            <span className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-black mr-3"></div>
                                                PROCESSING PAYMENT...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                PAY NOW <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest">
                                        Secure transaction managed by Park-Ease System
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-brand-dark-card rounded-[3.5rem] p-16 text-center shadow-premium-hover border border-slate-100 dark:border-white/5"
                        >
                            <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/20">
                                <CheckCircle size={48} className="text-white" />
                            </div>
                            <Badge variant="success" className="mb-6">Payment Received</Badge>
                            <h2 className="text-5xl font-black text-brand-black dark:text-white uppercase tracking-tighter mb-4">Thank You!</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs max-w-sm mx-auto mb-12">
                                Your booking is now complete. The parking spot has been released for the next user.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button variant="secondary" onClick={() => navigate('/')} className="w-full sm:w-auto px-10">
                                     <Home className="mr-2" size={18} /> BACK TO HOME
                                </Button>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CheckoutSummary;
