import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Bot,
  TrendingUp,
  CreditCard,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  Mic,
  Target,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "../../utils/api";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [balance, setBalance] = useState(0);
  const [fetchedUserName, setFetchedUserName] = useState("User");

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  /* ---------------- SPEECH TO TEXT ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const speech = new SpeechRecognition();
      speech.lang = "en-US";
      speech.interimResults = false;
      speech.continuous = false;

      speech.onresult = (e) => {
        setInputMessage(e.results[0][0].transcript);
        setIsListening(false);
      };

      speech.onend = () => setIsListening(false);
      speech.onerror = () => setIsListening(false);

      recognition.current = speech;
    }
  }, []);

  /* ---------------- FETCH USER DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await api.getProfile();
        setAvatarUrl(profile.data.avatar || "");
        const name = `${profile.data.firstName || ""} ${
          profile.data.lastName || ""
        }`.trim();
        setFetchedUserName(name || "User");

        const dashboard = await api.getDashboardSummary("Monthly");
        setBalance(dashboard.data.netSavings || 0);
      } catch (err) {
        console.error("Dashboard layout fetch error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- CHAT HANDLERS ---------------- */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    setIsLoading(true);

    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      imageUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const formData = new FormData();
      formData.append("prompt", inputMessage);
      formData.append("userName", fetchedUserName);
      formData.append("language", "en");
      if (selectedFile) formData.append("file", selectedFile);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://mini-project-2gg5.onrender.com/api/chatbot",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.response,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
    } finally {
      setInputMessage("");
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognition.current) return;
    if (isListening) recognition.current.stop();
    else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  /* ---------------- NAV ---------------- */
  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: TrendingUp, label: "Income", path: "/income" },
    { icon: CreditCard, label: "Expenses", path: "/expenses" },
    { icon: Target, label: "Future Goals", path: "/future-goals" },
    { icon: Activity, label: "Analytics", path: "/analytics" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  /* ---------------- JSX ---------------- */
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r z-40 transition-all ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-[#005f73] flex items-center justify-center text-white">
              Y
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl">YouthWallet</span>
            )}
          </div>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl ${
                isActive(item.path)
                  ? "bg-[#e0f2f1] text-[#005f73]"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <item.icon size={20} />
              {!isCollapsed && item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 space-y-2 border-t">
          <button className="flex items-center gap-3 w-full px-3 py-2">
            <HelpCircle size={18} /> {!isCollapsed && "Support"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-500"
          >
            <LogOut size={18} /> {!isCollapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 transition-all ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        <header className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between">
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu />
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 px-4 py-2 rounded-full flex items-center gap-2">
              Balance:
              {showBalance ? `₹${balance.toFixed(2)}` : "•••••"}
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <img
              src={
                avatarUrl ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              }
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </div>
        </header>

        <div className="p-6">{children}</div>

        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#0a192f] text-white rounded-full"
        >
          {isChatOpen ? <X /> : <MessageSquare />}
        </button>
      </main>
    </div>
  );
};

export default DashboardLayout;
