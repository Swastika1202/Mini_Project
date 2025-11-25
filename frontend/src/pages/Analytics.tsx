import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BarChart, // Changed to BarChart
  Bar,      // Changed to Bar
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Defs,
  LinearGradient,
  Stop
} from 'recharts';
import {
  Activity,
  TrendingUp,
  Wallet,
  Target,
  Download,
  MoreHorizontal,
  Car,
  Home,
  Plus,
  X,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from '@/hooks/use-toast';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('This Year');
  const [netWorth, setNetWorth] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [avgMonthlyCashflow, setAvgMonthlyCashflow] = useState(0);
  const [cashflowTrends, setCashflowTrends] = useState([]);
  const [assetAllocation, setAssetAllocation] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    icon: 'Wallet',
  });
  const { toast } = useToast();

  const getGoalIconColor = (iconName) => {
    switch (iconName) {
      case 'Wallet': return 'text-emerald-600 bg-emerald-50';
      case 'Car': return 'text-blue-600 bg-blue-50';
      case 'Home': return 'text-[#005f73] bg-cyan-50';
      case 'Target': return 'text-purple-600 bg-purple-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  // --- Backend Integration ---
  useEffect(() => {
    const fetchAnalyticsSummary = async () => {
      try {
        const response = await api.getAnalyticsSummary(timeRange);
        const data = response.data;
        setNetWorth(data.netWorth);
        setSavingsRate(parseFloat(data.savingsRate));
        setAvgMonthlyCashflow(data.avgMonthlyCashflow);
        setCashflowTrends(data.cashflowTrends);
        setAssetAllocation(data.assetAllocation);
      } catch (error) {
        console.error("Failed to fetch analytics summary:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data.",
          variant: "destructive",
        });
      }
    };
    fetchAnalyticsSummary();
  }, [timeRange, toast]);

  useEffect(() => {
    const fetchFinancialGoals = async () => {
      try {
        const response = await api.getFinancialGoals();
        setFinancialGoals(response.data);
      } catch (error) {
        console.error("Failed to fetch financial goals:", error);
        toast({
          title: "Error",
          description: "Failed to load financial goals.",
          variant: "destructive",
        });
      }
    };
    fetchFinancialGoals();
  }, [toast]);

  const handleSaveGoal = async () => {
    try {
      const goalData = {
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        icon: newGoal.icon,
      };
      const response = await api.createFinancialGoal(goalData);
      setFinancialGoals([...financialGoals, response.data]);
      toast({
        title: "Success",
        description: "Financial goal added successfully.",
      });
      setIsAddGoalModalOpen(false);
      setNewGoal({ name: '', targetAmount: '', icon: 'Wallet' });
    } catch (error) {
      console.error("Failed to add financial goal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add financial goal.",
        variant: "destructive",
      });
    }
  };

  // --- Custom Modern Tooltip ---
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload.find(p => p.dataKey === 'income')?.value || 0;
      const expense = payload.find(p => p.dataKey === 'expense')?.value || 0;
      const net = income - expense;

      return (
        <div className="bg-[#0a192f]/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-700 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
          <p className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">{label}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full bg-emerald-400"></div>
                <span className="text-slate-300 text-sm">Income</span>
              </div>
              <span className="text-white font-bold text-lg">{income.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>

            <div className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full bg-rose-400"></div>
                <span className="text-slate-300 text-sm">Expense</span>
              </div>
              <span className="text-white font-bold text-lg">{expense.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            
            <div className="h-px bg-slate-700 my-1"></div>

            <div className="flex justify-between items-center pt-1">
               <span className="text-slate-400 text-xs font-medium">Net Difference</span>
               <span className={`font-bold text-sm ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {net >= 0 ? '+' : ''}{net.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
               </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="animate-in slide-in-from-left fade-in duration-500">
              <h1 className="text-3xl font-bold text-[#0a192f]">Financial Analytics</h1>
              <p className="text-slate-500 mt-1">Deep dive into your financial health and performance.</p>
           </div>
           
           <div className="flex items-center gap-3 animate-in slide-in-from-right fade-in duration-500">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-2 outline-none focus:border-[#005f73] shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              >
                 <option>Last 6 Months</option>
                 <option>This Year</option>
                 <option>All Time</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#005f73] text-white rounded-xl hover:bg-[#004e5f] transition-all font-bold text-sm shadow-md shadow-cyan-900/20 active:scale-95">
                 <Download size={16} /> Report
              </button>
           </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Net Worth Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Wallet size={24} />
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <TrendingUp size={12} /> +12.5%
                  </span>
               </div>
               <div>
                  <p className="text-slate-500 font-medium text-sm mb-1">Net Worth</p>
                  <h3 className="text-3xl font-bold text-[#0a192f]">{netWorth.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h3>
               </div>
           </div>

           {/* Savings Rate Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Target size={24} />
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-lg">On Track</span>
               </div>
               <div>
                  <p className="text-slate-500 font-medium text-sm mb-1">Savings Rate</p>
                  <div className="flex items-center justify-center relative w-24 h-24 mx-auto mt-2">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-slate-200 stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      />
                      <circle
                        className="text-emerald-500 stroke-current transition-all duration-500 ease-out"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 - (Math.min(savingsRate, 100) / 100) * (2 * Math.PI * 40)}
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-lg font-bold text-[#0a192f]"
                      >
                        {parseFloat(savingsRate).toFixed(0)}%
                      </text>
                    </svg>
                  </div>
               </div>
           </div>

           {/* Cashflow Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#005f73] flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Activity size={24} />
                  </div>
                  <span className="bg-cyan-50 text-[#005f73] text-xs font-bold px-2 py-1 rounded-lg">Stable</span>
               </div>
               <div>
                  <p className="text-slate-500 font-medium text-sm mb-1">Avg. Monthly Cashflow</p>
                  <h3 className="text-3xl font-bold text-[#0a192f]">{Number(avgMonthlyCashflow).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h3>
               </div>
           </div>
        </div>

        {/* --- MAIN CHART SECTION (UPDATED: Modern Bar Chart) --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="font-bold text-xl text-[#0a192f] flex items-center gap-2">
                        Cashflow Trends
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Comparitive Income & Expense Analysis</p>
                </div>
                
                {/* Custom Legend */}
                <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Income
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Expense
                    </div>
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={cashflowTrends}
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                        barGap={8} // Space between Income and Expense bars
                    >
                        {/* Gradient Definitions */}
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#e11d48" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                            dy={15}
                        />
                        
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                        />
                        
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ fill: '#f8fafc', opacity: 0.5 }} // Subtle background highlight on hover
                        />
                        
                        <Bar 
                            dataKey="income" 
                            fill="url(#incomeGradient)" 
                            radius={[6, 6, 0, 0]} // Rounded top corners
                            barSize={16} // Sleek thin bars
                            animationDuration={1500}
                        />
                        
                        <Bar 
                            dataKey="expense" 
                            fill="url(#expenseGradient)" 
                            radius={[6, 6, 0, 0]} // Rounded top corners
                            barSize={16} // Sleek thin bars
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Asset Allocation */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-[#0a192f]">Asset Allocation</h3>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"><MoreHorizontal size={20} /></button>
                </div>
                
                <div className="flex items-center justify-center py-4 gap-8 flex-col sm:flex-row">
                    <div className="relative w-48 h-48 shrink-0">
                        <div className="w-full h-full rounded-full"
                             style={{ background: `conic-gradient(${assetAllocation.map((asset, i, arr) => {
                                const percentage = asset.percentage;
                                const prevPercentages = arr.slice(0, i).reduce((sum, pa) => sum + pa.percentage, 0);
                                const start = prevPercentages;
                                const end = prevPercentages + percentage;
                                const color = ['#005f73', '#0a9396', '#94d2bd', '#e9d8a6'][i % 4];
                                return `${color} ${start}% ${end}%`;
                              }).join(', ')})` }}>
                        </div>
                        <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                            <span className="text-sm text-slate-400 font-medium uppercase">Total</span>
                            <span className="text-2xl font-bold text-[#0a192f]">{netWorth.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        {assetAllocation.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${['bg-[#005f73]', 'bg-[#0a9396]', 'bg-[#94d2bd]', 'bg-[#e9d8a6]'][i % 4]}`}></span>
                                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                                </div>
                                <span className="text-sm font-bold text-[#0a192f]">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial Goals */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-[#0a192f]">Financial Goals</h3>
                    <button 
                      onClick={() => setIsAddGoalModalOpen(true)} 
                      className="text-[#005f73] text-sm font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus size={16} /> Add Goal
                    </button>
                </div>

                <div className="space-y-6">
                    {financialGoals.map((goal, i) => {
                        const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        const goalIcon = {
                          Wallet: Wallet,
                          Car: Car,
                          Home: Home,
                          Target: Target,
                        }[goal.icon] || Wallet;
                        const iconClasses = getGoalIconColor(goal.icon);

                        return (
                            <div key={i} className="group cursor-default">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${iconClasses}`}>
                                            {React.createElement(goalIcon, { size: 18 })}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#0a192f]">{goal.name}</p>
                                            <p className="text-xs text-slate-400">{goal.currentAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} / {goal.targetAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{percent.toFixed(0)}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${percent > 75 ? 'bg-emerald-500' : percent > 50 ? 'bg-amber-400' : 'bg-blue-500'} transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left`} 
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                    <TrendingUp size={20} className="text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-indigo-800">Tip of the day</p>
                        <p className="text-xs text-indigo-600 mt-1">Increasing your savings rate by just 5% can reduce your working years by 2 years.</p>
                    </div>
                </div>
            </div>

        </div>

        {/* Add Goal Modal (Self-contained) */}
        {isAddGoalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-[#0a192f]/50 backdrop-blur-sm" onClick={() => setIsAddGoalModalOpen(false)}></div>
             <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-bold text-[#0a192f]">Add New Goal</h3>
                      <p className="text-sm text-slate-500">Set a target for your financial future.</p>
                   </div>
                   <button onClick={() => setIsAddGoalModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={20} />
                   </button>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Goal Name</label>
                      <input 
                         type="text" 
                         value={newGoal.name}
                         onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#005f73] transition-colors"
                         placeholder="e.g. New Laptop"
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Target Amount (INR)</label>
                      <input 
                         type="number" 
                         value={newGoal.targetAmount}
                         onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#005f73] transition-colors"
                         placeholder="e.g. 1500"
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Icon</label>
                      <div className="grid grid-cols-4 gap-2">
                         {['Wallet', 'Car', 'Home', 'Target'].map((icon) => (
                            <button 
                               key={icon}
                               onClick={() => setNewGoal({ ...newGoal, icon })}
                               className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                                  newGoal.icon === icon 
                                  ? 'border-[#005f73] bg-[#e0f2f1] text-[#005f73]' 
                                  : 'border-slate-200 text-slate-400 hover:border-[#005f73]/50'
                               }`}
                            >
                               {icon === 'Wallet' && <Wallet size={20} />}
                               {icon === 'Car' && <Car size={20} />}
                               {icon === 'Home' && <Home size={20} />}
                               {icon === 'Target' && <Target size={20} />}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="mt-8 flex gap-3">
                   <button 
                      onClick={() => setIsAddGoalModalOpen(false)}
                      className="flex-1 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                   >
                      Cancel
                   </button>
                   <button 
                      onClick={handleSaveGoal}
                      className="flex-1 py-2.5 text-sm font-bold text-white bg-[#005f73] hover:bg-[#004e5f] rounded-xl transition-colors shadow-lg shadow-cyan-900/20"
                   >
                      Save Goal
                   </button>
                </div>

             </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Analytics;