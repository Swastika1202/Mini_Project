import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
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
  MoreHorizontal,
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "@/hooks/use-toast";

const Expenses = () => {
  // --- State ---
  const [expenses, setExpenses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [avgDaily, setAvgDaily] = useState(0);
  const [topCategory, setTopCategory] = useState("N/A");
  const [weeklySpending, setWeeklySpending] = useState([]);
  const [budgetLeft, setBudgetLeft] = useState(0);
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [budgetProgress, setBudgetProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [period, setPeriod] = useState("weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const { toast } = useToast();

  // --- Fetch Summary ---
  useEffect(() => {
    const fetchExpenseSummary = async () => {
      try {
        const response = await api.getExpenseSummary(
          period,
          searchTerm,
          filterCategory
        );
        const data = response.data;

        setTotalSpent(data.totalSpent);
        setAvgDaily(data.avgDaily);
        setTopCategory(data.topCategory);
        setWeeklySpending(data.spendingTrend || []);
        setBudgetLeft(data.budgetLeft);
        setBudgetUsed(data.budgetUsed);
        setBudgetProgress(data.budgetProgress);
        setCategories(data.categories || []);
        setExpenses(data.recentExpenses || []);
      } catch (error) {
        console.error("Failed to fetch expense summary:", error);
        toast({
          title: "Error",
          description: "Failed to load expense data.",
          variant: "destructive",
        });
      }
    };

    fetchExpenseSummary();
  }, [period, searchTerm, filterCategory, toast]);

  // --- Form State ---
  const [newExpense, setNewExpense] = useState({
    name: "",
    cat: "Shopping",
    amt: "",
    date: new Date().toISOString().split("T")[0],
  });

  // --- Helpers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amt) return;

    try {
      await api.addExpense({
        name: newExpense.name,
        date: new Date(newExpense.date),
        category: newExpense.cat,
        amount: parseFloat(newExpense.amt),
      });

      toast({
        title: "Success",
        description: "Expense recorded successfully.",
      });

      setIsAddModalOpen(false);
      setNewExpense({
        name: "",
        cat: "Shopping",
        amt: "",
        date: new Date().toISOString().split("T")[0],
      });

      const response = await api.getExpenseSummary(
        period,
        searchTerm,
        filterCategory
      );
      const data = response.data;

      setTotalSpent(data.totalSpent);
      setAvgDaily(data.avgDaily);
      setTopCategory(data.topCategory);
      setWeeklySpending(data.spendingTrend || []);
      setBudgetLeft(data.budgetLeft);
      setBudgetUsed(data.budgetUsed);
      setBudgetProgress(data.budgetProgress);
      setCategories(data.categories || []);
      setExpenses(data.recentExpenses || []);
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val || 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0a192f]">
              Expense Tracking
            </h1>
            <p className="text-slate-500 mt-1">
              Analyze your spending habits and manage budget.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white p-1 rounded-xl border">
              {["weekly", "monthly", "yearly"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg ${
                    period === p
                      ? "bg-rose-600 text-white"
                      : "text-slate-500 hover:bg-rose-50"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold"
            >
              <Plus size={16} /> Record Expense
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<ArrowUpRight />}
            label="Total Spent"
            value={formatCurrency(totalSpent)}
            color="rose"
          />
          <StatCard
            icon={<CreditCard />}
            label="Avg. Daily"
            value={formatCurrency(avgDaily)}
            color="blue"
          />
          <StatCard
            icon={<PieChart />}
            label="Top Category"
            value={topCategory}
            color="amber"
          />
          <div className="bg-[#0a192f] p-6 rounded-2xl text-white">
            <p className="text-xs uppercase opacity-70">Budget Left</p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(budgetLeft)}
            </h3>
            <div className="w-full h-1.5 bg-white/20 rounded-full mt-4">
              <div
                className={`h-full rounded-full ${
                  budgetProgress > 90 ? "bg-rose-500" : "bg-emerald-400"
                }`}
                style={{ width: `${budgetProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-right opacity-60 mt-2">
              {budgetProgress.toFixed(0)}% Used
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-6 border-b flex justify-between">
            <h3 className="font-bold text-lg">Recent Transactions</h3>
            <div className="flex gap-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search expenses..."
                className="px-3 py-2 bg-slate-50 border rounded-lg text-sm"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border rounded-lg text-sm"
              >
                <option value="All">All</option>
                {categories.map((c, i) => (
                  <option key={i} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {expenses.length ? (
            <table className="w-full">
              <thead className="bg-slate-50 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((tx) => (
                  <tr key={tx._id} className="border-t">
                    <td className="px-6 py-4 font-bold">{tx.name}</td>
                    <td className="px-6 py-4">{tx.category}</td>
                    <td className="px-6 py-4">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-red-600 font-bold">
                      -{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No expenses recorded yet.
            </div>
          )}
        </div>

        {/* Add Expense Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="bg-white rounded-2xl p-6 z-10 w-full max-w-md">
              <h3 className="font-bold mb-4">Record Expense</h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <input
                  name="name"
                  value={newExpense.name}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="amt"
                  type="number"
                  value={newExpense.amt}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="w-full border p-2 rounded"
                />
                <button className="w-full bg-rose-600 text-white py-2 rounded">
                  Save Expense
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-2xl border">
    <div className={`w-10 h-10 mb-3 flex items-center justify-center`}>
      {icon}
    </div>
    <p className="text-xs uppercase text-slate-500">{label}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default Expenses;
