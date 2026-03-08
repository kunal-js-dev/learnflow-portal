import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  createdAt: string;
  onlineStatus: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Mock data for demo - will be replaced with Lovable Cloud
const MOCK_USERS: (User & { password: string })[] = [
  { id: '1', name: 'John Student', email: 'student@demo.com', password: 'demo123', role: 'student', createdAt: '2024-01-15', onlineStatus: true },
  { id: '2', name: 'Jane Teacher', email: 'teacher@demo.com', password: 'demo123', role: 'teacher', createdAt: '2024-01-10', onlineStatus: true },
  { id: '3', name: 'Alice Smith', email: 'alice@demo.com', password: 'demo123', role: 'student', createdAt: '2024-02-20', onlineStatus: false },
  { id: '4', name: 'Bob Wilson', email: 'bob@demo.com', password: 'demo123', role: 'student', createdAt: '2024-03-01', onlineStatus: true },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('portal_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem('portal_user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    if (MOCK_USERS.find(u => u.email === email)) throw new Error('Email already exists');
    const newUser: User = {
      id: String(Date.now()),
      name, email, role,
      createdAt: new Date().toISOString().split('T')[0],
      onlineStatus: true,
    };
    setUser(newUser);
    localStorage.setItem('portal_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portal_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export mock data for teacher dashboard
export const getMockStudents = () => MOCK_USERS.filter(u => u.role === 'student');
export const getMockOnlineStudents = () => MOCK_USERS.filter(u => u.role === 'student' && u.onlineStatus);
