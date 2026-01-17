import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  TrendingUp,
  ArrowDownRight,
  Search,
  Download,
  Filter,
  X,
  Plus,
  Clock,
  BarChart3,
  CheckCircle2,
  Calendar as CalendarIcon,
  Zap,
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "@/hooks/use-toast";

const Income = () => {
  // --- State ---
  const [transactions, setTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({
    name: "",
    ref: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    status: "Received",
    type: "Freelance",
  });
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingClearance, setPendingClearance] = useState(0);
  const [avgTransaction, setAvgTransaction] = useState(0);
  const [incomeGrowth, setIncomeGrowth] = useState([]);
  const [topSources, setTopSources] = useState([]);
  const [period, setPeriod] = useState("weekly");

  const { toast } = useToast();

  // --- Fetch Summary ---
  useEffect(() => {
    const fetchIncomeSummary = async () => {
      try {
        const response = await api.getIncomeSummary(period);
        const data = response.data;

        setTotalRevenue(data.totalRevenue);
        setPendingClearance(data.pendingClearance);
        setAvgTransaction(data.avgTransaction);
        setIncomeGrowth(data.incomeGrowth || []);
        setTopSources(data.topSources || []);
        setTransactions(data.recentIncomes || []);
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncome((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddIncome = async (e) => {
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
        name: "",
        ref: "",
        date: new Date().toISOString().split("T")[0],
        amount: "",
        status: "Received",
        type: "Freelance",
      });

      const response = await api.getIncomeSummary(period);
      const data = response.data;
      setTotalRevenue(data.totalRevenue);
      setPendingClearance(data.pendingClearance);
      setAvgTransaction(data.avgTransaction);
      setIncomeGrowth(data.incomeGrowth || []);
      setTopSources(data.topSources || []);
      setTransactions(data.recentIncomes || []);
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
    const csvContent = transactions
      .map(
        (t) =>
          `${t.name},${t.ref},${t.date},${t.status},${Number(
            t.amount
          ).toFixed(2)},${t.type}`
      )
      .join("\n");

    const blob = new Blob([headers + "\n" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `income_report_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Income Management
            </h1>
            <p className="text-slate-500 mt-1">
              Track your earnings and manage revenue.
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
                      ? "bg-[#005f73] text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm"
            >
              <Download size={16} /> Export
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#005f73] text-white rounded-xl font-bold"
            >
              <Plus size={16} /> Add Income
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<TrendingUp />}
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
          />
          <StatCard
            icon={<Clock />}
            label="Pending Clearance"
            value={formatCurrency(pendingClearance)}
          />
          <StatCard
            icon={<BarChart3 />}
            label="Avg. Transaction"
            value={formatCurrency(avgTransaction)}
          />
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between">
            <h3 className="font-bold text-lg">Recent Incomes</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border rounded-lg text-sm"
                />
              </div>
              <button className="p-2 border rounded-lg">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {transactions.length ? (
            <table className="w-full">
              <thead className="bg-slate-50 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((row) => (
                  <tr key={row._id} className="border-t">
                    <td className="px-6 py-4 font-bold">
                      {row.name || row.title}
                    </td>
                    <td className="px-6 py-4">{row.ref}</td>
                    <td className="px-6 py-4">
                      {new Date(row.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          row.status === "Received"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      +{formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No transactions found.
            </div>
          )}
        </div>

        {/* Add Income Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="bg-white rounded-2xl p-6 z-10 w-full max-w-md">
              <h3 className="font-bold mb-4">Add New Income</h3>
              <form onSubmit={handleAddIncome} className="space-y-4">
                <input
                  name="name"
                  value={newIncome.name}
                  onChange={handleInputChange}
                  placeholder="Source name"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="amount"
                  type="number"
                  value={newIncome.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="w-full border p-2 rounded"
                />
                <button className="w-full bg-[#005f73] text-white py-2 rounded">
                  Save Income
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl border">
    <div className="mb-4">{icon}</div>
    <p className="text-slate-500 text-sm">{label}</p>
    <h3 className="text-3xl font-bold">{value}</h3>
  </div>
);

export default Income;
