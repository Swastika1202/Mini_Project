import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Zap,
  TrendingUp,
  ShoppingBag,
  Coffee,
  Car,
  PieChart,
  Calendar,
  MoreHorizontal,
  Search // <-- Ye add kar diya hai
} from 'lucide-react';

const Dashboard = () => {
  const [period, setPeriod] = useState('Weekly');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
           <div className="animate-in slide-in-from-left fade-in duration-500">
              <h1 className="text-3xl font-bold text-[#0a192f]">Financial Overview</h1>
              <p className="text-slate-500 mt-1">Track your progress and manage your wealth efficiently.</p>
           </div>
           
           <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-right fade-in duration-500">
              {['Weekly', 'Monthly', 'Yearly'].map((p) => (
                 <button 
                    key={p} 
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                       period === p 
                       ? 'bg-[#005f73] text-white shadow-sm' 
                       : 'text-slate-500 hover:text-[#005f73] hover:bg-slate-50'
                    }`}
                 >
                    {p}
                 </button>
              ))}
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { title: 'Total Income', val: '$8,450.00', inc: '+15%', isPos: true, icon: ArrowDownRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { title: 'Total Expenses', val: '$2,205.50', inc: '-8%', isPos: true, icon: ArrowUpRight, color: 'text-rose-600', bg: 'bg-rose-50' },
             { title: 'Net Savings', val: '$6,244.50', inc: '+22%', isPos: true, icon: Wallet, color: 'text-[#005f73]', bg: 'bg-cyan-50' },
          ].map((item, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-default">
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon size={24} />
                   </div>
                   <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.isPos ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.inc} vs last month
                   </div>
                </div>
                <div>
                   <p className="text-slate-500 font-medium text-sm mb-1">{item.title}</p>
                   <h3 className="text-3xl font-bold text-[#0a192f]">{item.val}</h3>
                </div>
             </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Main Spending Trend (Curved Line Chart Visual) */}
           <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                 <div>
                    <h3 className="font-bold text-xl text-[#0a192f] flex items-center gap-2">
                       <TrendingUp size={22} className="text-[#005f73]" />
                       Spending Trend
                    </h3>
                    <p className="text-sm text-slate-500">Comparison with last period</p>
                 </div>
                 <div className="bg-[#e0f2f1] text-[#005f73] px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                    <Zap size={14} fill="currentColor" />
                    <span>-12% Expenses</span>
                 </div>
              </div>

              {/* Advanced Chart Visualization (CSS + SVG) */}
              <div className="relative h-64 w-full">
                 {/* Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between text-slate-300 text-xs font-medium z-0">
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                    <div className="border-b border-dashed border-slate-100 w-full h-0"></div>
                 </div>

                 {/* The Curve */}
                 <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none">
                    <defs>
                       <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#005f73" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#005f73" stopOpacity="0" />
                       </linearGradient>
                    </defs>
                    {/* Fill Area */}
                    <path 
                       d="M0,200 C100,150 200,220 300,100 C400,0 500,120 600,80 C700,50 800,150 1200,100 L1200,256 L0,256 Z" 
                       fill="url(#gradient)" 
                    />
                    {/* Stroke Line */}
                    <path 
                       d="M0,200 C100,150 200,220 300,100 C400,0 500,120 600,80 C700,50 800,150 1200,100" 
                       fill="none" 
                       stroke="#005f73" 
                       strokeWidth="4" 
                       strokeLinecap="round"
                       className="drop-shadow-lg"
                    />
                    {/* Points */}
                    <circle cx="300" cy="100" r="6" fill="white" stroke="#005f73" strokeWidth="3" className="hover:scale-150 transition-all cursor-pointer"/>
                    <circle cx="600" cy="80" r="6" fill="white" stroke="#005f73" strokeWidth="3" className="hover:scale-150 transition-all cursor-pointer"/>
                 </svg>

                 {/* X Axis Labels */}
                 <div className="absolute bottom-0 w-full flex justify-between text-xs font-bold text-slate-400 mt-2">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                 </div>
              </div>
           </div>

           {/* Category Breakdown (Donut Chart) */}
           <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                 <h3 className="font-bold text-xl text-[#0a192f] mb-1">Top Spending</h3>
                 <p className="text-sm text-slate-500">By Category</p>
              </div>

              <div className="relative w-48 h-48 mx-auto my-6">
                 {/* CSS Conic Gradient for Donut Chart */}
                 <div 
                    className="w-full h-full rounded-full"
                    style={{
                       background: 'conic-gradient(#005f73 0% 45%, #0a9396 45% 70%, #94d2bd 70% 85%, #e9d8a6 85% 100%)'
                    }}
                 ></div>
                 <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-bold text-[#0a192f]">45%</span>
                    <span className="text-xs font-medium text-slate-400 uppercase">Housing</span>
                 </div>
              </div>

              <div className="space-y-3">
                 {[
                    { label: 'Housing', val: '45%', color: 'bg-[#005f73]' },
                    { label: 'Food', val: '25%', color: 'bg-[#0a9396]' },
                    { label: 'Transport', val: '15%', color: 'bg-[#94d2bd]' },
                 ].map((cat, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${cat.color}`}></span>
                          <span className="font-medium text-slate-600">{cat.label}</span>
                       </div>
                       <span className="font-bold text-[#0a192f]">{cat.val}</span>
                    </div>
                 ))}
              </div>
           </div>

        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#0a192f]">Transaction History</h3>
              <div className="flex gap-2">
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                    <Search size={20} />
                 </button>
                 <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                    <Calendar size={20} />
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
                       <th className="px-6 py-4">Amount</th>
                       <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {[
                       { name: "Apple Store", desc: "Iphone 15 Pro Max", cat: "Electronics", date: "Nov 23, 2025", amt: "-$1,199.00", icon: ShoppingBag, color: "bg-slate-100 text-slate-700" },
                       { name: "Starbucks", desc: "Morning Coffee", cat: "Dining", date: "Nov 23, 2025", amt: "-$5.50", icon: Coffee, color: "bg-orange-50 text-orange-600" },
                       { name: "Uber Ride", desc: "Office Commute", cat: "Transport", date: "Nov 22, 2025", amt: "-$24.20", icon: Car, color: "bg-blue-50 text-blue-600" },
                       { name: "Upwork Inc.", desc: "Project Payment", cat: "Income", date: "Nov 21, 2025", amt: "+$2,450.00", icon: ArrowDownRight, color: "bg-emerald-50 text-emerald-600" },
                    ].map((tx, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.color}`}>
                                   <tx.icon size={18} />
                                </div>
                                <div>
                                   <p className="font-bold text-[#0a192f] text-sm">{tx.name}</p>
                                   <p className="text-xs text-slate-400">{tx.desc}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{tx.cat}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{tx.date}</td>
                          <td className={`px-6 py-4 font-bold text-sm ${tx.amt.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                             {tx.amt}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-2 text-slate-300 hover:text-[#005f73] transition-colors">
                                <MoreHorizontal size={20} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;