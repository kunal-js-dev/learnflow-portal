import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Cpu, Code, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudyMaterials = React.lazy(() => import('@/components/student/StudyMaterials'));
const AITools = React.lazy(() => import('@/components/student/AITools'));
const CodingHub = React.lazy(() => import('@/components/student/CodingHub'));
const MyGrades = React.lazy(() => import('@/components/student/MyGrades'));

const quickLinks = [
  { to: '/student/materials', icon: FileText, label: 'Study Materials', desc: 'Download learning resources', color: 'bg-primary/10 text-primary' },
  { to: '/student/ai-tools', icon: Cpu, label: 'AI Tools', desc: 'Explore AI productivity tools', color: 'bg-accent/10 text-accent' },
  { to: '/student/coding', icon: Code, label: 'Coding Hub', desc: 'Practice coding skills', color: 'bg-warning/10 text-warning' },
  { to: '/student/grades', icon: BookOpen, label: 'My Grades', desc: 'View grades & feedback', color: 'bg-success/10 text-success' },
];

const StudentHome = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h2 className="text-xl font-bold text-foreground">Welcome back! 👋</h2>
      <p className="text-sm text-muted-foreground mt-1">Start learning with the tools below</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {quickLinks.map(link => (
        <Link key={link.to} to={link.to}>
          <Card className="shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer h-full">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.color}`}><link.icon className="w-6 h-6" /></div>
              <div>
                <p className="font-semibold text-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);

const StudentDashboard = () => (
  <DashboardLayout>
    <React.Suspense fallback={<div className="flex items-center justify-center h-32 text-muted-foreground">Loading...</div>}>
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="materials" element={<StudyMaterials />} />
        <Route path="ai-tools" element={<AITools />} />
        <Route path="coding" element={<CodingHub />} />
        <Route path="grades" element={<MyGrades />} />
      </Routes>
    </React.Suspense>
  </DashboardLayout>
);

export default StudentDashboard;
