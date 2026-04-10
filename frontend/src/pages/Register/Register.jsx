import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, UserCircle, ArrowRight, ShieldCheck, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-brand-light-bg dark:bg-brand-dark transition-colors duration-300 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-yellow/10 blur-[100px] -ml-48 -mt-48 rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow/5 blur-[120px] -mr-48 -mb-48 rounded-full"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full relative z-10"
            >
                <div className="text-center mb-10">
                     <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-yellow transition-transform hover:scale-110">
                         <Car className="w-10 h-10 text-brand-black" strokeWidth={3} />
                     </div>
                     <h2 className="text-4xl font-black text-brand-black dark:text-white tracking-tighter uppercase mb-2">Sign In</h2>
                     <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Secure Identity Initialization</p>
                </div>

                <div className="bg-white dark:bg-brand-dark-card rounded-[3rem] p-10 lg:p-14 shadow-premium border border-slate-50 dark:border-brand-dark-card transition-colors">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-10 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input 
                                label="Full Legal Identity"
                                name="name"
                                type="text" 
                                required
                                icon={User}
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />

                            <Input 
                                label="Network Identity (Email)"
                                name="email"
                                type="email" 
                                required
                                icon={Mail}
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@domain.com"
                            />
                        </div>

                        <Input 
                            label="Initial Access Key"
                            name="password"
                            type="password"
                            required
                            icon={Lock}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />

                        <div className="space-y-6">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-1">
                                SELECT ACCOUNT CLASSIFICATION
                            </label>
                            <div className="grid grid-cols-2 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                                    className={`
                                        py-6 px-10 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-3 group/role
                                        ${formData.role === 'customer' 
                                            ? 'bg-brand-yellow border-brand-yellow text-brand-black shadow-yellow' 
                                            : 'bg-slate-50 dark:bg-brand-dark border-slate-50 dark:border-brand-dark text-slate-400 hover:border-brand-yellow dark:hover:border-brand-yellow'
                                        }
                                    `}
                                >
                                    <User className="w-6 h-6 group-hover/role:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Customer</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'business' })}
                                    className={`
                                        py-6 px-10 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-3 group/role
                                        ${formData.role === 'business' 
                                            ? 'bg-brand-yellow border-brand-yellow text-brand-black shadow-yellow' 
                                            : 'bg-slate-50 dark:bg-brand-dark border-slate-50 dark:border-brand-dark text-slate-400 hover:border-brand-yellow dark:hover:border-brand-yellow'
                                        }
                                    `}
                                >
                                    <Car className="w-6 h-6 group-hover/role:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Provider</span>
                                </button>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-6 rounded-2xl shadow-yellow"
                            size="lg"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-black"></div>
                            ) : (
                                <>
                                    <span>Execute Onboarding</span>
                                    <ArrowRight className="w-5 h-5 ml-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-50 dark:border-brand-dark-card text-center">
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                            Already in the network?
                            <Link to="/login" className="text-brand-yellow font-black ml-2 hover:underline">
                                Initialize Login
                            </Link>
                        </p>
                    </div>
                </div>
                
                <div className="mt-10 flex items-center justify-center space-x-3 text-slate-300 dark:text-slate-700">
                     <ShieldCheck className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em]">Verified Infrastructure</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
