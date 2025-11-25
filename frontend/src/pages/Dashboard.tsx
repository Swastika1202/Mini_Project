import { useState, useEffect, useMemo } from 'react';
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
  Target, // Imported Target Icon
  Calendar,
  MoreHorizontal,
  Search
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [period, setPeriod] = useState('Weekly');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [spendingTrendData, setSpendingTrendData] = useState([]);
  const [topSpendingCategories, setTopSpendingCategories] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.getDashboardSummary(period);
        const dashboardData = response.data;
        setTotalIncome(dashboardData.totalIncome);
        setTotalExpenses(dashboardData.totalExpenses);
        setNetSavings(dashboardData.netSavings);
        setSpendingTrendData(dashboardData.spendingTrend);
        setTopSpendingCategories(dashboardData.topSpendingCategories);
        setTransactionHistory(dashboardData.transactions);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
    };
    fetchDashboardData();
  }, [period, toast]);

  const formattedSpendingTrend = useMemo(() => {
    const dataMap: { [key: string]: number } = {};
    spendingTrendData.forEach((item: { date: string | number | Date; amount: any; }) => {
      let label = '';
      const date = new Date(item.date);
      if (period === 'Weekly') {
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (period === 'Monthly') {
        label = `Week ${Math.ceil(date.getDate() / 7)}`;
      } else if (period === 'Yearly') {
        label = date.toLocaleDateString('en-US', { month: 'short' });
      }
      dataMap[label] = (dataMap[label] || 0) + item.amount;
    });

    const chartData = Object.keys(dataMap).map(label => ({
      name: label,
      expenses: dataMap[label],
    }));

    // Ensure consistent order for weekly/monthly/yearly
    if (period === 'Weekly') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => chartData.find(data => data.name === day) || { name: day, expenses: 0 });
    } else if (period === 'Monthly') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      return weeks.map(week => chartData.find(data => data.name === week) || { name: week, expenses: 0 });
    } else if (period === 'Yearly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(month => chartData.find(data => data.name === month) || { name: month, expenses: 0 });
    }
    return chartData;
  }, [spendingTrendData, period]);

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
              {[ 'Weekly', 'Monthly', 'Yearly' ].map((p) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Income Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-default">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowDownRight size={24} />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">+15%</div>
             </div>
             <div>
                <p className="text-slate-500 font-medium text-sm mb-1">Total Income</p>
                <h3 className="text-2xl font-bold text-[#0a192f]">₹{totalIncome.toFixed(2)}</h3>
             </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-default">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <ArrowUpRight size={24} />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">-8%</div>
             </div>
             <div>
                <p className="text-slate-500 font-medium text-sm mb-1">Total Expenses</p>
                <h3 className="text-2xl font-bold text-[#0a192f]">₹{totalExpenses.toFixed(2)}</h3>
             </div>
          </div>

          {/* Savings Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-default">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#005f73] flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Wallet size={24} />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">+22%</div>
             </div>
             <div>
                <p className="text-slate-500 font-medium text-sm mb-1">Net Savings</p>
                <h3 className="text-2xl font-bold text-[#0a192f]">₹{netSavings.toFixed(2)}</h3>
             </div>
          </div>

          {/* NEW: Active Goals Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => window.location.href='/future-goals'}>
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Target size={24} />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">In Progress</div>
             </div>
             <div>
                <p className="text-slate-500 font-medium text-sm mb-1">Active Goals</p>
                <h3 className="text-2xl font-bold text-[#0a192f]">3 Goals</h3>
             </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

           {/* Main Spending Trend (Line Chart) */}
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

              {/* Recharts Line Chart */}
              <div className="relative h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formattedSpendingTrend}
                    margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value}`}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ stroke: '#005f73', strokeWidth: 2 }}
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Expenses']}
                      labelFormatter={(label) => `Period: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderColor: '#e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        padding: '0.5rem 0.75rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                      labelStyle={{ color: '#0a192f', fontWeight: 'bold' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#005f73"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#005f73', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#005f73', stroke: '#fff', strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
                       background: `conic-gradient(${topSpendingCategories.map((cat, i, arr) => {
                          const percentage = (cat.amount / totalExpenses) * 100;
                          const prevPercentages = arr.slice(0, i).reduce((sum, pc) => sum + (pc.amount / totalExpenses) * 100, 0);
                          const start = prevPercentages;
                          const end = prevPercentages + percentage;
                          const color = ['#005f73', '#0a9396', '#94d2bd', '#e9d8a6'][i % 4];
                          return `${color} ${start}% ${end}%`;
                       }).join(', ')})`
                    }}
                 ></div>
                 <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-3xl font-bold text-[#0a192f]">{topSpendingCategories.length > 0 ? `${((topSpendingCategories[0].amount / totalExpenses) * 100).toFixed(0)}%` : '0%'}</span>
                    <span className="text-xs font-medium text-slate-400 uppercase">{topSpendingCategories.length > 0 ? topSpendingCategories[0].category : 'N/A'}</span>
                 </div>
              </div>

              <div className="space-y-3">
                 {topSpendingCategories.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${['bg-[#005f73]', 'bg-[#0a9396]', 'bg-[#94d2bd]', 'bg-[#e9d8a6]'][i % 4]}`}></span>
                          <span className="font-medium text-slate-600">{cat.category}</span>
                       </div>
                       <span className="font-bold text-[#0a192f]">₹{cat.amount.toFixed(2)}</span>
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
                    {transactionHistory.map((tx, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'}`}>
                                   {tx.type === 'income' ? <ArrowDownRight size={18} /> : <ShoppingBag size={18} />}
                                </div>
                                <div>
                                   <p className="font-bold text-[#0a192f] text-sm">{tx.name}</p>
                                   <p className="text-xs text-slate-400">{tx.desc}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{tx.category}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className={`px-6 py-4 font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                             {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
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