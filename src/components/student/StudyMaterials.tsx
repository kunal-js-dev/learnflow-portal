import React from 'react';
import { FileText, Download, Calendar, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MOCK_FILES = [
  { id: '1', title: 'Introduction to React', description: 'Complete guide to React fundamentals', fileSize: '2.4 MB', uploadDate: '2024-03-01', type: 'PDF' },
  { id: '2', title: 'CSS Flexbox & Grid', description: 'Layout techniques with modern CSS', fileSize: '1.8 MB', uploadDate: '2024-02-28', type: 'PDF' },
  { id: '3', title: 'JavaScript ES6+', description: 'Modern JavaScript features and patterns', fileSize: '3.1 MB', uploadDate: '2024-02-25', type: 'DOCX' },
  { id: '4', title: 'Data Structures', description: 'Arrays, Trees, Graphs and more', fileSize: '5.2 MB', uploadDate: '2024-02-20', type: 'PPT' },
  { id: '5', title: 'Web Development Basics', description: 'HTML, CSS and JS starter pack', fileSize: '12.5 MB', uploadDate: '2024-02-15', type: 'ZIP' },
  { id: '6', title: 'Python for Beginners', description: 'Video tutorial on Python basics', fileSize: '45.0 MB', uploadDate: '2024-02-10', type: 'MP4' },
];

const typeColors: Record<string, string> = {
  PDF: 'bg-destructive/10 text-destructive',
  DOCX: 'bg-primary/10 text-primary',
  PPT: 'bg-warning/10 text-warning',
  ZIP: 'bg-muted text-muted-foreground',
  MP4: 'bg-accent/10 text-accent',
};

const StudyMaterials = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Study Materials</h2>
        <p className="text-sm text-muted-foreground mt-1">Download materials uploaded by your teachers</p>
      </div>

      <div className="grid gap-3">
        {MOCK_FILES.map(file => (
          <Card key={file.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[file.type] || 'bg-muted text-muted-foreground'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{file.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{file.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{file.uploadDate}</span>
                  <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{file.fileSize}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${typeColors[file.type]}`}>{file.type}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="shrink-0">
                <Download className="w-4 h-4 mr-1" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterials;
