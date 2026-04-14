import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { MapPin, Phone, Mail, Navigation, Star, ArrowRight, Search, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

const Home = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBusinesses = async (search = '') => {
        setLoading(true);
        try {
            const endpoint = search ? `/business?search=${encodeURIComponent(search)}` : '/business';
            const { data } = await api.get(endpoint);
            setBusinesses(data.data);
        } catch (error) {
            console.error('Error fetching businesses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchBusinesses(searchTerm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] dark:bg-[#4d4d4d] transition-colors duration-300 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-16">
                
                {/* Inspiration Replica Hero Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#0f0f0f] rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-between transition-colors duration-300"
                >
                    {/* Left Typography & Info */}
                    <div className="flex-1 space-y-8 max-w-xl">
                        {/* Custom Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full border-2 border-slate-100 dark:border-[#1a1a1a]">
                            <div className="w-6 h-6 bg-brand-black dark:bg-white rounded-full flex items-center justify-center mr-3">
                                <LayoutGrid size={12} className="text-brand-yellow dark:text-brand-black" />
                            </div>
                            <span className="text-brand-yellow font-bold text-xs uppercase tracking-widest">Find Parking</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-brand-black dark:text-white tracking-tighter leading-none">
                            Find Your <br /> Perfect Spot
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-base leading-relaxed max-w-md">
                            Ready to reserve your next parking space? Fill out the form to browse available slots and secure your booking instantly.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 pt-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-brand-black dark:bg-white flex items-center justify-center flex-shrink-0">
                                    <Phone size={16} className="text-white dark:text-brand-black" />
                                </div>
                                <span className="text-xs font-black text-brand-black dark:text-white">+1(555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-brand-black dark:bg-white flex items-center justify-center flex-shrink-0">
                                    <MapPin size={16} className="text-white dark:text-brand-black" />
                                </div>
                                <span className="text-xs font-black text-brand-black dark:text-white">San Francisco, CA</span>
                            </div>
                            <div className="flex items-center space-x-4 sm:col-span-2">
                                <div className="w-10 h-10 rounded-full bg-brand-black dark:bg-white flex items-center justify-center flex-shrink-0">
                                    <Mail size={16} className="text-white dark:text-brand-black" />
                                </div>
                                <span className="text-xs font-black text-brand-black dark:text-white">hello@parkingnetwork.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Yellow Form Card */}
                    <div className="w-full md:w-[420px] bg-brand-yellow rounded-[2.5rem] p-8 shadow-xl flex-shrink-0">
                        <form className="space-y-6" onSubmit={handleSearch}>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-brand-black ml-1">Destination</label>
                                <input 
                                    className="w-full bg-brand-yellow border-2 border-brand-black/20 focus:border-brand-black focus:bg-brand-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-brand-black placeholder:text-brand-black/40 transition-colors outline-none"
                                    placeholder="City or area name"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-brand-black ml-1">Arrival Time</label>
                                <input 
                                    type="time"
                                    className="w-full bg-brand-yellow border-2 border-brand-black/20 focus:border-brand-black focus:bg-brand-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-brand-black transition-colors outline-none"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-brand-black ml-1">Duration</label>
                                <select 
                                    className="w-full bg-brand-yellow border-2 border-brand-black/20 focus:border-brand-black focus:bg-brand-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-brand-black appearance-none transition-colors outline-none cursor-pointer"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                                >
                                    <option>Select a duration</option>
                                    <option>1 Hour</option>
                                    <option>4 Hours</option>
                                    <option>Full Day</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    className="inline-flex items-center bg-white text-brand-black rounded-full pl-2 pr-6 py-2 shadow-sm hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <div className="w-8 h-8 rounded-full bg-brand-black flex items-center justify-center mr-3">
                                        <Navigation size={12} className="text-white fill-white transform rotate-45 -ml-0.5 mt-0.5" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Search</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Spacer & Listings */}
                <div className="pt-10">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                             <Badge variant="brand" className="mb-4">Verified Network</Badge>
                             <h2 className="text-4xl font-black text-brand-black dark:text-white tracking-tighter">Available Locations</h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-80 bg-white/50 dark:bg-brand-dark-card/50 rounded-[2.5rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {businesses.map((biz, i) => (
                                <motion.div 
                                    key={biz.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group bg-white dark:bg-[#0f0f0f] p-4 rounded-[2.5rem] border border-slate-50 dark:border-[#1a1a1a] shadow-premium hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6 bg-slate-100 dark:bg-[#1a1a1a]">
                                        {biz.image_url ? (
                                            <img 
                                                src={biz.image_url} 
                                                alt={biz.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 group-hover:scale-110 transition-transform duration-700"></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center">
                                                    <Star size={14} className="text-brand-black fill-brand-black" />
                                                </div>
                                                <span className="text-white font-black text-xs uppercase tracking-widest">4.9 Rating</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="px-4 pb-4">
                                        <h3 className="text-2xl font-black text-brand-black dark:text-white tracking-tight mb-2 group-hover:text-brand-yellow transition-colors">{biz.name}</h3>
                                        <div className="flex items-center text-slate-400 font-bold text-xs mb-6">
                                            <MapPin size={14} className="mr-2 text-brand-yellow" />
                                            {biz.address}
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-[#1a1a1a]">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Fee</p>
                                                <p className="text-2xl font-black text-brand-black dark:text-white font-outfit">${biz.price_per_hour}<span className="text-xs text-slate-400 uppercase ml-1">/hr</span></p>
                                            </div>
                                            <Link to={`/business/${biz.id}`}>
                                                <Button size="md" className="group/btn shadow-yellow">
                                                    Book Now
                                                    <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
