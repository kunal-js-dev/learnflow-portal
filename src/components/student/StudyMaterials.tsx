import React, { useEffect, useState } from 'react';
import { FileText, Download, Calendar, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

const typeColors: Record<string, string> = {
  pdf: 'bg-destructive/10 text-destructive',
  docx: 'bg-primary/10 text-primary',
  pptx: 'bg-warning/10 text-warning',
  ppt: 'bg-warning/10 text-warning',
  zip: 'bg-muted text-muted-foreground',
  mp4: 'bg-accent/10 text-accent',
  jpg: 'bg-success/10 text-success',
  png: 'bg-success/10 text-success',
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

const StudyMaterials = () => {
  const [files, setFiles] = useState<Tables<'files'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await supabase.from('files').select('*').order('created_at', { ascending: false });
      if (data) setFiles(data);
      setLoading(false);
    };
    fetchFiles();
  }, []);

  const handleDownload = async (file: Tables<'files'>) => {
    try {
      const response = await fetch(file.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(file.file_url, '_blank');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-32 text-muted-foreground">Loading materials...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Study Materials</h2>
        <p className="text-sm text-muted-foreground mt-1">Download materials uploaded by your teachers</p>
      </div>

      {files.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-8 text-center text-muted-foreground">No study materials available yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {files.map(file => {
            const ext = file.file_type?.toLowerCase() || file.file_name.split('.').pop()?.toLowerCase() || '';
            return (
              <Card key={file.id} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[ext] || 'bg-muted text-muted-foreground'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground">{file.title}</h3>
                    {file.description && <p className="text-xs text-muted-foreground mt-0.5">{file.description}</p>}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(file.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{formatSize(file.file_size)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${typeColors[ext] || 'bg-muted text-muted-foreground'}`}>{ext}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(file)} className="shrink-0">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudyMaterials;
