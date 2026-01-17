import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("This Year");
  const [netWorth, setNetWorth] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [avgMonthlyCashflow, setAvgMonthlyCashflow] = useState(0);
  const [cashflowTrends, setCashflowTrends] = useState([]);
  const [assetAllocation, setAssetAllocation] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    icon: "Wallet",
  });

  const { toast } = useToast();

  const getGoalIconColor = (icon) => {
    switch (icon) {
      case "Wallet":
        return "text-emerald-600 bg-emerald-50";
      case "Car":
        return "text-blue-600 bg-blue-50";
      case "Home":
        return "text-[#005f73] bg-cyan-50";
      case "Target":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.getAnalyticsSummary(timeRange);
        setNetWorth(data.netWorth);
        setSavingsRate(Number(data.savingsRate));
        setAvgMonthlyCashflow(data.avgMonthlyCashflow);
        setCashflowTrends(data.cashflowTrends);
        setAssetAllocation(data.assetAllocation);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load analytics data.",
          variant: "destructive",
        });
      }
    };
    fetchAnalytics();
  }, [timeRange, toast]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const { data } = await api.getFinancialGoals();
        setFinancialGoals(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load financial goals.",
          variant: "destructive",
        });
      }
    };
    fetchGoals();
  }, [toast]);

  const handleSaveGoal = async () => {
    try {
      const payload = {
        name: newGoal.name,
        targetAmount: Number(newGoal.targetAmount),
        icon: newGoal.icon,
      };
      const { data } = await api.createFinancialGoal(payload);
      setFinancialGoals([...financialGoals, data]);
      setIsAddGoalModalOpen(false);
      setNewGoal({ name: "", targetAmount: "", icon: "Wallet" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add goal.",
        variant: "destructive",
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    const income = payload.find(p => p.dataKey === "income")?.value || 0;
    const expense = payload.find(p => p.dataKey === "expense")?.value || 0;
    const net = income - expense;

    return (
      <div className="bg-[#0a192f] p-4 rounded-xl text-white shadow-xl">
        <p className="text-xs text-slate-400 mb-2">{label}</p>
        <p>Income: ₹{income.toLocaleString()}</p>
        <p>Expense: ₹{expense.toLocaleString()}</p>
        <p className={net >= 0 ? "text-emerald-400" : "text-rose-400"}>
          Net: {net >= 0 ? "+" : ""}₹{net.toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#0a192f]">Financial Analytics</h1>
            <p className="text-slate-500">Track long-term performance</p>
          </div>

          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-xl px-4 py-2"
            >
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
            <button className="bg-[#005f73] text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Download size={16} /> Report
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-xl mb-4">Cashflow Trends</h3>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between mb-6">
            <h3 className="font-bold text-xl">Financial Goals</h3>
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="text-[#005f73] flex items-center gap-1"
            >
              <Plus size={16} /> Add Goal
            </button>
          </div>

          <div className="space-y-5">
            {financialGoals.map((goal, i) => {
              const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const Icon = { Wallet, Car, Home, Target }[goal.icon] || Wallet;

              return (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getGoalIconColor(goal.icon)}`}>
                        <Icon size={18} />
                      </div>
                      <span className="font-bold">{goal.name}</span>
                    </div>
                    <span>{percent.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;
