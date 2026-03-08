import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      navigate(profile.role === 'teacher' ? '/teacher' : '/student', { replace: true });
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl float" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-accent/5 blur-3xl float" style={{ animationDelay: '1.5s' }} />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4 animate-scale-bounce shadow-glow">
            <BookOpen className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
          <p className="text-muted-foreground mt-1 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>Sign in to your learning portal</p>
        </div>

        <Card className="shadow-elevated border-border/50 hover-lift animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3 animate-fade-in">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 transition-shadow focus:shadow-glow" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 transition-shadow focus:shadow-glow" required />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all" disabled={loading}>
                {loading ? <span className="animate-pulse-dot">Signing in...</span> : <><LogIn className="w-4 h-4 mr-2" /> Sign In</>}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
