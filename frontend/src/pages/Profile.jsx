import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  Globe,
  Award,
  Linkedin,
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [progress, setProgress] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [cityState, setCityState] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const calculateCompletionPercentage = () => {
    const fields = [
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      cityState,
      profession,
      location,
      linkedinUrl,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const initialCompletionPercentage = calculateCompletionPercentage();
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(
      () => setProgress(initialCompletionPercentage),
      500
    );
    return () => clearTimeout(timer);
  }, [initialCompletionPercentage]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        const userData = response.data;

        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setEmail(userData.email || "");
        setPhoneNumber(userData.phoneNumber || "");
        setCountry(userData.country || "");
        setCityState(userData.cityState || "");
        setProfession(userData.profession || "");
        setLocation(userData.location || "");
        setLinkedinUrl(userData.linkedinUrl || "");
        setNotifications(userData.notifications);
        setAvatarUrl(userData.avatar || "");
        setProgress(calculateCompletionPercentage());
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

      setIsEditing(false);
      setProgress(calculateCompletionPercentage());
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = async (e) => {
    if (!e.target.files || !e.target.files.length) return;

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    try {
      const response = await api.uploadAvatar(formData);
      setAvatarUrl(response.data.avatarUrl);

      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });

      setProgress(calculateCompletionPercentage());
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture.",
        variant: "destructive",
      });
    }
  };

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-[#005f73] to-[#0a9396]" />

          <div className="px-8 pb-8 flex flex-col md:flex-row -mt-12 gap-6">
            {/* Avatar */}
            <div className="relative">
              <svg
                className="absolute -top-[6px] -left-[6px] w-[140px] h-[140px] -rotate-90"
                viewBox="0 0 140 140"
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="4"
                  fill="none"
                />
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
                  className="transition-all duration-1000"
                />
              </svg>

              <img
                src={
                  avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    firstName + lastName
                  }`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover relative z-10"
              />

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />

              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-[#0a192f] text-white p-2 rounded-full shadow-lg"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {firstName} {lastName}
                <CheckCircle2
                  size={22}
                  className="text-[#0a9396]"
                  fill="currentColor"
                />
              </h1>
              <p className="text-slate-500">
                {profession} • {location}
              </p>
            </div>

            <button
              onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
              className="px-6 py-2.5 bg-[#005f73] text-white rounded-xl font-bold"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["First Name", firstName, setFirstName],
              ["Last Name", lastName, setLastName],
              ["Email", email, setEmail],
              ["Phone", phoneNumber, setPhoneNumber],
            ].map(([label, value, setter]) => (
              <div key={label}>
                <label className="text-xs font-bold uppercase text-slate-500">
                  {label}
                </label>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Profile Strength */}
        <div className="bg-[#0a192f] text-white rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-[#10b981]" />
            <div>
              <h3 className="font-bold">Profile Strength</h3>
              <p className="text-xs text-slate-300">
                {initialCompletionPercentage}%
              </p>
            </div>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-[#10b981] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
