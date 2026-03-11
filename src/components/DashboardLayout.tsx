import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen, FileText, Cpu, Code, LogOut, LayoutDashboard,
  Upload, Users, Activity, ClipboardCheck, GraduationCap, Menu
} from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const studentLinks = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/materials', icon: FileText, label: 'Study Materials' },
  { to: '/student/ai-tools', icon: Cpu, label: 'AI Tools' },
  { to: '/student/coding', icon: Code, label: 'Coding Hub' },
  { to: '/student/upload', icon: Upload, label: 'Upload Code' },
  { to: '/student/grades', icon: ClipboardCheck, label: 'My Grades' },
];

const teacherLinks = [
  { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/teacher/upload', icon: Upload, label: 'Upload Materials' },
  { to: '/teacher/students', icon: Users, label: 'Student Analytics' },
  { to: '/teacher/online', icon: Activity, label: 'Online Students' },
  { to: '/teacher/review', icon: ClipboardCheck, label: 'Code Review' },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { profile, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = profile?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 border-r border-sidebar-border ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-sidebar-foreground">Learning Portal</h2>
              <p className="text-[11px] text-sidebar-foreground/50 capitalize tracking-wide">{profile?.role} Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto stagger-children">
          {links.map(link => (
            <RouterNavLink key={link.to} to={link.to} end={link.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow' : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                }`}>
              <link.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              {link.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow">
              {profile?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.name}</p>
              <p className="text-xs text-sidebar-foreground/50 capitalize">{profile?.role}</p>
            </div>
          </div>
          <button onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border glass flex items-center px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-3 p-1.5 rounded-xl hover:bg-muted transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {profile?.role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
