import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Zap,
  TrendingUp,
  ShoppingBag,
  Target,
  Calendar,
  MoreHorizontal,
  Search,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../utils/api";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "https://mini-project-2gg5.onrender.com/api/goals";

const Dashboard = () => {
  const [period, setPeriod] = useState("Weekly");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [spendingTrendData, setSpendingTrendData] = useState([]);
  const [topSpendingCategories, setTopSpendingCategories] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [activeGoalsCount, setActiveGoalsCount] = useState(0);
  const [activeGoalsLoading, setActiveGoalsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.getDashboardSummary(period);
        const d = res.data;

        setTotalIncome(d.totalIncome);
        setTotalExpenses(d.totalExpenses);
        setNetSavings(d.netSavings);
        setSpendingTrendData(d.spendingTrend || []);
        setTopSpendingCategories(d.topSpendingCategories || []);
        setTransactionHistory(d.transactions || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
    };

    const fetchActiveGoals = async () => {
      try {
        setActiveGoalsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date();
        const active = res.data.filter((g) => {
          return (
            g.currentAmount < g.targetAmount &&
            new Date(g.targetDate) > now
          );
        });

        setActiveGoalsCount(active.length);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load active goals.",
          variant: "destructive",
        });
      } finally {
        setActiveGoalsLoading(false);
      }
    };

    fetchDashboardData();
    fetchActiveGoals();
  }, [period, toast]);

  /* ---------- Chart Formatting ---------- */
  const formattedSpendingTrend = useMemo(() => {
    const map = {};

    spendingTrendData.forEach((item) => {
      const date = new Date(item.date);
      let label = "";

      if (period === "Weekly") {
        label = date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (period === "Monthly") {
        label = `Week ${Math.ceil(date.getDate() / 7)}`;
      } else {
        label = date.toLocaleDateString("en-US", { month: "short" });
      }

      map[label] = (map[label] || 0) + item.amount;
    });

    const chart = Object.keys(map).map((k) => ({
      name: k,
      expenses: map[k],
    }));

    if (period === "Weekly") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
        (d) => chart.find((c) => c.name === d) || { name: d, expenses: 0 }
      );
    }

    if (period === "Monthly") {
      return ["Week 1", "Week 2", "Week 3", "Week 4"].map(
        (w) => chart.find((c) => c.name === w) || { name: w, expenses: 0 }
      );
    }

    if (period === "Yearly") {
      return [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ].map(
        (m) => chart.find((c) => c.name === m) || { name: m, expenses: 0 }
      );
    }

    return chart;
  }, [spendingTrendData, period]);

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#0a192f]">
              Financial Overview
            </h1>
            <p className="text-slate-500">
              Track your progress and manage wealth.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-xl border">
            {["Weekly", "Monthly", "Yearly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 font-bold rounded-lg ${
                  period === p
                    ? "bg-[#005f73] text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat icon={<ArrowDownRight />} label="Total Income" value={totalIncome} />
          <Stat icon={<ArrowUpRight />} label="Total Expenses" value={totalExpenses} />
          <Stat icon={<Wallet />} label="Net Savings" value={netSavings} />

          <div
            onClick={() => (window.location.href = "/future-goals")}
            className="bg-white p-6 rounded-2xl border cursor-pointer"
          >
            <Target className="mb-3 text-purple-600" />
            <p className="text-sm text-slate-500">Active Goals</p>
            <h3 className="text-2xl font-bold">
              {activeGoalsLoading ? "..." : `${activeGoalsCount} Goals`}
            </h3>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-bold text-xl mb-4">Spending Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={formattedSpendingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#005f73"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b flex justify-between">
            <h3 className="font-bold">Transaction History</h3>
            <div className="flex gap-2">
              <Search />
              <Calendar />
            </div>
          </div>

          <table className="w-full">
            <tbody>
              {transactionHistory.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="p-4 font-bold">{tx.name}</td>
                  <td className="p-4">{tx.category}</td>
                  <td className="p-4">{new Date(tx.date).toLocaleDateString()}</td>
                  <td
                    className={`p-4 font-bold ${
                      tx.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                  </td>
                  <td className="p-4 text-right">
                    <MoreHorizontal />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl border">
    <div className="mb-3 text-[#005f73]">{icon}</div>
    <p className="text-sm text-slate-500">{label}</p>
    <h3 className="text-2xl font-bold">₹{value.toFixed(2)}</h3>
  </div>
);

export default Dashboard;
