import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCode, Download, User, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CODE_EXTENSIONS = ['.py', '.js', '.ts', '.tsx', '.jsx', '.html', '.css', '.java', '.c', '.cpp', '.h', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.sh', '.sql', '.json', '.xml', '.yaml', '.yml', '.md', '.txt', '.csv', '.env', '.toml'];

const StudentUploads = () => {
  const [previewContent, setPreviewContent] = useState<Record<string, string>>({});
  const [loadingPreview, setLoadingPreview] = useState<Record<string, boolean>>({});
  const [fullPreview, setFullPreview] = useState<{ name: string; content: string } | null>(null);

  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ['teacher-student-uploads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_uploads')
        .select('*, profiles!student_uploads_student_id_profiles_fkey(name)')
        .order('uploaded_at', { ascending: false });
      if (error) {
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

  const isPreviewable = (fileName: string) => {
    const ext = '.' + fileName.split('.').pop()?.toLowerCase();
    return CODE_EXTENSIONS.includes(ext);
  };

  const handlePreview = async (id: string, fileUrl: string) => {
    if (previewContent[id] !== undefined) {
      setPreviewContent(prev => { const n = { ...prev }; delete n[id]; return n; });
      return;
    }
    setLoadingPreview(prev => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(fileUrl);
      const text = await response.text();
      setPreviewContent(prev => ({ ...prev, [id]: text }));
    } catch {
      toast.error('Failed to load file preview');
    } finally {
      setLoadingPreview(prev => ({ ...prev, [id]: false }));
    }
  };

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
                <div key={upload.id} className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                  <div className="flex items-center justify-between p-3">
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
                    <div className="flex items-center gap-1 shrink-0">
                      {isPreviewable(upload.file_name) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePreview(upload.id, upload.file_url)}
                          disabled={loadingPreview[upload.id]}
                        >
                          {previewContent[upload.id] !== undefined ? (
                            <><EyeOff className="w-4 h-4 mr-1" /> Hide</>
                          ) : (
                            <><Eye className="w-4 h-4 mr-1" /> {loadingPreview[upload.id] ? 'Loading...' : 'Preview'}</>
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(upload.file_url, upload.file_name)}
                      >
                        <Download className="w-4 h-4 mr-1" /> Download
                      </Button>
                    </div>
                  </div>

                  {previewContent[upload.id] !== undefined && (
                    <div className="border-t border-border">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50">
                        <span className="text-xs font-medium text-muted-foreground">{upload.file_name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs"
                          onClick={() => setFullPreview({ name: upload.file_name, content: previewContent[upload.id] })}
                        >
                          Full Screen
                        </Button>
                      </div>
                      <pre className="text-xs p-3 overflow-x-auto max-h-64 overflow-y-auto text-foreground bg-foreground/[0.03] font-mono whitespace-pre">
                        {previewContent[upload.id]}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!fullPreview} onOpenChange={() => setFullPreview(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0">
          {fullPreview && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">{fullPreview.name}</span>
              </div>
              <pre className="text-xs p-4 overflow-auto flex-1 text-foreground font-mono whitespace-pre">
                {fullPreview.content}
              </pre>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentUploads;
