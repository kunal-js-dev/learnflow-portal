import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Submission {
  id: string;
  language: string;
  code: string;
  time_taken: number;
  grade: string | null;
  feedback: string | null;
  screenshot_url: string | null;
  submitted_at: string;
}

const gradeColor = (grade: string | null) => {
  if (!grade) return 'bg-muted text-muted-foreground';
  if (grade.startsWith('A')) return 'bg-success/10 text-success';
  if (grade.startsWith('B')) return 'bg-primary/10 text-primary';
  return 'bg-warning/10 text-warning';
};

const MyGrades = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('code_submissions')
        .select('*')
        .eq('student_id', user.id)
        .order('submitted_at', { ascending: false });
      if (data) setSubmissions(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-32 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">My Grades & Feedback</h2>
        <p className="text-sm text-muted-foreground mt-1">View your code submission grades and teacher feedback</p>
      </div>

      {submissions.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-8 text-center text-muted-foreground">No submissions yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {submissions.map(g => (
            <Card key={g.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">{g.language}</span>
                      <span className="text-xs text-muted-foreground">{new Date(g.submitted_at).toLocaleDateString()}</span>
                      <span className="text-xs text-muted-foreground">⏱ {Math.floor(g.time_taken / 60)}m {g.time_taken % 60}s</span>
                    </div>
                    <pre className="text-xs bg-muted rounded p-2 mt-2 overflow-x-auto text-foreground max-h-32">{g.code}</pre>
                    {g.screenshot_url && (
                      <img src={g.screenshot_url} alt="Screenshot" className="mt-2 max-h-24 rounded border border-border" />
                    )}
                    {g.feedback && (
                      <div className="flex items-start gap-2 mt-3 p-2 rounded-lg bg-info/5 border border-info/10">
                        <MessageSquare className="w-4 h-4 text-info shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground">{g.feedback}</p>
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${gradeColor(g.grade)}`}>
                    {g.grade || 'Pending'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGrades;
