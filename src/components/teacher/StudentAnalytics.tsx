import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const StudentAnalytics = () => {
  const [students, setStudents] = useState<Tables<'profiles'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false });
      if (data) setStudents(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-32 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Student Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of registered students</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{students.length}</p>
            <p className="text-sm text-muted-foreground">Total Registered Students</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elevated">
        <CardHeader><CardTitle className="text-base">Student List</CardTitle></CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Registered</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 px-3 font-medium text-foreground">{s.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.online_status ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                          {s.online_status ? 'Online' : 'Offline'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAnalytics;
