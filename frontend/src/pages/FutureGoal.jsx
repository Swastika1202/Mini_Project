import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axios from "axios";
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
  PiggyBank,
  Calculator,
} from "lucide-react";

const API_BASE_URL = "https://mini-project-2gg5.onrender.com/api/goals";

// --- Initial State ---
const INITIAL_GOALS = [];

const FutureGoals = () => {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    current: "",
    date: "",
    category: "General",
  });

  const [editGoalData, setEditGoalData] = useState(null);

  // --- Category Helpers ---
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Home":
        return Home;
      case "Car":
        return Car;
      case "Travel":
        return Plane;
      case "Education":
        return GraduationCap;
      case "Gadget":
        return Smartphone;
      default:
        return Gift;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Home":
        return "bg-[#005f73]";
      case "Car":
        return "bg-[#0a9396]";
      case "Travel":
        return "bg-[#94d2bd]";
      case "Education":
        return "bg-[#ee9b00]";
      default:
        return "bg-[#ca6702]";
    }
  };

  // --- Fetch Goals ---
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = response.data.map((goal) => ({
          ...goal,
          id: goal._id,
          target: goal.targetAmount,
          current: goal.currentAmount,
          date: goal.targetDate,
          icon: getCategoryIcon(goal.category),
          color: getCategoryColor(goal.category),
        }));

        setGoals(formatted);
        setLoading(false);
      } catch (err) {
        setError(err?.message || "Failed to fetch goals");
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // --- Derived Metrics ---
  const totalTarget = goals.reduce((a, g) => a + g.target, 0);
  const totalSaved = goals.reduce((a, g) => a + g.current, 0);
  const overallProgress =
    totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // --- Helpers ---
  const calculateMonthlySavings = (target, current, dateStr) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    const months =
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth());

    if (months <= 0) return 0;
    return Math.max((target - current) / months, 0);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val || 0);

  const getProgressQuote = (p) => {
    if (p === 0) return "Every journey begins with a single step.";
    if (p < 25) return "Great start! Keep going.";
    if (p < 50) return "You're on your way!";
    if (p < 75) return "Halfway there!";
    if (p < 90) return "Almost there!";
    return "Final stretch!";
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditGoalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        API_BASE_URL,
        {
          name: newGoal.name,
          targetAmount: parseFloat(newGoal.target),
          currentAmount: parseFloat(newGoal.current) || 0,
          targetDate: newGoal.date,
          category: newGoal.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setGoals((prev) => [
        ...prev,
        {
          id: res.data._id,
          name: res.data.name,
          target: res.data.targetAmount,
          current: res.data.currentAmount,
          date: res.data.targetDate,
          icon: getCategoryIcon(res.data.category),
          color: getCategoryColor(res.data.category),
        },
      ]);

      setIsAddModalOpen(false);
      setNewGoal({
        name: "",
        target: "",
        current: "",
        date: "",
        category: "General",
      });
    } catch (err) {
      setError(err?.message || "Failed to create goal");
    }
  };

  const handleEditClick = (goal) => {
    setEditGoalData({
      ...goal,
      target: goal.target.toString(),
      current: goal.current.toString(),
      date: new Date(goal.date).toISOString().split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    if (!editGoalData?.name) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_BASE_URL}/${editGoalData.id}`,
        {
          name: editGoalData.name,
          targetAmount: parseFloat(editGoalData.target),
          currentAmount: parseFloat(editGoalData.current) || 0,
          targetDate: editGoalData.date,
          category: editGoalData.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setGoals((prev) =>
        prev.map((g) =>
          g.id === res.data._id
            ? {
                id: res.data._id,
                name: res.data.name,
                target: res.data.targetAmount,
                current: res.data.currentAmount,
                date: res.data.targetDate,
                icon: getCategoryIcon(res.data.category),
                color: getCategoryColor(res.data.category),
              }
            : g
        )
      );

      setIsEditModalOpen(false);
      setEditGoalData(null);
    } catch (err) {
      setError(err?.message || "Failed to update goal");
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError(err?.message || "Failed to delete goal");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">Loading goals...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-10 text-red-500">
          Error: {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#0a192f]">
              Future Goals
            </h1>
            <p className="text-slate-500">
              Plan, save, and achieve your dreams.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#005f73] text-white px-4 py-2 rounded-xl font-bold"
          >
            <Plus size={16} className="inline mr-1" /> Add Goal
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            icon={<PiggyBank />}
            label="Total Saved"
            value={formatCurrency(totalSaved)}
          />
          <SummaryCard
            icon={<Target />}
            label="Total Target"
            value={formatCurrency(totalTarget)}
          />
          <div className="bg-[#0a192f] text-white p-6 rounded-2xl">
            <p className="text-sm">Overall Progress</p>
            <h3 className="text-2xl font-bold">
              {overallProgress.toFixed(1)}%
            </h3>
            <div className="w-full bg-white/20 h-2 rounded-full mt-2">
              <div
                className="h-2 bg-[#94d2bd] rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = Math.min(
              (goal.current / goal.target) * 100,
              100
            );
            const monthly = calculateMonthlySavings(
              goal.target,
              goal.current,
              goal.date
            );

            return (
              <div
                key={goal.id}
                className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col"
              >
                <div className="flex justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${goal.color} text-white flex items-center justify-center`}
                  >
                    <goal.icon size={22} />
                  </div>
                  <span className="text-xs text-slate-400">
                    <Calendar size={12} className="inline mr-1" />
                    {new Date(goal.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-lg">{goal.name}</h3>
                <p className="text-sm text-slate-500 mb-3">
                  {formatCurrency(goal.current)} /{" "}
                  {formatCurrency(goal.target)}
                </p>

                <div className="w-full h-3 bg-slate-100 rounded-full mb-4">
                  <div
                    className="h-3 bg-emerald-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500 mb-4">
                  Save{" "}
                  <b className="text-[#005f73]">
                    {formatCurrency(monthly)}
                  </b>{" "}
                  / month
                </p>

                <p className="text-xs italic text-slate-400 mb-4">
                  “{getProgressQuote(progress)}”
                </p>

                <div className="mt-auto flex justify-end gap-3 text-sm">
                  <button
                    onClick={() => handleEditClick(goal)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl border flex items-center gap-4">
    <div className="p-3 rounded-xl bg-slate-100">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase">
        {label}
      </p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  </div>
);

export default FutureGoals;
