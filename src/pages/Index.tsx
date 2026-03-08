import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Student-Teacher Learning Portal</h1>
        <p className="text-muted-foreground mb-6">A modern platform for learning and teaching</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate('/login')} className="gradient-primary text-primary-foreground">Sign In</Button>
          <Button onClick={() => navigate('/register')} variant="outline">Create Account</Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
