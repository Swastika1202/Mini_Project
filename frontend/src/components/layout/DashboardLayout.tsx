import React, { useState, useEffect, useRef } from 'react';
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
  EyeOff,      // Added for hiding balance
  Upload,      // Added for file upload
  Loader2,     // Added for loading state
  Mic          // Added for microphone input
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area'; // Added for ScrollArea
import api from '../../utils/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  imageUrl?: string; // Optional: URL for uploaded image
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true); // New state for balance visibility
  const [avatarUrl, setAvatarUrl] = useState('');
  const [balance, setBalance] = useState(0);
  const [fetchedUserName, setFetchedUserName] = useState('User'); // New state for fetched user name
  const [messages, setMessages] = useState<Message[]>(
    [{ id: 1, text: `Hello ${fetchedUserName}! 👋 How can I help you today?`, sender: "bot", timestamp: new Date().toLocaleTimeString() }]
  ); // Chat messages state
  const [inputMessage, setInputMessage] = useState<string>(''); // Input message state
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Selected file state
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for chatbot response
  const [isListening, setIsListening] = useState(false); // State for speech recognition
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling chat to bottom

  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.current = speechRecognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await api.getProfile();
        setAvatarUrl(profileResponse.data.avatar || '');
        const userFirstName = profileResponse.data.firstName || '';
        const userLastName = profileResponse.data.lastName || '';
        setFetchedUserName(`${userFirstName} ${userLastName}`.trim() || 'User'); // Set fetched user full name

        const dashboardResponse = await api.getDashboardSummary('Monthly'); // Fetch monthly summary for balance
        setBalance(dashboardResponse.data.netSavings);
      } catch (error) {
        console.error("Failed to fetch data in DashboardLayout:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedFile) return;

    setIsLoading(true);
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      ...(selectedFile && { imageUrl: URL.createObjectURL(selectedFile) }),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const formData = new FormData();
      formData.append('prompt', inputMessage);
      formData.append('userName', fetchedUserName); // Use fetchedUserName
      formData.append('language', 'en'); // Or dynamically set based on user preference
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const token = localStorage.getItem('token'); // Get token from localStorage

      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      // Removed the error message from being displayed in the chat
    } finally {
      setInputMessage('');
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

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

  const toggleListening = () => {
    if (recognition.current) {
      if (isListening) {
        recognition.current.stop();
      } else {
        recognition.current.start();
        setIsListening(true);
      }
    }
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
              <span className="font-bold text-xl">Y</span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl tracking-tight text-[#0a192f] animate-in fade-in duration-300">YouthWallet</span>
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
                <span className="font-bold">₹{balance.toFixed(2)}</span>
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
               <img src={avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} alt="User" className="w-full h-full rounded-full bg-white" />
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
                     <div><h4 className="font-bold text-sm">YouthWallet Assistant</h4><p className="text-[10px] opacity-80 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online</p></div>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors"><X size={18} /></button>
               </div>
               <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-4">
               <ScrollArea className="h-full pr-4">
                  {messages.map((message) => (
                     <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                     >
                        <div
                           className={`max-w-[85%] rounded-lg p-3 ${message.sender === 'user'
                              ? 'bg-[#e0f2f1] text-[#0a192f]'
                              : 'bg-white text-slate-600'
                           }`}
                        >
                           {message.imageUrl ? (
                              <img src={message.imageUrl} alt="Uploaded" className="max-w-xs h-auto rounded-lg" />
                           ) : (
                              <p className="text-sm">{message.text}</p>
                           )}
                           <span className="text-xs opacity-50 block text-right mt-1">
                              {message.timestamp}
                           </span>
                        </div>
                     </div>
                  ))}
                  {isLoading && (
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#005f73] flex items-center justify-center text-white shrink-0"><Bot size={14} /></div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-600 max-w-[85%] flex items-center gap-1">
                           <span>Bot is typing</span>
                           <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
                        </div>
                     </div>
                  )}
                  <div ref={messagesEndRef} />
                  </ScrollArea>
               </div>
               <div className="p-4 bg-white border-t border-slate-100">
                  {selectedFile && (
                     <div className="w-full text-sm text-muted-foreground mb-2 flex items-center justify-between">
                        <span>Selected file: {selectedFile.name}</span>
                        <button
                           onClick={() => setSelectedFile(null)}
                           className="text-red-500 hover:text-red-700 ml-2"
                        >
                           <X size={16} />
                        </button>
                     </div>
                  )}
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                        <input
                           type="text"
                           placeholder="Ask anything..."
                           className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 pr-12 py-2 text-sm focus:outline-none focus:border-[#005f73] w-full"
                           value={inputMessage}
                           onChange={(e) => setInputMessage(e.target.value)}
                           onKeyPress={(e) => {
                              if (e.key === 'Enter' && !isLoading) {
                                 handleSendMessage();
                              }
                           }}
                           disabled={isLoading || isListening}
                        />
                        <button 
                           onClick={toggleListening}
                           disabled={isLoading}
                           className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full flex items-center justify-center transition-colors
                              ${isListening ? 'bg-red-500 text-white' : 'text-slate-500 hover:text-[#005f73]'}
                           `}
                        >
                           <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                        </button>
                     </div>
                     <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-500 hover:text-[#005f73] transition-colors">
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                        <Upload size={18} />
                     </label>
                     <button onClick={handleSendMessage} disabled={isLoading} className="bg-[#005f73] text-white p-2.5 rounded-xl flex items-center justify-center">
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                     </button>
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