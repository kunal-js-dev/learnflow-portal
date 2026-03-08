import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Circle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const OnlineStudents = () => {
  const [online, setOnline] = useState<Tables<'profiles'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'student').eq('online_status', true);
      if (data) setOnline(data);
      setLoading(false);
    };
    fetch();
    // Refresh every 30 seconds
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-32 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Online Student Monitoring</h2>
        <p className="text-sm text-muted-foreground mt-1">See which students are currently active</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{online.length}</p>
            <p className="text-sm text-muted-foreground">Students Online Now</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elevated">
        <CardHeader><CardTitle className="text-base">Active Students</CardTitle></CardHeader>
        <CardContent>
          {online.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students online right now.</p>
          ) : (
            <div className="space-y-2">
              {online.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="w-2.5 h-2.5 fill-success text-success animate-pulse-dot" />
                    <span className="text-xs text-success font-medium">Online</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineStudents;
