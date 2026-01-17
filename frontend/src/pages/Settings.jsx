import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  User,
  Bell,
  Shield,
  Globe,
  LogOut,
  Camera,
  Save,
} from "lucide-react";
import api from "../utils/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true,
    securityAlerts: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        const userData = response.data;

        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setEmail(userData.email || "");
        setPhoneNumber(userData.phoneNumber || "");
        setLocation(userData.location || "");
        setAvatarUrl(userData.avatar || "");
        setNotifications({
          email: userData.notifications?.email ?? true,
          push: userData.notifications?.push ?? false,
          weeklyReport: userData.notifications?.weeklyReport ?? true,
          securityAlerts: userData.notifications?.securityAlerts ?? true,
        });
      } catch (error) {
        console.error("Failed to fetch profile in settings:", error);
      }
    };

    fetchProfile();
  }, []);

  const tabs = [
    { id: "profile", label: "Edit Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-in slide-in-from-left fade-in duration-500">
            <h1 className="text-3xl font-bold text-[#0a192f]">Settings</h1>
            <p className="text-slate-500 mt-1">
              Manage your account settings and preferences.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#005f73] text-white rounded-xl hover:bg-[#004e5f] transition-all font-bold text-sm shadow-md shadow-cyan-900/20 active:scale-95 animate-in slide-in-from-right fade-in duration-500">
            <Save size={18} /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#005f73] text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
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

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile */}
            {activeTab === "profile" && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-[#0a192f] mb-6">
                  Personal Information
                </h2>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden">
                      <img
                        src={
                          avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                            firstName + lastName
                          }`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#0a192f]">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-sm text-slate-500">{email}</p>
                    <button className="mt-2 text-sm font-bold text-[#005f73] hover:underline">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    className="input"
                    value={`${firstName} ${lastName}`}
                    onChange={(e) => {
                      const [first, ...last] = e.target.value.split(" ");
                      setFirstName(first);
                      setLastName(last.join(" "));
                    }}
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-[#0a192f] mb-6">
                  Notification Settings
                </h2>

                {[
                  {
                    key: "email",
                    title: "Email Notifications",
                    desc: "Receive daily summaries and alerts.",
                  },
                  {
                    key: "push",
                    title: "Push Notifications",
                    desc: "Real-time mobile updates.",
                  },
                  {
                    key: "weeklyReport",
                    title: "Weekly Reports",
                    desc: "Weekly activity summary.",
                  },
                  {
                    key: "securityAlerts",
                    title: "Security Alerts",
                    desc: "Suspicious login attempts.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl border"
                  >
                    <div>
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      className={`w-12 h-6 rounded-full p-1 ${
                        notifications[item.key]
                          ? "bg-[#005f73]"
                          : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transform ${
                          notifications[item.key]
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
