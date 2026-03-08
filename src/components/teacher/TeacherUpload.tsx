import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Trash2, Calendar, HardDrive, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const MOCK_UPLOADS = [
  { id: '1', title: 'React Basics', description: 'Introduction to React components', fileSize: '2.4 MB', uploadDate: '2024-03-01', type: 'PDF' },
  { id: '2', title: 'CSS Grid Tutorial', description: 'Modern CSS layout techniques', fileSize: '1.8 MB', uploadDate: '2024-02-28', type: 'DOCX' },
];

const TeacherUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState(MOCK_UPLOADS);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileRef.current?.files?.length) {
      toast.error('Please select a file');
      return;
    }
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          const file = fileRef.current!.files![0];
          setFiles(prev => [{
            id: String(Date.now()),
            title,
            description,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split('T')[0],
            type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          }, ...prev]);
          setTitle('');
          setDescription('');
          if (fileRef.current) fileRef.current.value = '';
          toast.success('File uploaded successfully!');
          return 0;
        }
        return p + 5;
      });
    }, 100);
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.success('File deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Upload Study Materials</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload files for your students (PDF, DOCX, PPT, ZIP, MP4, Images - max 500MB)</p>
      </div>

      <Card className="shadow-elevated">
        <CardContent className="p-6">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Material title" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" rows={2} required />
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <Input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.ppt,.zip,.mp4,.jpg,.png,.gif,.webp" />
            </div>
            {uploading && <Progress value={progress} className="h-2" />}
            <Button type="submit" disabled={uploading} className="gradient-primary text-primary-foreground">
              <Upload className="w-4 h-4 mr-2" /> {uploading ? `Uploading ${progress}%` : 'Upload File'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Your Uploaded Files</h3>
        <div className="grid gap-2">
          {files.map(f => (
            <Card key={f.id} className="shadow-card">
              <CardContent className="p-3 flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{f.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{f.type}</span>·<span>{f.fileSize}</span>·<span>{f.uploadDate}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(f.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherUpload;
