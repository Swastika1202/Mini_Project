import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Mail, Phone, MapPin, Bell,
  Camera, CheckCircle2, Globe, User,
  Award, Linkedin
} from 'lucide-react';
import api from '../utils/api';
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [progress, setProgress] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [cityState, setCityState] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();
  
  const calculateCompletionPercentage = () => {
    const totalFields = 9; // firstName, lastName, email, phoneNumber, country, cityState, profession, location, linkedinUrl
    let completedFields = 0;

    if (firstName) completedFields++;
    if (lastName) completedFields++;
    if (email) completedFields++;
    if (phoneNumber) completedFields++;
    if (country) completedFields++;
    if (cityState) completedFields++;
    if (profession) completedFields++;
    if (location) completedFields++;
    if (linkedinUrl) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  // Profile Completion Configuration
  const initialCompletionPercentage = calculateCompletionPercentage();
  const radius = 64; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  
  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => setProgress(initialCompletionPercentage), 500);
    return () => clearTimeout(timer);
  }, [initialCompletionPercentage]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        const userData = response.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber || '');
        setCountry(userData.country || '');
        setCityState(userData.cityState || '');
        setProfession(userData.profession || '');
        setLocation(userData.location || '');
        setLinkedinUrl(userData.linkedinUrl || '');
        setNotifications(userData.notifications);
        setProgress(calculateCompletionPercentage()); // Update progress after fetching profile
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      }
    };
    fetchProfile();
  }, [toast]);

  const handleSaveChanges = async () => {
    try {
      await api.updateProfile({
        firstName,
        lastName,
        email,
        phoneNumber,
        country,
        cityState,
        profession,
        location,
        linkedinUrl,
        notifications,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      setIsEditing(false); // Exit editing mode after saving
      setProgress(calculateCompletionPercentage()); // Update progress after saving
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Enter editing mode
  };

  const handleToggleNotifications = () => {
    setNotifications(!notifications);
  };

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header with Cover & Avatar */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
           {/* Cover Photo */}
           <div className="h-48 bg-gradient-to-r from-[#005f73] to-[#0a9396] relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           </div>
           
           <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-end -mt-12 gap-6">
              {/* Avatar with Progress Circle */}
              <div className="relative group">
                 {/* Progress SVG */}
                 <div className="absolute -top-[6px] -left-[6px] w-[140px] h-[140px] rotate-[-90deg] z-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 140 140">
                        {/* Track */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            stroke="#e2e8f0" // slate-200
                            strokeWidth="4"
                            fill="none"
                        />
                        {/* Indicator - Changed Color to Emerald Green */}
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            stroke="#10b981" 
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                 </div>

                 {/* Avatar Image */}
                 <div className="relative z-10">
                     <img 
                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName + lastName}`} 
                       alt="Profile"
                       className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
                     />
                     {/* Progress Badge */}
                     <div className="absolute top-0 right-0 bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                        {initialCompletionPercentage}%
                     </div>
                 </div>

                 {/* Camera Button */}
                 <button className="absolute bottom-2 right-2 z-20 bg-[#0a192f] text-white p-2 rounded-full hover:bg-[#005f73] transition-colors border-2 border-white shadow-lg">
                    <Camera size={16} />
                 </button>
              </div>
              
              <div className="flex-1 mb-2">
                 <h1 className="text-3xl font-bold text-[#0a192f] flex items-center gap-2">
                    {firstName} {lastName}
                    <CheckCircle2 size={24} className="text-[#0a9396]" fill="currentColor" color="white" />
                 </h1>
                 <p className="text-slate-500 font-medium">{profession} • {location}</p>
              </div>

              <div className="flex gap-3 mb-2">
                 <button 
                    className="px-6 py-2.5 rounded-xl bg-[#005f73] text-white font-bold shadow-lg shadow-[#005f73]/20 hover:bg-[#004e5f] transition-colors"
                    onClick={isEditing ? handleSaveChanges : handleEdit}
                 >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                 </button>
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 px-4">
           {[ 'Personal Info' ].map((tab) => (
              <button 
                 key={tab}
                 onClick={() => setActiveTab(tab.toLowerCase())}
                 className={`pb-4 text-sm font-bold capitalize transition-all relative ${
                    activeTab === tab.toLowerCase() ? 'text-[#005f73]' : 'text-slate-400 hover:text-slate-600'
                 }`}
              >
                 {tab}
                 {activeTab === tab.toLowerCase() && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#005f73] rounded-t-full"></span>
                 )}
              </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Form Section */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                 <h3 className="font-bold text-lg text-[#0a192f] mb-6">Personal Information</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                       <input 
                          type="text" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-slate-50 rounded-xl text-[#0a192f] font-bold border border-transparent focus:bg-white focus:border-[#005f73] outline-none transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                       <input 
                          type="text" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-slate-50 rounded-xl text-[#0a192f] font-bold border border-transparent focus:bg-white focus:border-[#005f73] outline-none transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                             type="email" 
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             disabled={!isEditing}
                             className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-[#0a192f] font-medium border border-transparent focus:bg-white focus:border-[#005f73] outline-none transition-all" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                       <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                             type="tel" 
                             value={phoneNumber}
                             onChange={(e) => setPhoneNumber(e.target.value)}
                             disabled={!isEditing}
                             className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-[#0a192f] font-medium border border-transparent focus:bg-white focus:border-[#005f73] outline-none transition-all" 
                          />
                       </div>
                    </div>
                 </div>

                 <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-lg text-[#0a192f] mb-6">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                          <div className="relative">
                             <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                             <input 
                                type="text" 
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                disabled={!isEditing}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-[#0a192f] font-medium border border-transparent focus:bg-white focus:border-[#005f73] outline-none transition-all" 
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">City/State</label>
                          <div className="relative">
                             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                             <input 
                                type="text" 
                                value={cityState}
                                onChange={(e) => setCityState(e.target.value)}
                                disabled={!isEditing}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-[#0a192f] font-medium border border-transparent focus:bg-white focus:border-[#005f73] outline-none transition-all" 
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* New Social Profiles Section */}
                 <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-lg text-[#0a192f] mb-6">Social Profiles</h3>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase">LinkedIn URL</label>
                       <div className="relative">
                          <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="url" 
                            placeholder="https://linkedin.com/in/username" 
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-[#0a192f] font-medium border border-transparent focus:bg-white focus:border-[#005f73] outline-none transition-all" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Strength Card */}
              <div className="bg-[#0a192f] text-white rounded-2xl p-6 shadow-lg">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                       <Award size={24} className="text-[#10b981]" />
                    </div>
                    <div>
                       <h3 className="font-bold">Profile Strength</h3>
                       <p className="text-xs text-slate-300">Intermediate Level</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#10b981] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 flex justify-between">
                        <span>Completion</span>
                        <span className="text-white font-bold">{initialCompletionPercentage}%</span>
                    </p>
                    <div className="pt-2">
                        <button className="text-xs bg-[#005f73] hover:bg-[#004e5f] text-white w-full py-2 rounded-lg transition-colors font-bold">
                            Complete Profile
                        </button>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;