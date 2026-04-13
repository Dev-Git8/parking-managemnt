import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { 
    LayoutDashboard, 
    Plus, 
    Activity, 
    Users, 
    Settings, 
    LogOut, 
    Car, 
    ShieldCheck, 
    MoreHorizontal,
    ArrowUpRight,
    Search,
    Bell,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const BusinessDashboard = () => {
    const { logout } = useAuth();
    const [stats, setStats] = useState({ totalSlots: 0, activeBookings: 0, totalRevenue: 0 });
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const socket = useSocket();

    // Modal States
    const [showBusinessSetup, setShowBusinessSetup] = useState(false);
    const [showAddSlots, setShowAddSlots] = useState(false);
    
    // Forms
    const [bizForm, setBizForm] = useState({ name: '', address: '', totalSlots: 10, price: 5 });
    const [slotForm, setSlotForm] = useState({ prefix: 'A', count: 5 });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchSlotsAndBookings = async (bizId) => {
        try {
            const [slotsRes, bookingsRes] = await Promise.all([
                api.get(`/slots/${bizId}`), 
                api.get(`/bookings/business/${bizId}`)
            ]);
            
            const fetchedSlots = slotsRes.data.data || [];
            const fetchedBookings = bookingsRes.data.data || [];
            
            setSlots(fetchedSlots);
            setBookings(fetchedBookings);
            
            setStats({
                totalSlots: fetchedSlots.length,
                activeBookings: fetchedBookings.filter(b => b.status === 'booked' || b.status === 'active').length,
                totalRevenue: fetchedBookings.reduce((acc, curr) => acc + (parseFloat(curr.total_price) || 0), 0)
            });
        } catch (error) {
            console.error('Error fetching slots and bookings', error);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Get my business
                const bizRes = await api.get('/business/my');
                const bizArray = bizRes.data.data;
                
                if (!bizArray || bizArray.length === 0) {
                    setShowBusinessSetup(true);
                    setLoading(false);
                    return; // Stop here, force setup
                }
                
                const biz = bizArray[0]; // Currently handling a single business profile per user
                setBusiness(biz);
                
                // 2. Fetch Slots & Bookings related to this specific business ID
                await fetchSlotsAndBookings(biz.id);
                
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!socket || !business) return;
        
        socket.emit('joinBusinessRoom', business.id);
        
        socket.on('slotsUpdated', (data) => {
            if (data.businessId.toString() === business.id.toString()) {
                fetchSlotsAndBookings(business.id);
            }
        });
        
        return () => {
            socket.emit('leaveBusinessRoom', business.id);
            socket.off('slotsUpdated');
        };
    }, [socket, business]);

    const handleRegisterBusiness = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await api.post('/business/register', bizForm);
            setShowBusinessSetup(false);
            window.location.reload(); // Refresh to load actual dashboard data
        } catch (err) {
            alert(err.response?.data?.message || 'Error configuring business node');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddSlots = async (e) => {
        e.preventDefault();
        if (!business) return;
        setActionLoading(true);
        try {
            // Bulk Generate Slot strings
            const slotNumbers = [];
            for (let i = 1; i <= slotForm.count; i++) {
                slotNumbers.push(`${slotForm.prefix}${i}`);
            }
            
            await api.post('/slots', { businessId: business.id, slotNumbers });
            setShowAddSlots(false);
            window.location.reload(); // Quick refresh to grab new slots and stats
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to populate network nodes');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light-bg dark:bg-brand-dark transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow"></div>
        </div>
    );

    const SidebarItem = ({ icon: Icon, label, id }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`
                w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group
                ${activeTab === id 
                    ? 'bg-brand-yellow text-brand-black shadow-yellow' 
                    : 'text-slate-500 hover:text-brand-black dark:text-slate-500 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-brand-dark-card'
                }
            `}
        >
            <Icon size={20} className={`${activeTab === id ? 'text-brand-black' : 'text-slate-400 group-hover:text-brand-black dark:group-hover:text-white'}`} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-brand-light-bg dark:bg-brand-dark flex transition-all duration-300 relative">
            
            {/* OVERLAY: Business Setup Modal Flow */}
            <AnimatePresence>
                {showBusinessSetup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-brand-dark rounded-[3rem] p-12 max-w-xl w-full shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 opacity-5">
                                 <Settings size={200} />
                            </div>
                            <div className="relative z-10">
                                <Badge variant="brand" className="mb-6">Action Required</Badge>
                                <h2 className="text-4xl font-black text-brand-black dark:text-white tracking-tighter uppercase mb-2">Setup Provider Node</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-8">
                                    Before accessing the central terminal, you must input your infrastructure details to deploy to the network.
                                </p>
                                
                                <form onSubmit={handleRegisterBusiness} className="space-y-6">
                                    <Input 
                                        label="Facility Name" 
                                        name="name" 
                                        required 
                                        value={bizForm.name} 
                                        onChange={(e) => setBizForm({...bizForm, name: e.target.value})} 
                                        placeholder="Alpha Parking Center"
                                    />
                                    <Input 
                                        label="Physical Coordinates (Address)" 
                                        name="address" 
                                        required 
                                        value={bizForm.address} 
                                        onChange={(e) => setBizForm({...bizForm, address: e.target.value})} 
                                        placeholder="123 Tech Blvd, Silicon City"
                                    />
                                    <div className="grid grid-cols-2 gap-6">
                                        <Input 
                                            label="Maximum Capacity" 
                                            name="totalSlots" 
                                            type="number" 
                                            required 
                                            value={bizForm.totalSlots} 
                                            onChange={(e) => setBizForm({...bizForm, totalSlots: parseInt(e.target.value)})} 
                                        />
                                        <Input 
                                            label="Base Hourly Rate ($)" 
                                            name="price" 
                                            type="number" 
                                            required 
                                            value={bizForm.price} 
                                            onChange={(e) => setBizForm({...bizForm, price: parseFloat(e.target.value)})} 
                                        />
                                    </div>
                                    <Button type="submit" disabled={actionLoading} className="w-full py-5 rounded-2xl shadow-yellow mt-4">
                                        {actionLoading ? 'Connecting...' : 'Deploy Business Logic'}
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* OVERLAY: Add Slots Modal */}
                {showAddSlots && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-brand-dark rounded-[3rem] p-12 max-w-md w-full shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setShowAddSlots(false)}
                                className="absolute top-8 right-8 text-slate-400 hover:text-brand-black dark:hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <Badge variant="brand" className="mb-6">Scale Network</Badge>
                            <h2 className="text-3xl font-black text-brand-black dark:text-white tracking-tighter uppercase mb-2">Expand Nodes</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-8">
                                Generate batch sequences of parking identifiers automatically.
                            </p>
                            
                            <form onSubmit={handleAddSlots} className="space-y-6">
                                <Input 
                                    label="Block Prefix" 
                                    name="prefix" 
                                    required 
                                    value={slotForm.prefix} 
                                    onChange={(e) => setSlotForm({...slotForm, prefix: e.target.value.toUpperCase()})} 
                                    placeholder="Sector A"
                                    maxLength={3}
                                />
                                <Input 
                                    label="Generation Quantity" 
                                    name="count" 
                                    type="number" 
                                    required 
                                    min="1"
                                    max="50"
                                    value={slotForm.count} 
                                    onChange={(e) => setSlotForm({...slotForm, count: parseInt(e.target.value)})} 
                                />
                                <div className="p-4 bg-slate-50 dark:bg-brand-dark-card rounded-2xl border border-slate-100 dark:border-white/5">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Sequence</p>
                                     <p className="text-lg font-black text-brand-black dark:text-white font-outfit truncate mt-1">
                                          {slotForm.prefix}1, {slotForm.prefix}2 ... {slotForm.prefix}{slotForm.count}
                                     </p>
                                </div>
                                <Button type="submit" disabled={actionLoading} className="w-full py-5 rounded-2xl shadow-yellow mt-4">
                                    {actionLoading ? 'Compiling...' : 'Execute Expansion'}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Left Sidebar */}
            <aside className="w-80 border-r border-slate-100 dark:border-brand-dark-card bg-white dark:bg-brand-dark sticky top-0 h-screen p-8 flex flex-col justify-between">
                <div className="space-y-12">
                     <div className="flex items-center space-x-3 px-2">
                        <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-yellow">
                            <Car size={24} className="text-brand-black" strokeWidth={3} />
                        </div>
                        <span className="text-xl font-black text-brand-black dark:text-white tracking-tighter">PROVIDER.OS</span>
                    </div>

                    <div className="space-y-2">
                        <SidebarItem icon={LayoutDashboard} label="Operational Overview" id="overview" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-brand-dark-card p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Sync: Online</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">System healthy. All clusters synchronized with central hub.</p>
                    </div>
                    <button onClick={logout} className="w-full flex items-center space-x-4 px-6 py-4 text-slate-400 hover:text-red-500 transition-colors group">
                        <LogOut size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-12 overflow-y-auto z-0">
                {/* Header Strip */}
                <header className="flex items-center justify-between mb-16">
                    <div>
                        <h1 className="text-4xl font-black text-brand-black dark:text-white tracking-tighter uppercase mb-2">Partner Terminal</h1>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Business ID: {business?.id || 'PENDING'}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                         <div className="relative">
                            <button className="p-3 bg-white dark:bg-brand-dark-card rounded-xl border border-slate-100 dark:border-white/5 text-slate-400 hover:text-brand-yellow transition-all">
                                <Bell size={20} />
                            </button>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-brand-yellow rounded-full border-2 border-white dark:border-brand-dark"></span>
                         </div>
                         <Button size="md" onClick={() => setShowAddSlots(true)}>
                            <Plus size={18} className="mr-2" />
                            Expand Node
                         </Button>
                    </div>
                </header>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                     {[
                         { label: 'Active Cluster Nodes', value: stats.totalSlots, icon: Activity, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
                         { label: 'Network Throughput', value: stats.activeBookings, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                         { label: 'Platform Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' }
                     ].map((stat, i) => (
                         <div key={i} className="bg-white dark:bg-brand-dark-card p-8 rounded-[2.5rem] border border-slate-50 dark:border-brand-dark-card shadow-sm hover:shadow-premium transition-all group overflow-hidden relative">
                              <div className={`absolute -right-4 -bottom-4 ${stat.bg} w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-6`}>
                                   <stat.icon className={stat.color} size={24} />
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                              <div className="flex items-end space-x-2">
                                   <h3 className="text-4xl font-black text-brand-black dark:text-white font-outfit">{stat.value}</h3>
                                   <span className="text-emerald-500 text-[10px] font-black uppercase mb-1.5 flex items-center">
                                       <ArrowUpRight size={12} className="mr-1" />
                                       12%
                                   </span>
                              </div>
                         </div>
                     ))}
                </div>

                {/* Main Table Area */}
                <div className="bg-white dark:bg-brand-dark-card rounded-[3rem] border border-slate-50 dark:border-white/5 shadow-premium overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div>
                             <h3 className="text-2xl font-black text-brand-black dark:text-white tracking-tight uppercase">Operational Nodes</h3>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time inventory classification</p>
                        </div>
                        <div className="flex items-center space-x-4">
                             <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input placeholder="Search node ID..." className="bg-slate-50 dark:bg-brand-dark border-none py-2.5 pl-10 pr-6 rounded-xl text-xs font-bold text-brand-black dark:text-white focus:ring-2 focus:ring-brand-yellow/20 outline-none" />
                             </div>
                             <Button variant="secondary" size="sm">Export Data</Button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-brand-dark">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Node ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Classification</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operational Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Session</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                {slots.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <Car size={32} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">No nodes detected. Click Expand Node.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    slots.map((slot) => (
                                        <tr key={slot.id} className="group hover:bg-slate-50/50 dark:hover:bg-brand-dark transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-slate-100 dark:bg-brand-dark rounded-xl flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
                                                        <Car size={18} className="text-slate-400 dark:text-slate-600 group-hover:text-brand-black" />
                                                    </div>
                                                    <span className="text-sm font-black text-brand-black dark:text-white uppercase tracking-widest">#{slot.slot_number}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="slate">Standard Node</Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${slot.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${slot.is_available ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {slot.is_available ? 'Operational' : 'Deployed'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {(() => {
                                                    const active = bookings.find(b => b.slot_id === slot.id && b.status === 'booked');
                                                    if (!active) return <span className="text-xs font-bold text-slate-500 dark:text-slate-400">---</span>;
                                                    const sTime = new Date(active.start_time);
                                                    const eTime = new Date(active.end_time);
                                                    const durationMs = eTime - sTime;
                                                    const durationMins = Math.round(durationMs / 60000);
                                                    const durationLabel = durationMins >= 60 
                                                        ? `${(durationMins / 60).toFixed(durationMins % 60 === 0 ? 0 : 1)} Hr${durationMins >= 120 ? 's' : ''}` 
                                                        : `${durationMins} Min${durationMins !== 1 ? 's' : ''}`;
                                                    return (
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-200">
                                                                {sTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {eTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase text-brand-yellow mt-1">Booked for {durationLabel}</span>
                                                        </div>
                                                    )
                                                })()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-slate-300 hover:text-brand-yellow transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BusinessDashboard;
