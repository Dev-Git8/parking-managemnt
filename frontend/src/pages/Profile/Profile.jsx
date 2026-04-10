import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { User, Calendar, MapPin, Tag, Clock, ChevronRight, XCircle, ShieldCheck, History, Car, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/my');
                setBookings(data.data);
            } catch (error) {
                console.error('Error fetching bookings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Terminate this reservation node?')) return;
        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            // Update local state to reflect cancellation
            setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        } catch (error) {
            alert('Cancellation failed');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light-bg dark:bg-brand-dark transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-light-bg dark:bg-brand-dark transition-colors duration-300 py-20 px-6">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Badge variant="brand" className="mb-4">Operational Profile</Badge>
                        <h1 className="text-5xl lg:text-6xl font-black text-brand-black dark:text-white tracking-tighter uppercase">{user?.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">{user?.email}</p>
                    </motion.div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Network Member Since</p>
                             <p className="text-sm font-black text-brand-black dark:text-white">APR 2026</p>
                        </div>
                        <div className="w-16 h-16 bg-white dark:bg-brand-dark-card rounded-2xl flex items-center justify-center border border-slate-100 dark:border-brand-dark-card shadow-sm">
                             <User size={28} className="text-brand-yellow" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                     {/* Stats Sidebar */}
                     <div className="lg:col-span-1 space-y-6">
                          <div className="bg-brand-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                               <div className="absolute -top-10 -right-10 opacity-10">
                                   <History size={160} />
                               </div>
                               <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">Active <br /> Metrics</h3>
                               <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Ops</span>
                                         <span className="text-2xl font-black font-outfit text-brand-yellow">{bookings.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                                         <span className="text-xs font-black uppercase text-emerald-500">Normal</span>
                                    </div>
                               </div>
                          </div>
                     </div>

                     {/* Bookings List */}
                     <div className="lg:col-span-3 space-y-8">
                          <div className="flex items-center justify-between">
                               <h2 className="text-3xl font-black text-brand-black dark:text-white tracking-tight uppercase">Reservation History</h2>
                               <Badge variant="slate">{bookings.length} Nodes Found</Badge>
                          </div>

                          {bookings.length === 0 ? (
                               <div className="bg-white dark:bg-brand-dark-card rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5">
                                   <Car className="w-16 h-16 text-slate-100 dark:text-brand-dark mx-auto mb-6" />
                                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No reservation nodes detected in history.</p>
                                   <Link to="/">
                                       <Button variant="secondary" className="mt-8">Start Discovery</Button>
                                   </Link>
                               </div>
                          ) : (
                               <div className="space-y-6">
                                    {bookings.map((booking, i) => (
                                         <motion.div 
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="group bg-white dark:bg-brand-dark-card p-4 rounded-[2.5rem] border border-slate-50 dark:border-brand-dark-card shadow-sm hover:shadow-premium-hover transition-all duration-500 flex flex-col md:flex-row md:items-center gap-8"
                                         >
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-brand-dark rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-yellow transition-colors duration-500">
                                                 <Car size={32} className="text-slate-200 group-hover:text-brand-black" />
                                            </div>
                                            
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    {booking.status === 'booked' ? <Badge variant="success">Active Element</Badge> : <Badge variant="slate">Terminated</Badge>}
                                                    <span className="text-[10px] font-black font-outfit text-slate-300 uppercase tracking-widest">OP-ID: {booking.id} | Node #{booking.slot_number}</span>
                                                </div>
                                                <h4 className="text-xl font-black text-brand-black dark:text-white uppercase tracking-tight">{booking.business_name || 'Parking Garage'}</h4>
                                                <div className="flex items-center text-slate-400 font-bold text-xs space-x-4">
                                                    <div className="flex items-center"><Calendar size={14} className="mr-2 text-brand-yellow" /> {new Date(booking.start_time).toLocaleDateString()}</div>
                                                    <div className="flex items-center"><Clock size={14} className="mr-2 text-brand-yellow" /> {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-50 dark:border-brand-dark-card md:pl-8">
                                                <div className="text-left md:text-right">
                                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Session Time</p>
                                                     <p className="text-sm font-black text-brand-black dark:text-white font-outfit mt-1">
                                                         {Math.round((new Date(booking.end_time) - new Date(booking.start_time)) / 3600000)} HRS
                                                     </p>
                                                </div>
                                                <div className="text-left md:text-right">
                                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Logic</p>
                                                     <p className="text-2xl font-black text-brand-black dark:text-white font-outfit">${booking.total_price}</p>
                                                </div>
                                                {booking.status === 'booked' ? (
                                                    <button 
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="w-10 h-10 bg-slate-50 dark:bg-brand-dark text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                ) : (
                                                    <Badge variant="slate">Cancelled</Badge>
                                                )}
                                            </div>
                                         </motion.div>
                                    ))}
                               </div>
                          )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
