import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { supabase } from "@/integrations/supabase/client"; // Removed Supabase import
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Briefcase } from "lucide-react";
import api from "../utils/api"; // Import the new API utility
// Make sure this path matches your project structure
import authVideo from "../assets/auth.mp4"; 

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [firstName, setFirstName] = useState(""); // Restored firstName state
  const [lastName, setLastName] = useState(""); // Restored lastName state
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // New state for avatar file
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // New state for avatar preview
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  // const handleGoogleLogin = async () => { // Removed Google Login function
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: 'google',
  //       options: {
  //         redirectTo: ${window.location.origin}/,
  //       },
  //     });
  //     if (error) throw error;
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const response = await api.login({ email, password });
        
        // if (error) throw error; // Supabase error handling removed
        
        // Assuming your backend returns a token upon successful login
        localStorage.setItem('token', response.token);

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        // SIGN UP LOGIC
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('designation', designation);
        if (avatarFile) {
          formData.append('avatar', avatarFile);
        }

        const response = await api.register(formData);
        
        // if (error) throw error; // Supabase error handling removed
        
        // Assuming your backend returns a token upon successful registration
        localStorage.setItem('token', response.token);

        toast({
          title: "Account created!",
          description: "Welcome to Phantom Finance. You've successfully signed up.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // MAIN CONTAINER: Changed to h-screen w-full with no padding/margins
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white">
      
      {/* Left Side: Video (Takes 50% width on desktop, Full height) */}
      <div className="hidden md:block w-1/2 h-full relative bg-slate-900">
        <video
          src={authVideo}
          loop
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#005f73]/90 via-[#005f73]/40 to-transparent mix-blend-multiply" />
        
        <div className="absolute bottom-16 left-16 text-white p-4 max-w-lg">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Manage Wealth Wisely</h2>
            <p className="text-slate-100 text-xl leading-relaxed opacity-90">
              Your journey to financial freedom starts here with advanced analytics and intuitive tracking.
            </p>
        </div>
      </div>

      {/* Right Side: Form (Takes 50% width on desktop, Full height) */}
      <div className="w-full md:w-1/2 h-full flex flex-col bg-white relative overflow-y-auto">
        
        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-slate-500 hover:text-[#005f73] hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
        </div>

        {/* Center the form vertically and horizontally */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-md space-y-8"> 
            {/* Logo & Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#005f73] flex items-center justify-center shadow-lg shadow-[#005f73]/20 text-white font-bold text-3xl">
                  P
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#0a192f]">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-slate-500 text-lg">
                {isLogin 
                  ? "Enter your details to access your dashboard" 
                  : "Join us and start tracking your finances today"}
              </p>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={() => { window.location.href = ${import.meta.env.VITE_BACKEND_URL}/api/auth/google; }}
              className="w-full h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium text-base shadow-sm transition-all"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isLogin ? "Sign in with Google" : "Sign up with Google"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                  <Label htmlFor="avatar" className="text-slate-700 font-medium">Avatar</Label>
                  <Input
                    id="avatar"
                    type="file"
                    onChange={handleAvatarChange}
                    className="h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                  />
                  {avatarPreview && (
                    <div className="mt-4 flex justify-center">
                      <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                  <Label htmlFor="designation" className="text-slate-700 font-medium">Designation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="designation"
                      type="text"
                      placeholder="e.g. Financial Analyst"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                      className="pl-9 h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                />
              </div>

              {!isLogin && (
                <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="password"className="text-slate-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2 flex-1 animate-in slide-in-from-top-2 fade-in duration-300">
                    <Label htmlFor="confirmPassword"className="text-slate-700 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="password"className="text-slate-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 bg-slate-50 border-slate-200 focus:border-[#005f73] focus:ring-1 focus:ring-[#005f73] focus:bg-white transition-all"
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                {isLogin && (
                  <a 
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm text-[#005f73] hover:text-[#004e5f] font-semibold hover:underline cursor-pointer transition-all"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#005f73] hover:bg-[#004e5f] text-white h-12 text-base font-semibold shadow-md transition-all hover:shadow-lg mt-4"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center pt-2">
              <p className="text-slate-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-[#005f73] hover:text-[#004e5f] font-semibold hover:underline transition-all"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;