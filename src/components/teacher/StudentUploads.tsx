import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCode, Download, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const StudentUploads = () => {
  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ['teacher-student-uploads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_uploads')
        .select('*, profiles!student_uploads_student_id_profiles_fkey(name)')
        .order('uploaded_at', { ascending: false });
      if (error) {
        // Fallback: fetch without join if FK doesn't exist
        const { data: plain, error: plainErr } = await supabase
          .from('student_uploads')
          .select('*')
          .order('uploaded_at', { ascending: false });
        if (plainErr) throw plainErr;
        return plain.map((u: any) => ({ ...u, profiles: null }));
      }
      return data;
    },
  });

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(fileUrl, '_blank');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Student Uploads</h2>
        <p className="text-sm text-muted-foreground mt-1">View and download code files uploaded by students</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Uploads ({uploads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : uploads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No student uploads yet.</p>
          ) : (
            <div className="space-y-2">
              {uploads.map((upload: any) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 text-primary shrink-0">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{upload.file_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {upload.profiles?.name || 'Unknown'}
                        </span>
                        <span>·</span>
                        <span>{formatSize(upload.file_size)}</span>
                        <span>·</span>
                        <span>{new Date(upload.uploaded_at).toLocaleDateString()}</span>
                        {upload.description && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[150px]">{upload.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(upload.file_url, upload.file_name)}
                  >
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentUploads;
