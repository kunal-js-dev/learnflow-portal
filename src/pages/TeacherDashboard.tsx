import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Users, Activity, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const TeacherUpload = React.lazy(() => import('@/components/teacher/TeacherUpload'));
const StudentAnalytics = React.lazy(() => import('@/components/teacher/StudentAnalytics'));
const OnlineStudents = React.lazy(() => import('@/components/teacher/OnlineStudents'));
const CodeReview = React.lazy(() => import('@/components/teacher/CodeReview'));

const TeacherHome = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { count: total } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
      const { count: online } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('online_status', true);
      setStudentCount(total || 0);
      setOnlineCount(online || 0);
    };
    fetch();
  }, []);

  const stats = [
    { to: '/teacher/upload', icon: Upload, label: 'Upload Materials', value: 'Manage', color: 'bg-primary/10 text-primary' },
    { to: '/teacher/students', icon: Users, label: 'Total Students', value: String(studentCount), color: 'bg-accent/10 text-accent' },
    { to: '/teacher/online', icon: Activity, label: 'Online Now', value: String(onlineCount), color: 'bg-success/10 text-success' },
    { to: '/teacher/review', icon: ClipboardCheck, label: 'Code Review', value: 'Review', color: 'bg-warning/10 text-warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Welcome, Teacher! 📚</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your classroom</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(s => (
          <Link key={s.to} to={s.to}>
            <Card className="shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-6 h-6" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

const TeacherDashboard = () => (
  <DashboardLayout>
    <React.Suspense fallback={<div className="flex items-center justify-center h-32 text-muted-foreground">Loading...</div>}>
      <Routes>
        <Route index element={<TeacherHome />} />
        <Route path="upload" element={<TeacherUpload />} />
        <Route path="students" element={<StudentAnalytics />} />
        <Route path="online" element={<OnlineStudents />} />
        <Route path="review" element={<CodeReview />} />
      </Routes>
    </React.Suspense>
  </DashboardLayout>
);

export default TeacherDashboard;
