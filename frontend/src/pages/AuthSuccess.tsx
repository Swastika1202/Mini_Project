import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      toast({
        title: "Login Successful!",
        description: "You've successfully logged in with Google.",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "No token received from Google authentication.",
        variant: "destructive",
      });
      navigate('/auth'); // Redirect to login if no token
    }
  }, [location, navigate, toast]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p>Processing Google authentication...</p>
    </div>
  );
};

export default AuthSuccess;