import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ClipboardCheck, Timer, Code, Eye, Send, Star, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_SUBMISSIONS = [
  {
    id: '1', studentName: 'John Student', language: 'JavaScript',
    code: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}',
    timeTaken: 320, grade: null, feedback: null, submittedAt: '2024-03-01',
    image: null,
  },
  {
    id: '2', studentName: 'Alice Smith', language: 'Python',
    code: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr',
    timeTaken: 450, grade: null, feedback: null, submittedAt: '2024-02-28',
    image: null,
  },
  {
    id: '3', studentName: 'Bob Wilson', language: 'C',
    code: '#include <stdio.h>\nint main() {\n    int n, rev = 0;\n    scanf("%d", &n);\n    while(n != 0) {\n        rev = rev * 10 + n % 10;\n        n /= 10;\n    }\n    printf("%d", rev);\n    return 0;\n}',
    timeTaken: 600, grade: 'A', feedback: 'Great solution!', submittedAt: '2024-02-25',
    image: null,
  },
];

const CodeReview = () => {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [grading, setGrading] = useState<Record<string, { grade: string; feedback: string }>>({});
  const [viewingCode, setViewingCode] = useState<string | null>(null);

  const handleGradeChange = (id: string, field: 'grade' | 'feedback', value: string) => {
    setGrading(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSubmitGrade = (id: string) => {
    const data = grading[id];
    if (!data?.grade) {
      toast.error('Please enter a grade');
      return;
    }
    setSubmissions(prev => prev.map(s =>
      s.id === id ? { ...s, grade: data.grade, feedback: data.feedback || '' } : s
    ));
    setGrading(prev => { const n = { ...prev }; delete n[id]; return n; });
    toast.success('Grade submitted!');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Code Review Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">Review and grade student code submissions</p>
      </div>

      <div className="grid gap-4">
        {submissions.map(sub => (
          <Card key={sub.id} className="shadow-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {sub.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{sub.studentName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{sub.language}</span>
                      <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{formatTime(sub.timeTaken)}</span>
                      <span>{sub.submittedAt}</span>
                    </div>
                  </div>
                </div>
                {sub.grade && (
                  <div className="px-3 py-1 rounded-lg bg-success/10 text-success font-bold text-sm">
                    {sub.grade}
                  </div>
                )}
              </div>

              {/* Code */}
              <pre className="text-xs bg-foreground/[0.03] rounded-lg p-3 overflow-x-auto border border-border text-foreground">
                {viewingCode === sub.id ? sub.code : sub.code.split('\n').slice(0, 3).join('\n') + (sub.code.split('\n').length > 3 ? '\n...' : '')}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setViewingCode(viewingCode === sub.id ? null : sub.id)}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" /> {viewingCode === sub.id ? 'Collapse' : 'View Full Code'}
              </Button>

              {/* Grade Form */}
              {!sub.grade && (
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex gap-2">
                    <div className="w-24">
                      <Label className="text-xs">Grade</Label>
                      <Input
                        placeholder="A, B+..."
                        value={grading[sub.id]?.grade || ''}
                        onChange={e => handleGradeChange(sub.id, 'grade', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Feedback</Label>
                      <Input
                        placeholder="Write feedback..."
                        value={grading[sub.id]?.feedback || ''}
                        onChange={e => handleGradeChange(sub.id, 'feedback', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleSubmitGrade(sub.id)} className="gradient-primary text-primary-foreground">
                    <Send className="w-3 h-3 mr-1" /> Submit Grade
                  </Button>
                </div>
              )}

              {sub.feedback && (
                <div className="p-2 rounded-lg bg-info/5 border border-info/10 text-xs text-foreground">
                  💬 {sub.feedback}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CodeReview;
