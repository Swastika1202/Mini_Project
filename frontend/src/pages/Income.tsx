import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  TrendingUp,
  ArrowDownRight,
  DollarSign,
  Search,
  Download,
  Filter,
  X,
  Plus,
  Clock,
  BarChart3,
  CheckCircle2,
  Calendar as CalendarIcon,
  Zap
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '@/hooks/use-toast';

// Mock Data Initial State
const INITIAL_TRANSACTIONS = [
  { id: 1, name: "Upwork Inc.", ref: "INV-2024-001", date: "2025-11-21", status: "Received", amt: 2450.00, type: 'Freelance' },
  { id: 2, name: "Google Ads", ref: "ADS-NOV-25", date: "2025-11-20", status: "Received", amt: 850.00, type: 'Ad Revenue' },
  { id: 3, name: "Private Client", ref: "INV-2024-002", date: "2025-11-18", status: "Pending", amt: 1200.00, type: 'Consulting' },
  { id: 4, name: "Dividend", ref: "AAPL-DIV", date: "2025-11-15", status: "Received", amt: 120.50, type: 'Investment' },
];

const Income = () => {
  // --- State Management ---
  const [transactions, setTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({
      name: '',
      ref: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      status: 'Received',
      type: 'Freelance'
  });
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingClearance, setPendingClearance] = useState(0);
  const [avgTransaction, setAvgTransaction] = useState(0);
  const [incomeGrowth, setIncomeGrowth] = useState([]);
  const [topSources, setTopSources] = useState([]);
  const [period, setPeriod] = useState('weekly'); // Default period
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchIncomeSummary = async () => {
      try {
        const response = await api.getIncomeSummary(period);
        const data = response.data;
        setTotalRevenue(data.totalRevenue);
        setPendingClearance(data.pendingClearance);
        setAvgTransaction(data.avgTransaction);
        setIncomeGrowth(data.incomeGrowth);
        setTopSources(data.topSources);
        setTransactions(data.recentIncomes);
      } catch (error) {
        console.error("Failed to fetch income summary:", error);
        toast({
          title: "Error",
          description: "Failed to load income data.",
          variant: "destructive",
        });
      }
    };
    fetchIncomeSummary();
  }, [period, toast]);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIncome(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncome.name || !newIncome.amount) return;

    try {
      await api.addIncome({
        name: newIncome.name,
        ref: newIncome.ref,
        date: new Date(newIncome.date),
        status: newIncome.status,
        amount: parseFloat(newIncome.amount),
        type: newIncome.type,
      });
      toast({
        title: "Success",
        description: "Income added successfully.",
      });
      setIsAddModalOpen(false);
      setNewIncome({
          name: '',
          ref: '',
          date: new Date().toISOString().split('T')[0],
          amount: '',
          status: 'Received',
          type: 'Freelance'
      });
      // Refetch data after adding new income
      const response = await api.getIncomeSummary(period);
      const data = response.data;
      setTotalRevenue(data.totalRevenue);
      setPendingClearance(data.pendingClearance);
      setAvgTransaction(data.avgTransaction);
      setIncomeGrowth(data.incomeGrowth);
      setTopSources(data.topSources);
      setTransactions(data.recentIncomes);

    } catch (error) {
      console.error("Failed to add income:", error);
      toast({
        title: "Error",
        description: "Failed to add income.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const headers = ["Source,Reference,Date,Status,Amount,Type"];
    const csvContent = transactions.map(t => 
      `${t.name},${t.ref},${t.date},${t.status},${t.amt.toFixed(2)},${t.type}`
    ).join("\n");

    const blob = new Blob([headers + "\n" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `income_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  // --- Chart Data & Logic ---
  // Smooth Curve Path Command (Hardcoded smooth Bezier for demo visual)
  const curvePath = "M0,250 C100,200 150,150 180,150 C250,150 280,220 310,220 C360,220 400,100 440,80 C480,60 530,130 570,130 C630,130 660,40 700,40 C750,40 800,90 830,90 C880,90 920,20 1000,20";
  const areaPath = `${curvePath} L1000,350 L0,350 Z`;

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="animate-in slide-in-from-left fade-in duration-500">
              <h1 className="text-3xl font-bold text-[#0a192f]">Income Management</h1>
              <p className="text-slate-500 mt-1">Track your earnings, generate reports, and manage revenue.</p>
           </div>
           
           <div className="flex items-center gap-3 animate-in slide-in-from-right fade-in duration-500">
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                 {[ 'weekly', 'monthly', 'yearly'].map((p) => (
                    <button 
                       key={p} 
                       onClick={() => setPeriod(p)}
                       className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                          period === p 
                          ? 'bg-[#005f73] text-white shadow-sm' 
                          : 'text-slate-500 hover:text-[#005f73] hover:bg-slate-50'
                       }`}
                    >
                       {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                 ))}
              </div>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-[#005f73] transition-colors font-medium text-sm shadow-sm active:scale-95"
              >
                 <Download size={16} /> Export
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#005f73] text-white rounded-xl hover:bg-[#004e5f] transition-all font-bold text-sm shadow-md shadow-cyan-900/20 active:scale-95"
              >
                 <Plus size={16} /> Add Income
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <TrendingUp size={24} />
                  </div>
               </div>
               <div>
                  <p className="text-slate-500 font-medium text-sm mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-[#0a192f]">{formatCurrency(totalRevenue)}</h3>
                  <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-0.5 rounded-md">+15% vs last month</p>
               </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Clock size={24} />
                  </div>
               </div>
               <div>
                  <p className="text-slate-500 font-medium text-sm mb-1">Pending Clearance</p>
                  <h3 className="text-3xl font-bold text-[#0a192f]">{formatCurrency(pendingClearance)}</h3>
                  <p className="text-xs font-bold text-amber-600 mt-2 bg-amber-50 inline-block px-2 py-0.5 rounded-md">{transactions.filter(t => t.status === 'Pending').length} invoices pending</p>
               </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <BarChart3 size={24} />
                  </div>
               </div>
               <div>
                  <p className="text-slate-500 font-medium text-sm mb-1">Avg. Transaction</p>
                  <h3 className="text-3xl font-bold text-[#0a192f]">{formatCurrency(avgTransaction)}</h3>
                  <p className="text-xs font-bold text-blue-600 mt-2 bg-blue-50 inline-block px-2 py-0.5 rounded-md">Consistent Growth</p>
               </div>
           </div>
        </div>

        {/* --- INTERACTIVE LINE CHART SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col">
               <div className="flex justify-between items-center mb-8 relative z-20">
                  <div>
                    <h3 className="font-bold text-xl text-[#0a192f] flex items-center gap-2">
                       <TrendingUp size={22} className="text-[#005f73]" />
                       Income Growth
                    </h3>
                    {hoveredWeek !== null && incomeGrowth.length > hoveredWeek ? (
                        <p className="text-sm text-[#005f73] font-medium animate-in fade-in">
                            {/* Swapped: Weekly shows "Day X", Monthly shows "Week X" */}
                            {period === 'weekly' ? `Day ${hoveredWeek + 1}` : period === 'monthly' ? `Week ${hoveredWeek + 1}` : `Month ${hoveredWeek + 1}`}: <span className="font-bold">{formatCurrency(incomeGrowth[hoveredWeek] || 0)}</span>
                        </p>
                    ) : (
                        <p className="text-sm text-slate-500">{
                          // Swapped descriptive text
                          period === 'weekly' ? 'Daily breakdown' : period === 'monthly' ? 'Weekly breakdown' : 'Monthly breakdown'
                        }</p>
                    )}
                  </div>
                  <div className="bg-[#e0f2f1] text-[#005f73] px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                     <Zap size={14} fill="currentColor" />
                     <span>+24% Revenue</span>
                  </div>
               </div>
               
               {/* Line Chart Visual */}
               <div className="relative h-64 w-full">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between text-slate-300 text-xs font-medium z-0 pointer-events-none">
                     <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                     <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                     <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                     <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                     <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                  </div>

                  <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
                     <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#005f73" stopOpacity="0.2" />
                           <stop offset="100%" stopColor="#005f73" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     
                     {/* Dynamic Path Generation for Filled Area */}
                     {incomeGrowth.length > 0 && (
                       <path d={`M0,300 L0,${300 - (incomeGrowth[0] / Math.max(...incomeGrowth, 1)) * 250} ` +
                                incomeGrowth.map((val, index) => {
                                  const x = (index / (incomeGrowth.length - 1)) * 1000;
                                  const y = 300 - (val / Math.max(...incomeGrowth, 1)) * 250;
                                  return `L${x},${y}`;
                                }).join(' ') + ` L1000,300 Z`}
                             fill="url(#incomeGradient)" />
                     )}
                     
                     {/* Dynamic Path Generation for Stroke Line */}
                     {incomeGrowth.length > 0 && (
                       <path 
                          d={`M0,${300 - (incomeGrowth[0] / Math.max(...incomeGrowth, 1)) * 250} ` +
                               incomeGrowth.map((val, index) => {
                                 const x = (index / (incomeGrowth.length - 1)) * 1000;
                                 const y = 300 - (val / Math.max(...incomeGrowth, 1)) * 250;
                                 return `L${x},${y}`;
                               }).join(' ')}
                          fill="none" 
                          stroke="#005f73" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="drop-shadow-sm"
                       />
                     )}

                     {/* Interactive Points */}
                     {incomeGrowth.map((val, index) => {
                        const x = (index / (incomeGrowth.length - 1)) * 1000;
                        const y = 300 - (val / Math.max(...incomeGrowth, 1)) * 250;
                        return (
                           <g key={index} onMouseEnter={() => setHoveredWeek(index)} onMouseLeave={() => setHoveredWeek(null)}>
                              {/* Invisible larger trigger area for easier hovering */}
                              <circle cx={x} cy={y} r="20" fill="transparent" className="cursor-pointer" />
                              
                              {/* Visible Dot */}
                              <circle 
                                 cx={x} 
                                 cy={y} 
                                 r={hoveredWeek === index ? 8 : 6} 
                                 fill="white" 
                                 stroke="#005f73" 
                                 strokeWidth="3" 
                                 className={`transition-all duration-300 pointer-events-none ${hoveredWeek === index ? 'filter drop-shadow-md' : ''}`}
                              />
                           </g>
                        );
                     })}
                  </svg>

                  {/* X Axis Labels */}
                  <div className="absolute bottom-0 w-full flex justify-between px-2 text-xs font-bold text-slate-400 mt-2">
                     {/* Swapped Logic: Weekly -> Day X, Monthly -> W X */}
                     {period === 'weekly' && (Array.from({ length: incomeGrowth.length }).map((_, i) => <span key={i}>Day {i + 1}</span>))}
                     {period === 'monthly' && (Array.from({ length: incomeGrowth.length }).map((_, i) => <span key={i}>W{i + 1}</span>))}
                     {period === 'yearly' && (Array.from({ length: incomeGrowth.length }).map((_, i) => <span key={i}>Month {i + 1}</span>))}
                  </div>
               </div>
           </div>

           {/* Income Breakdown */}
           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
               <div>
                   <h3 className="font-bold text-xl text-[#0a192f] mb-6">Top Sources</h3>
                   <div className="space-y-6">
                      {topSources.map((src, i) => {
                        const totalAmount = topSources.reduce((sum, s) => sum + s.amount, 0);
                        const pct = totalAmount > 0 ? (src.amount / totalAmount) * 100 : 0;
                        const color = ['bg-[#005f73]', 'bg-[#0a9396]', 'bg-[#94d2bd]', 'bg-[#e9d8a6]'][i % 4];
                         return (
                         <div key={i} className="group cursor-default">
                            <div className="flex justify-between text-sm mb-2">
                               <span className="font-medium text-slate-600 group-hover:text-[#005f73] transition-colors">{src.type}</span>
                               <span className="font-bold text-[#0a192f]">{formatCurrency(src.amount)}</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }}></div>
                            </div>
                         </div>
                      )})}
                   </div>
               </div>
               
               <div className="mt-8 p-4 bg-[#e0f2f1] rounded-xl border border-[#b2dfdb] animate-in slide-in-from-bottom-2">
                  <p className="text-[#005f73] text-sm font-medium flex items-center gap-2">
                     <TrendingUp size={16} /> Projection
                  </p>
                  <p className="text-xs text-[#005f73]/80 mt-1">You are on track to exceed your monthly income goal by <span className="font-bold">₹1,200</span>.</p>
               </div>
           </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-lg text-[#0a192f]">Recent Incomes</h3>
              <div className="flex gap-2">
                 <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#005f73] transition-colors" size={16} />
                    <input type="text" placeholder="Search transactions..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#005f73] w-full sm:w-64 transition-all" />
                 </div>
                 <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-[#005f73] hover:bg-white transition-colors">
                    <Filter size={18} />
                 </button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              {transactions.length > 0 ? (
                  <table className="w-full">
                     <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold text-left">
                        <tr>
                           <th className="px-6 py-4">Source</th>
                           <th className="px-6 py-4">Reference</th>
                           <th className="px-6 py-4">Date</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {transactions.map((row) => (
                           <tr key={row._id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                       <ArrowDownRight size={14} />
                                    </div>
                                    <span className="font-bold text-[#0a192f] text-sm">{row.title}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">{row.ref}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">{new Date(row.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${
                                    row.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                 }`}>
                                    {row.status === 'Received' && <CheckCircle2 size={10} />}
                                    {row.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-emerald-600 text-sm">
                                 +{formatCurrency(row.amount)}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
              ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">No transactions found.</div>
              )}
           </div>
        </div>

        {/* ADD INCOME MODAL OVERLAY */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div 
                    className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsAddModalOpen(false)}
                />
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                    <div className="bg-[#005f73] p-6 text-white flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Plus size={20} className="bg-white/20 p-1 rounded-lg box-content" />
                            Add New Income
                        </h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddIncome} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Source Name</label>
                            <input 
                                required
                                name="name"
                                value={newIncome.name}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="e.g. Client Payment, Salary..." 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input 
                                        required
                                        name="amount"
                                        type="number" 
                                        min="0"
                                        step="0.01"
                                        value={newIncome.amount}
                                        onChange={handleInputChange}
                                        placeholder="0.00" 
                                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-bold text-[#0a192f]" 
                                    />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                <div className="relative">
                                    <input 
                                        required
                                        name="date"
                                        type="date" 
                                        value={newIncome.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm text-slate-600" 
                                    />
                                    <CalendarIcon size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                <select 
                                    name="status"
                                    value={newIncome.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm appearance-none"
                                >
                                    <option>Received</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Reference</label>
                                <input 
                                    name="ref"
                                    value={newIncome.ref}
                                    onChange={handleInputChange}
                                    type="text" 
                                    placeholder="Optional" 
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm" 
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-3 bg-[#005f73] text-white font-bold rounded-xl hover:bg-[#004e5f] transition-colors shadow-lg shadow-[#005f73]/20"
                            >
                                Save Income
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Income;