import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  TrendingUp, // Added for Income
  CreditCard,  // Added for Expenses
  Eye,         // Added for showing balance
  EyeOff       // Added for hiding balance
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true); // New state for balance visibility
  
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: TrendingUp, label: 'Income', path: '/income' },      // New Link
    { icon: CreditCard, label: 'Expenses', path: '/expenses' },  // New Link
    { icon: Activity, label: 'Analytics', path: '/analytics' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-[#0a192f]">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0a192f]/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        shadow-2xl lg:shadow-none flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-[#005f73] flex items-center justify-center text-white shadow-lg shadow-cyan-900/20 shrink-0">
              <span className="font-bold text-xl">P</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl tracking-tight text-[#0a192f] animate-in fade-in duration-300">Phantom</span>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-medium group relative
                ${isActive(item.path)
                  ? 'bg-[#e0f2f1] text-[#005f73]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#0a192f]'
                } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={22} className={`shrink-0 transition-colors ${isActive(item.path) ? 'text-[#005f73]' : 'text-slate-400 group-hover:text-[#005f73]'}`} />
              
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden transition-all duration-300">{item.label}</span>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-[#0a192f] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1.5 text-slate-500 hover:text-[#005f73] shadow-sm hover:shadow-md transition-all z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          
          <button className={`flex items-center gap-3 px-3 py-3 text-slate-500 hover:text-[#005f73] w-full rounded-xl transition-colors font-medium text-sm ${isCollapsed ? 'justify-center' : ''}`}>
            <HelpCircle size={20} />
            {!isCollapsed && <span>Support</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 w-full rounded-xl transition-colors font-medium text-sm ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 bg-white border border-slate-200 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-[#0a192f] hidden sm:block">
              {menuItems.find(i => isActive(i.path))?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Balance Display with Toggle */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 gap-2 text-sm font-medium text-[#0a192f]">
              <span className="text-slate-500">Balance:</span>
              {showBalance ? (
                <span className="font-bold">$12,450.00</span>
              ) : (
                <span className="font-bold">••••••</span>
              )}
              <button onClick={() => setShowBalance(!showBalance)} className="text-slate-400 hover:text-[#005f73] transition-colors p-1 rounded-full hover:bg-slate-100">
                {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#005f73] transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#005f73] to-[#0a9396] p-[2px] cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/profile')}>
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="w-full h-full rounded-full bg-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 animate-in fade-in duration-500">
          {children}
        </div>

        {/* Chatbot (Preserved from your code) */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
          {isChatOpen && (
            <div className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
               <div className="bg-[#005f73] p-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                     <div className="p-1.5 bg-white/20 rounded-lg"><Bot size={20} /></div>
                     <div><h4 className="font-bold text-sm">Phantom Assistant</h4><p className="text-[10px] opacity-80 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online</p></div>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors"><X size={18} /></button>
               </div>
               <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#005f73] flex items-center justify-center text-white shrink-0"><Bot size={14} /></div>
                     <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-600 max-w-[85%]">Hello Alex! 👋 How can I help you today?</div>
                  </div>
               </div>
               <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex gap-2">
                     <input type="text" placeholder="Ask anything..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#005f73]" />
                     <button className="bg-[#005f73] text-white p-2.5 rounded-xl"><Send size={18} /></button>
                  </div>
               </div>
            </div>
          )}
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-[#0a192f] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:bg-[#005f73] transition-all duration-300 group">
             {isChatOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-bounce" />}
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;