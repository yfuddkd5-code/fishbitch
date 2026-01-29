import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import PixelAxolotl from './PixelAxolotl';
import PixelIcon from './PixelIcon';
import FloatingPixels from './FloatingPixels';
import { toast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });

        if (error) throw error;

        toast({
          title: "Account created! 🎮",
          description: "Ask an existing admin to grant you access.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleError) throw roleError;

        if (!roleData) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied 🚫",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome back! 🎉",
          description: "Let's manage some whitelists!",
        });
        
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Oops! 😢",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingPixels />
      
      <div className="pixel-card max-w-md w-full relative z-10">
        <div className="flex flex-col items-center mb-8">
          <PixelAxolotl size={80} variant="cool" className="pixel-float mb-4" />
          <h1 className="font-pixel text-lg text-primary text-center text-shadow-pixel">
            ADMIN ZONE
          </h1>
          <p className="font-pixel-body text-lg text-muted-foreground mt-2">
            Authorized personnel only! 🔐
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-pixel text-xs">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@poki.xyz"
              className="pixel-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-pixel text-xs">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pixel-input"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="pixel-button w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <PixelAxolotl size={20} className="pixel-wiggle" />
                <span>LOADING...</span>
              </>
            ) : (
              <span>{isSignUp ? 'CREATE ACCOUNT' : 'ENTER'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-pixel-body text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign up'}
          </button>
          
          <div>
            <a 
              href="/" 
              className="font-pixel-body text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to whitelist form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
