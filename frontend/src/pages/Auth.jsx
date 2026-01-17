import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Briefcase } from "lucide-react";
import api from "../utils/api";
import authVideo from "../assets/auth.mp4";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      toast({
        title: "Password Reset Link Sent",
        description: "Please check your email for instructions to reset your password.",
      });
      setIsForgotPassword(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.login({ email, password });
        localStorage.setItem("token", response.token);

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });

        navigate("/dashboard");
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("designation", designation);
        if (avatarFile) formData.append("avatar", avatarFile);

        const response = await api.register(formData);
        localStorage.setItem("token", response.token);

        toast({
          title: "Account created!",
          description: "Welcome to YouthWallet.",
        });

        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white">
      {/* LEFT VIDEO */}
      <div className="hidden md:block w-1/2 h-full relative bg-slate-900">
        <video
          src={authVideo}
          loop
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#005f73]/90 via-[#005f73]/40 to-transparent" />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-center text-[#0a192f]">
            {isForgotPassword
              ? "Forgot Password"
              : isLogin
              ? "Welcome Back"
              : "Create Account"}
          </h1>

          {!isForgotPassword && (
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <Input placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                  <Input type="file" onChange={handleAvatarChange} />
                </>
              )}

              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

              {!isLogin && (
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              {isLogin && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-[#005f73] hover:underline"
                >
                  Forgot Password?
                </button>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
          )}

          {isForgotPassword && (
            <>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleForgotPassword} className="w-full">
                Send Reset Link
              </Button>
              <button onClick={() => setIsForgotPassword(false)} className="text-sm text-[#005f73] hover:underline">
                Back to Login
              </button>
            </>
          )}

          {!isForgotPassword && (
            <p className="text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#005f73] font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
