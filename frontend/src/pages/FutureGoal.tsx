import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axios from 'axios';
import {
  Target,
  Plus,
  Calendar,
  TrendingUp,
  X,
  Car,
  Home,
  Plane,
  GraduationCap,
  Smartphone,
  Gift,
  Briefcase,
  PiggyBank,
  Calculator
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/goals';

// --- Mock Data ---
const INITIAL_GOALS: any[] = [];

const FutureGoals = () => {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    date: '',
    category: 'General'
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editGoalData, setEditGoalData] = useState<any>(null);

  // --- Helpers for Category ---
  const getCategoryIcon = (cat: string) => {
    switch(cat) {
        case 'Home': return Home;
        case 'Car': return Car;
        case 'Travel': return Plane;
        case 'Education': return GraduationCap;
        case 'Gadget': return Smartphone;
        default: return Gift;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
        case 'Home': return "bg-[#005f73]";
        case 'Car': return "bg-[#0a9396]";
        case 'Travel': return "bg-[#94d2bd]";
        case 'Education': return "bg-[#ee9b00]";
        default: return "bg-[#ca6702]";
    }
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(API_BASE_URL, config);
        console.log("Raw API Response Data:", response.data);
        const goalsWithCategoryInfo = response.data.map((goal: any) => ({
          ...goal,
          id: goal._id, // Ensure consistent ID
          target: goal.targetAmount,
          current: goal.currentAmount,
          date: goal.targetDate,
          icon: getCategoryIcon(goal.category),
          color: getCategoryColor(goal.category),
        }));
        console.log("Processed Goals Data:", goalsWithCategoryInfo);
        setGoals(goalsWithCategoryInfo);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch goals');
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // --- Derived Metrics ---
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.current, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // --- Helpers ---
  const calculateMonthlySavings = (target: number, current: number, dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const months = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
    
    if (months <= 0) return 0;
    const remaining = target - current;
    return remaining > 0 ? remaining / months : 0;
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  // --- Dynamic Quotes Based on Progress ---
  const getProgressQuote = (progress: number) => {
    if (progress === 0) return "Every journey begins with a single step. Start saving!";
    if (progress < 25) return "Great start! Keep building that momentum.";
    if (progress < 50) return "You're on your way! Stay consistent.";
    if (progress < 75) return "Halfway there! Don't stop now.";
    if (progress < 90) return "So close! You can almost touch it.";
    return "Final stretch! Finish strong.";
  };

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditGoalData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      
      const goalData = {
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.target),
        currentAmount: parseFloat(newGoal.current) || 0,
        targetDate: newGoal.date,
        category: newGoal.category,
        icon: newGoal.category, // Storing category as icon for now, will map to actual icon later
      };

      const response = await axios.post(API_BASE_URL, goalData, config);

      const createdGoal = {
        id: response.data._id,
        name: response.data.name,
        target: response.data.targetAmount,
        current: response.data.currentAmount,
        date: response.data.targetDate,
        icon: getCategoryIcon(response.data.category),
        color: getCategoryColor(response.data.category),
      };

      setGoals(prevGoals => [...prevGoals, createdGoal]);
      setIsAddModalOpen(false);
      setNewGoal({ name: '', target: '', current: '', date: '', category: 'General' });
    } catch (err: any) {
      setError(err.message || 'Failed to create goal');
    }
  };

  const handleEditClick = (goal: any) => {
    const formattedDate = goal.date ? new Date(goal.date).toISOString().split('T')[0] : '';
    setEditGoalData({
      id: goal.id,
      name: goal.name,
      target: goal.target.toString(),
      current: goal.current.toString(),
      date: formattedDate,
      category: goal.category,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGoalData.name || !editGoalData.target) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const updatedData = {
        name: editGoalData.name,
        targetAmount: parseFloat(editGoalData.target),
        currentAmount: parseFloat(editGoalData.current) || 0,
        targetDate: editGoalData.date,
        category: editGoalData.category,
        icon: editGoalData.category, // Storing category as icon for now
      };

      const response = await axios.put(`${API_BASE_URL}/${editGoalData.id}`, updatedData, config);

      const updatedGoal = {
        id: response.data._id,
        name: response.data.name,
        target: response.data.targetAmount,
        current: response.data.currentAmount,
        date: response.data.targetDate,
        icon: getCategoryIcon(response.data.category),
        color: getCategoryColor(response.data.category),
      };

      setGoals(prevGoals => prevGoals.map(g => (g.id === updatedGoal.id ? updatedGoal : g)));
      setIsEditModalOpen(false);
      setEditGoalData(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update goal');
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_BASE_URL}/${id}`, config);

      setGoals(prevGoals => prevGoals.filter(g => g.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete goal');
    }
  };

  if (loading) {
    return <DashboardLayout><div className="text-center py-10">Loading goals...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="text-center py-10 text-red-500">Error: {error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="animate-in slide-in-from-left fade-in duration-500">
              <h1 className="text-3xl font-bold text-[#0a192f]">Future Goals</h1>
              <p className="text-slate-500 mt-1">Plan, save, and achieve your dreams.</p>
           </div>
           
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-[#005f73] text-white rounded-xl hover:bg-[#004e5f] transition-all font-bold text-sm shadow-md shadow-cyan-900/20 active:scale-95 animate-in slide-in-from-right fade-in duration-500"
           >
              <Plus size={16} /> Add New Goal
           </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                    <PiggyBank size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Saved</p>
                    <h3 className="text-2xl font-bold text-[#0a192f]">{formatCurrency(totalSaved)}</h3>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                    <Target size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Goal</p>
                    <h3 className="text-2xl font-bold text-[#0a192f]">{formatCurrency(totalTarget)}</h3>
                </div>
            </div>
            <div className="bg-[#0a192f] p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-0 top-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
                <div className="flex justify-between items-end mb-2 relative z-10">
                    <p className="text-white/80 text-sm font-bold">Overall Progress</p>
                    <span className="text-xl font-bold">{overallProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-[#94d2bd] transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
                </div>
            </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {goals.map((goal) => {
                const progress = Math.min((goal.current / goal.target) * 100, 100);
                const monthlyNeeded = calculateMonthlySavings(goal.target, goal.current, goal.date);
                const isGoalAchieved = goal.current >= goal.target;
                const isDatePassed = !isGoalAchieved && new Date(goal.date) < new Date();
                
                return (
                    <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-xl ${goal.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                                <goal.icon size={22} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg mb-1 flex items-center gap-1">
                                    <Calendar size={12} /> 
                                    {isValidDate(goal.date) 
                                      ? new Date(goal.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                                      : 'Invalid Date'
                                    }
                                </span>
                            </div>
                        </div>

                        <h3 className="font-bold text-xl text-[#0a192f] mb-1">{goal.name}</h3>
                        <div className="flex justify-between text-sm text-slate-500 mb-4">
                            <span>Saved: <b className="text-emerald-600">{formatCurrency(goal.current)}</b></span>
                            <span>Target: {formatCurrency(goal.target)}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : goal.color.replace('bg-', 'bg-')}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-end gap-4 mt-2">
                            <button 
                                onClick={() => handleEditClick(goal)} 
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteGoal(goal.id)} 
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>

                        {/* Smart Insight Section - DYNAMIC LOGIC */}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                                <Calculator size={18} className="text-slate-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-slate-700 uppercase mb-0.5">Smart Insight</p>
                                    
                                    {isGoalAchieved ? (
                                        // Condition 1: Goal is met
                                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                            Goal Achieved! 🎉
                                        </p>
                                    ) : isDatePassed ? (
                                        // Condition 2: Date passed but goal not met
                                        <p className="text-xs text-rose-500 font-medium">
                                            Target date passed. Time to review plan.
                                        </p>
                                    ) : (
                                        // Condition 3: In Progress -> Show Savings + Quote
                                        <div className="text-xs text-slate-500">
                                            <p className="mb-1">
                                                Save <span className="font-bold text-[#005f73]">{formatCurrency(monthlyNeeded)}</span>/mo to reach goal.
                                            </p>
                                            <p className="italic text-slate-400">"{getProgressQuote(progress)}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Add Goal Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddModalOpen(false)} />
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-[#005f73] p-6 text-white flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Target size={20} className="bg-white/20 p-1 rounded-lg box-content" />
                            Create New Goal
                        </h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAddGoal} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Goal Name</label>
                            <input required name="name" value={newGoal.name} onChange={handleInputChange} type="text" placeholder="e.g. Tesla Model 3" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Target Amount ($)</label>
                                <input required name="target" type="number" min="0" value={newGoal.target} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] text-sm font-bold" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Current Saved ($)</label>
                                <input name="current" type="number" min="0" value={newGoal.current} onChange={handleInputChange} placeholder="0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] text-sm" />
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                <select name="category" value={newGoal.category} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] text-sm">
                                    <option>General</option>
                                    <option>Home</option>
                                    <option>Car</option>
                                    <option>Travel</option>
                                    <option>Education</option>
                                    <option>Gadget</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Target Date</label>
                                <input required name="date" type="date" value={newGoal.date} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] text-sm text-slate-600" />
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                            <button type="submit" className="flex-1 py-3 bg-[#005f73] text-white font-bold rounded-xl hover:bg-[#004e5f] shadow-lg">Create Goal</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        
        {/* Edit Goal Modal */}
        {isEditModalOpen && editGoalData && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-[#0a9396] p-6 text-white flex justify-between items-center">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Target size={20} className="bg-white/20 p-1 rounded-lg box-content" />
                            Edit Goal
                        </h3>
                        <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleUpdateGoal} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Goal Name</label>
                            <input required name="name" value={editGoalData.name} onChange={handleEditInputChange} type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a9396] transition-colors text-sm font-medium" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Target Amount ($)</label>
                                <input required name="target" type="number" min="0" value={editGoalData.target} onChange={handleEditInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a9396] text-sm font-bold" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Current Saved ($)</label>
                                <input name="current" type="number" min="0" value={editGoalData.current} onChange={handleEditInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a9396] text-sm" />
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                <select name="category" value={editGoalData.category} onChange={handleEditInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a9396] text-sm">
                                    <option>General</option>
                                    <option>Home</option>
                                    <option>Car</option>
                                    <option>Travel</option>
                                    <option>Education</option>
                                    <option>Gadget</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Target Date</label>
                                <input required name="date" type="date" value={editGoalData.date} onChange={handleEditInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a9396] text-sm text-slate-600" />
                            </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                            <button type="submit" className="flex-1 py-3 bg-[#0a9396] text-white font-bold rounded-xl hover:bg-[#0a8286] shadow-lg">Update Goal</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FutureGoals;