import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl float" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl float" style={{ animationDelay: '1.5s' }} />

      <div className="text-center animate-fade-in relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6 animate-scale-bounce shadow-glow">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Student-Teacher Learning Portal</h1>
        <p className="text-muted-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>A modern platform for learning and teaching</p>
        <div className="flex gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
          <Button onClick={() => navigate('/login')} className="gradient-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all">Sign In</Button>
          <Button onClick={() => navigate('/register')} variant="outline" className="hover:shadow-glow active:scale-[0.97] transition-all">Create Account</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
