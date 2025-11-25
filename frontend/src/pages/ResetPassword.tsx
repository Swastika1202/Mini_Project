import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import api from "../utils/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      if (!token) {
        throw new Error("Reset token is missing.");
      }
      await api.resetPassword(token, { password });
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 p-8 md:p-12 lg:p-16 shadow-lg rounded-lg bg-gray-50">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0a192f]">
            Reset Password
          </h1>
          <p className="text-slate-500 text-lg">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">New Password</Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm New Password</Label>
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

          <Button
            type="submit"
            className="w-full bg-[#005f73] hover:bg-[#004e5f] text-white h-12 text-base font-semibold shadow-md transition-all hover:shadow-lg mt-4"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="text-[#005f73] hover:text-[#004e5f] font-semibold hover:underline transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4 inline-block" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

