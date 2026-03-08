import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, MessageSquare, Star } from 'lucide-react';

const MOCK_GRADES = [
  { id: '1', language: 'JavaScript', code: 'function add(a,b) { return a+b; }', timeTaken: 320, grade: 'A', feedback: 'Excellent work! Clean solution.', submittedAt: '2024-03-01' },
  { id: '2', language: 'Python', code: 'def fibonacci(n): ...', timeTaken: 450, grade: 'B+', feedback: 'Good approach but could be optimized.', submittedAt: '2024-02-28' },
  { id: '3', language: 'C', code: '#include <stdio.h> ...', timeTaken: 600, grade: null, feedback: null, submittedAt: '2024-02-25' },
];

const gradeColor = (grade: string | null) => {
  if (!grade) return 'bg-muted text-muted-foreground';
  if (grade.startsWith('A')) return 'bg-success/10 text-success';
  if (grade.startsWith('B')) return 'bg-primary/10 text-primary';
  return 'bg-warning/10 text-warning';
};

const MyGrades = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">My Grades & Feedback</h2>
        <p className="text-sm text-muted-foreground mt-1">View your code submission grades and teacher feedback</p>
      </div>

      <div className="grid gap-3">
        {MOCK_GRADES.map(g => (
          <Card key={g.id} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">{g.language}</span>
                    <span className="text-xs text-muted-foreground">{g.submittedAt}</span>
                    <span className="text-xs text-muted-foreground">⏱ {Math.floor(g.timeTaken / 60)}m {g.timeTaken % 60}s</span>
                  </div>
                  <pre className="text-xs bg-muted rounded p-2 mt-2 overflow-x-auto text-foreground">{g.code}</pre>
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
    </div>
  );
};

export default MyGrades;
