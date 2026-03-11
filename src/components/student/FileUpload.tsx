import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileCode, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const FileUpload = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ['student-uploads', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_uploads')
        .select('*')
        .eq('student_id', user!.id)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (upload: { id: string; file_url: string }) => {
      // Extract path from URL
      const urlParts = upload.file_url.split('/student-uploads/');
      if (urlParts[1]) {
        await supabase.storage.from('student-uploads').remove([urlParts[1]]);
      }
      const { error } = await supabase.from('student_uploads').delete().eq('id', upload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-uploads'] });
      toast.success('File deleted');
    },
    onError: (err: any) => toast.error(err.message || 'Delete failed'),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error('File must be under 20MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('student-uploads')
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('student-uploads')
        .getPublicUrl(path);

      const { error: dbError } = await supabase.from('student_uploads').insert({
        student_id: user.id,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: ext || file.type,
        file_size: file.size,
        description: description.trim() || null,
      });
      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['student-uploads'] });
      toast.success('File uploaded successfully!');
      setDescription('');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        <h2 className="text-xl font-bold text-foreground">Upload Code Files</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload your code files for teacher review</p>
      </div>

      <Card className="shadow-elevated">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upload a File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={200}
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gradient-primary text-primary-foreground"
            >
              <Upload className="w-4 h-4 mr-1" />
              {uploading ? 'Uploading...' : 'Choose File'}
            </Button>
            <span className="text-xs text-muted-foreground">Max 20MB · Any code file type</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".py,.js,.ts,.tsx,.jsx,.c,.cpp,.h,.java,.html,.css,.scss,.php,.rb,.go,.rs,.swift,.kt,.cs,.sql,.sh,.bat,.json,.xml,.yaml,.yml,.md,.txt,.zip,.rar"
          />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">My Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : uploads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {uploads.map((upload) => (
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
                      <p className="text-xs text-muted-foreground">
                        {formatSize(upload.file_size)} · {new Date(upload.uploaded_at).toLocaleDateString()}
                        {upload.description && ` · ${upload.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => window.open(upload.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteMutation.mutate({ id: upload.id, file_url: upload.file_url })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default FileUpload;
