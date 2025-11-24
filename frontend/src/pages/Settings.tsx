import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  User,
  Bell,
  Shield,
  Globe,
  LogOut,
  Camera,
  Save,
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true,
    securityAlerts: true
  });

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="animate-in slide-in-from-left fade-in duration-500">
              <h1 className="text-3xl font-bold text-[#0a192f]">Settings</h1>
              <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#005f73] text-white rounded-xl hover:bg-[#004e5f] transition-all font-bold text-sm shadow-md shadow-cyan-900/20 active:scale-95 animate-in slide-in-from-right fade-in duration-500">
              <Save size={18} /> Save Changes
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#005f73] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-200">
               <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                  <LogOut size={18} /> Sign Out
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-[#0a192f] mb-6">Personal Information</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#0a192f]">Alex Morgan</h3>
                    <p className="text-sm text-slate-500">alex.morgan@example.com</p>
                    <button className="mt-2 text-sm font-bold text-[#005f73] hover:underline">Change Avatar</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input type="text" defaultValue="Alex Morgan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium text-[#0a192f]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <input type="email" defaultValue="alex.morgan@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium text-[#0a192f]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium text-[#0a192f]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                    <input type="text" defaultValue="New York, USA" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium text-[#0a192f]" />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-[#0a192f] mb-6">System Preferences</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium text-[#0a192f] appearance-none">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Language</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium text-[#0a192f] appearance-none">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-[#005f73] bg-[#e0f2f1] text-[#005f73]">
                        <div className="w-full h-12 bg-white rounded-lg shadow-sm border border-slate-200"></div>
                        <span className="text-xs font-bold">Light</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100">
                        <div className="w-full h-12 bg-[#0a192f] rounded-lg shadow-sm"></div>
                        <span className="text-xs font-bold">Dark</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100">
                        <div className="w-full h-12 bg-gradient-to-br from-white to-slate-200 rounded-lg shadow-sm"></div>
                        <span className="text-xs font-bold">System</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-[#0a192f] mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  {[
                    { key: 'email', title: 'Email Notifications', desc: 'Receive daily summaries and critical alerts via email.' },
                    { key: 'push', title: 'Push Notifications', desc: 'Get real-time updates on your mobile device.' },
                    { key: 'weeklyReport', title: 'Weekly Reports', desc: 'A detailed breakdown of your weekly finances.' },
                    { key: 'securityAlerts', title: 'Security Alerts', desc: 'Immediate notifications for suspicious login attempts.' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                      <div>
                        <h3 className="font-bold text-[#0a192f] text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${notifications[item.key as keyof typeof notifications] ? 'bg-[#005f73]' : 'bg-slate-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-[#0a192f] mb-6">Security & Login</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                    <input type="password" placeholder="••••••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                      <input type="password" placeholder="••••••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
                      <input type="password" placeholder="••••••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005f73] transition-colors text-sm font-medium" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 mt-4">
                    <h3 className="font-bold text-[#0a192f] mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-[#e0f2f1] rounded-xl border border-[#b2dfdb]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-[#005f73]">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[#005f73] text-sm">2FA is currently Enabled</p>
                          <p className="text-xs text-[#005f73]/80">Your account is secure.</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-white bg-[#005f73] px-3 py-1.5 rounded-lg hover:bg-[#004e5f] transition-colors">Configure</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;