import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Eye, Send, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubmissionWithStudent {
  id: string;
  student_id: string;
  language: string;
  code: string;
  time_taken: number;
  grade: string | null;
  feedback: string | null;
  screenshot_url: string | null;
  submitted_at: string;
  profiles: { name: string } | null;
}

const CodeReview = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<Record<string, { grade: string; feedback: string }>>({});
  const [viewingCode, setViewingCode] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('code_submissions')
        .select('*, profiles!code_submissions_student_id_profiles_fkey(name)')
        .order('submitted_at', { ascending: false });
      if (error) { console.error('CodeReview fetch error:', error); }
      if (data) setSubmissions(data as unknown as SubmissionWithStudent[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleGradeChange = (id: string, field: 'grade' | 'feedback', value: string) => {
    setGrading(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSubmitGrade = async (id: string) => {
    const data = grading[id];
    if (!data?.grade) { toast.error('Enter a grade'); return; }
    const { error } = await supabase.from('code_submissions').update({
      grade: data.grade,
      feedback: data.feedback || null,
      graded_by: user?.id,
    }).eq('id', id);
    if (error) { toast.error('Failed to save grade'); return; }
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, grade: data.grade, feedback: data.feedback } : s));
    setGrading(prev => { const n = { ...prev }; delete n[id]; return n; });
    toast.success('Grade submitted!');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  if (loading) return <div className="flex items-center justify-center h-32 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Code Review Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">Review and grade student code submissions</p>
      </div>

      {submissions.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-8 text-center text-muted-foreground">No submissions to review.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map(sub => (
            <Card key={sub.id} className="shadow-card">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {sub.profiles?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{sub.profiles?.name || 'Unknown'}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{sub.language}</span>
                        <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{formatTime(sub.time_taken)}</span>
                        <span>{new Date(sub.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {sub.grade && (
                    <div className="px-3 py-1 rounded-lg bg-success/10 text-success font-bold text-sm">{sub.grade}</div>
                  )}
                </div>

                <pre className="text-xs bg-foreground/[0.03] rounded-lg p-3 overflow-x-auto border border-border text-foreground max-h-48 overflow-y-auto">
                  {viewingCode === sub.id ? sub.code : sub.code.split('\n').slice(0, 3).join('\n') + (sub.code.split('\n').length > 3 ? '\n...' : '')}
                </pre>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setViewingCode(viewingCode === sub.id ? null : sub.id)} className="text-xs">
                    <Eye className="w-3 h-3 mr-1" /> {viewingCode === sub.id ? 'Collapse' : 'View Full Code'}
                  </Button>
                  {sub.screenshot_url && (
                    <Button size="sm" variant="ghost" onClick={() => setViewingImage(viewingImage === sub.id ? null : sub.id)} className="text-xs">
                      <ImageIcon className="w-3 h-3 mr-1" /> {viewingImage === sub.id ? 'Hide Image' : 'View Image'}
                    </Button>
                  )}
                </div>
                {viewingImage === sub.id && sub.screenshot_url && (
                  <img src={sub.screenshot_url} alt="Screenshot" className="max-h-48 rounded-lg border border-border" />
                )}

                {!sub.grade && (
                  <div className="pt-2 border-t border-border space-y-2">
                    <div className="flex gap-2">
                      <div className="w-24">
                        <Label className="text-xs">Grade</Label>
                        <Input placeholder="A, B+..." value={grading[sub.id]?.grade || ''} onChange={e => handleGradeChange(sub.id, 'grade', e.target.value)} className="h-8 text-xs" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs">Feedback</Label>
                        <Input placeholder="Write feedback..." value={grading[sub.id]?.feedback || ''} onChange={e => handleGradeChange(sub.id, 'feedback', e.target.value)} className="h-8 text-xs" />
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSubmitGrade(sub.id)} className="gradient-primary text-primary-foreground">
                      <Send className="w-3 h-3 mr-1" /> Submit Grade
                    </Button>
                  </div>
                )}

                {sub.feedback && (
                  <div className="p-2 rounded-lg bg-info/5 border border-info/10 text-xs text-foreground">💬 {sub.feedback}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeReview;
