import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  CreditCard,
  ArrowUpRight,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Plus,
  PieChart,
  Calendar,
  AlertCircle,
  X,
  Search,
  Filter,
  TrendingDown,
  MoreHorizontal
} from 'lucide-react';

// --- Mock Data ---
const INITIAL_EXPENSES = [
  { id: 1, name: "Apple Store", date: "2025-11-23", cat: "Shopping", amt: 1199.00, icon: ShoppingBag, color: "bg-slate-100 text-slate-700" },
  { id: 2, name: "Starbucks", date: "2025-11-23", cat: "Dining", amt: 5.50, icon: Coffee, color: "bg-orange-50 text-orange-600" },
  { id: 3, name: "Uber Ride", date: "2025-11-22", cat: "Transport", amt: 24.20, icon: Car, color: "bg-blue-50 text-blue-600" },
  { id: 4, name: "Netflix", date: "2025-11-20", cat: "Entertainment", amt: 15.00, icon: PieChart, color: "bg-red-50 text-red-600" },
  { id: 5, name: "Whole Foods", date: "2025-11-19", cat: "Food", amt: 145.30, icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600" },
];

const Expenses = () => {
  // --- State ---
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Form State
  const [newExpense, setNewExpense] = useState({
    name: '',
    cat: 'Shopping',
    amt: '',
    date: new Date().toISOString().split('T')[0]
  });

  // --- Calculations ---
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amt, 0);
  const avgDaily = totalSpent / (expenses.length || 1);
  const budget = 4000;
  const budgetLeft = budget - totalSpent;
  const budgetProgress = Math.min((totalSpent / budget) * 100, 100);

  // Chart Logic (Fixed Points for smooth curve)
  const chartPoints = [
    { day: 'Mon', amt: 120, x: 50, y: 200 },
    { day: 'Tue', amt: 240, x: 200, y: 140 },
    { day: 'Wed', amt: 180, x: 350, y: 170 },
    { day: 'Thu', amt: 310, x: 500, y: 110 },
    { day: 'Fri', amt: 450, x: 650, y: 50 }, // Peak
    { day: 'Sat', amt: 200, x: 800, y: 160 },
    { day: 'Sun', amt: 60,  x: 950, y: 230 },
  ];

  // Smooth Curve Path
  const curvePath = "M50,200 C100,200 150,140 200,140 S300,170 350,170 S450,110 500,110 S600,50 650,50 S750,160 800,160 S900,230 950,230";
  const areaPath = `${curvePath} L950,300 L50,300 Z`;

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amt) return;

    let icon = ShoppingBag;
    let color = "bg-slate-100 text-slate-700";
    if (newExpense.cat === 'Dining' || newExpense.cat === 'Food') { icon = Coffee; color = "bg-orange-50 text-orange-600"; }
    else if (newExpense.cat === 'Transport') { icon = Car; color = "bg-blue-50 text-blue-600"; }
    else if (newExpense.cat === 'Entertainment') { icon = PieChart; color = "bg-red-50 text-red-600"; }

    const newTx = {
      id: Date.now(),
      name: newExpense.name,
      date: newExpense.date,
      cat: newExpense.cat,
      amt: parseFloat(newExpense.amt),
      icon,
      color
    };

    setExpenses([newTx, ...expenses]);
    setIsAddModalOpen(false);
    setNewExpense({ name: '', cat: 'Shopping', amt: '', date: new Date().toISOString().split('T')[0] });
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="animate-in slide-in-from-left fade-in duration-500">
              <h1 className="text-3xl font-bold text-[#0a192f]">Expense Tracking</h1>
              <p className="text-slate-500 mt-1">Analyze your spending habits and manage budget.</p>
           </div>
           
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-bold text-sm shadow-md shadow-rose-900/20 animate-in slide-in-from-right fade-in duration-500 active:scale-95"
           >
              <Plus size={16} /> Record Expense
           </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <ArrowUpRight size={20} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Spent</p>
              <h3 className="text-2xl font-bold text-[#0a192f] mt-1">{formatCurrency(totalSpent)}</h3>
           </div>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <CreditCard size={20} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Avg. Daily</p>
              <h3 className="text-2xl font-bold text-[#0a192f] mt-1">{formatCurrency(avgDaily)}</h3>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <PieChart size={20} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Top Category</p>
              <h3 className="text-2xl font-bold text-[#0a192f] mt-1">Shopping</h3>
           </div>

           <div className="bg-[#0a192f] p-6 rounded-2xl shadow-lg shadow-slate-900/10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
               <p className="text-white/70 text-xs font-bold uppercase tracking-wide relative z-10">Budget Left</p>
               <h3 className="text-2xl font-bold mt-1 relative z-10">{formatCurrency(budgetLeft)}</h3>
               <div className="w-full h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${budgetProgress > 90 ? 'bg-rose-500' : 'bg-emerald-400'}`} 
                    style={{ width: `${budgetProgress}%` }}
                  ></div>
               </div>
               <p className="text-[10px] text-white/50 mt-2 text-right">{budgetProgress.toFixed(0)}% Used</p>
           </div>
        </div>

        {/* --- MAIN ANALYTICS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* CLEAN WEEKLY SPENDING CHART */}
           <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 z-10">
                 <div>
                    <h3 className="font-bold text-xl text-[#0a192f] flex items-center gap-2">
                        <TrendingDown size={22} className="text-rose-600" />
                        Weekly Spending
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Comparison with previous week</p>
                 </div>
                 {hoveredIndex !== null ? (
                    <div className="animate-in fade-in">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {chartPoints[hoveredIndex].day}
                        </span>
                        <p className="text-lg font-bold text-rose-600">
                            ${chartPoints[hoveredIndex].amt}
                        </p>
                    </div>
                 ) : (
                    <div className="bg-slate-50 px-3 py-2 rounded-lg">
                        <Calendar size={18} className="text-slate-400" />
                    </div>
                 )}
              </div>
              
              {/* Clean Chart Visual */}
              <div className="relative h-64 w-full z-10">
                 <div className="absolute inset-0 flex flex-col justify-between text-slate-300 text-xs font-medium z-0 pointer-events-none">
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-slate-200 w-full h-0"></div>
                 </div>

                 <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    <defs>
                       <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e11d48" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
                       </linearGradient>
                    </defs>
                    
                    {/* Area Fill */}
                    <path d={areaPath} fill="url(#expenseGradient)" />
                    
                    {/* Stroke Line */}
                    <path 
                       d={curvePath} 
                       fill="none" 
                       stroke="#e11d48" 
                       strokeWidth="4" 
                       strokeLinecap="round" 
                       strokeLinejoin="round"
                       className="drop-shadow-sm"
                    />

                    {/* Interactive Points */}
                    {chartPoints.map((point, index) => (
                       <g key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                          {/* Larger hit area */}
                          <circle cx={point.x} cy={point.y} r="30" fill="transparent" className="cursor-pointer" />
                          
                          {/* Visible Point */}
                          <circle 
                             cx={point.x} 
                             cy={point.y} 
                             r={hoveredIndex === index ? 8 : 6} 
                             fill="white" 
                             stroke="#e11d48" 
                             strokeWidth="3" 
                             className={`transition-all duration-300 pointer-events-none ${hoveredIndex === index ? 'filter drop-shadow-md scale-125' : ''}`}
                          />
                       </g>
                    ))}
                 </svg>

                 {/* X-Axis Labels */}
                 <div className="absolute bottom-0 w-full flex justify-between px-4 text-xs font-bold text-slate-400 mt-2">
                    {chartPoints.map((p, i) => (
                        <span key={i} className={`transition-colors ${hoveredIndex === i ? 'text-rose-600' : ''}`}>{p.day}</span>
                    ))}
                 </div>
              </div>
           </div>

           {/* Category Breakdown List */}
           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
               <div>
                   <div className="flex justify-between items-end mb-6">
                       <h3 className="font-bold text-xl text-[#0a192f]">Categories</h3>
                       <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400"><MoreHorizontal size={20} /></button>
                   </div>
                   <div className="space-y-5">
                      {[
                         { name: "Housing & Rent", val: "$1,200", pct: 45, icon: Home, bg: "bg-[#005f73]" },
                         { name: "Food & Dining", val: "$550", pct: 25, icon: Coffee, bg: "bg-[#0a9396]" },
                         { name: "Transportation", val: "$300", pct: 15, icon: Car, bg: "bg-[#94d2bd]" },
                         { name: "Shopping & Misc", val: "$155", pct: 15, icon: ShoppingBag, bg: "bg-[#e9d8a6]" },
                      ].map((cat, i) => (
                         <div key={i} className="flex items-center gap-4 group cursor-pointer">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform ${cat.bg}`}>
                               <cat.icon size={18} />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between mb-1">
                                  <span className="font-bold text-[#0a192f] text-sm">{cat.name}</span>
                                  <span className="font-bold text-[#0a192f] text-sm">{cat.val}</span>
                               </div>
                               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${cat.bg} transition-all duration-1000 ease-out`} style={{ width: `${cat.pct}%` }}></div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
               </div>
               
               <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 animate-in slide-in-from-bottom-2">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div className="text-sm">
                     <span className="font-bold">Budget Alert:</span> You have reached 85% of your Dining budget for this month.
                  </div>
               </div>
           </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-lg text-[#0a192f]">Recent Transactions</h3>
              <div className="flex gap-2">
                 <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={16} />
                    <input type="text" placeholder="Search expenses..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-600 w-full sm:w-64 transition-all" />
                 </div>
                 <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white transition-colors">
                    <Filter size={18} />
                 </button>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold text-left">
                    <tr>
                       <th className="px-6 py-4">Transaction</th>
                       <th className="px-6 py-4">Category</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {expenses.map((tx) => (
                       <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${tx.color}`}>
                                   <tx.icon size={18} />
                                </div>
                                <div>
                                   <p className="font-bold text-[#0a192f] text-sm">{tx.name}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {tx.cat}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{tx.date}</td>
                          <td className="px-6 py-4 text-right font-bold text-red-600 text-sm">
                             -{formatCurrency(tx.amt)}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {expenses.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">No expenses recorded yet.</div>}
           </div>
        </div>

        {/* ADD EXPENSE MODAL */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div 
                    className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsAddModalOpen(false)}
                />
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
                    <div className="bg-rose-600 p-6 text-white flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <TrendingDown size={20} className="bg-white/20 p-1 rounded-lg box-content" />
                            Record New Expense
                        </h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <input 
                                required
                                name="name"
                                value={newExpense.name}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="e.g. Starbucks, Uber..." 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 transition-colors text-sm font-medium" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Amount ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input 
                                        required
                                        name="amt"
                                        type="number" 
                                        min="0"
                                        step="0.01"
                                        value={newExpense.amt}
                                        onChange={handleInputChange}
                                        placeholder="0.00" 
                                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 transition-colors text-sm font-bold text-[#0a192f]" 
                                    />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                <input 
                                    required
                                    name="date"
                                    type="date" 
                                    value={newExpense.date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 transition-colors text-sm text-slate-600" 
                                />
                             </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                            <select 
                                name="cat"
                                value={newExpense.cat}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-600 transition-colors text-sm appearance-none"
                            >
                                <option>Shopping</option>
                                <option>Dining</option>
                                <option>Transport</option>
                                <option>Entertainment</option>
                                <option>Food</option>
                                <option>Bills</option>
                                <option>Other</option>
                            </select>
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
                                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
                            >
                                Save Expense
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

export default Expenses;