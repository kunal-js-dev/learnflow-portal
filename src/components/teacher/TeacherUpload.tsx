import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

const TeacherUpload = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<Tables<'files'>[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    if (!user) return;
    const { data } = await supabase.from('files').select('*').eq('uploaded_by', user.id).order('created_at', { ascending: false });
    if (data) setFiles(data);
  };

  useEffect(() => { fetchFiles(); }, [user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileRef.current?.files?.length || !user) { toast.error('Select a file'); return; }

    const file = fileRef.current.files[0];
    if (file.size > 500 * 1024 * 1024) { toast.error('File too large (max 500MB)'); return; }

    setUploading(true);
    setProgress(10);

    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}-${file.name}`;

      setProgress(30);
      const { error: uploadError } = await supabase.storage.from('study-materials').upload(path, file);
      if (uploadError) throw uploadError;

      setProgress(70);
      const { data: urlData } = supabase.storage.from('study-materials').getPublicUrl(path);

      const { error: dbError } = await supabase.from('files').insert({
        title,
        description,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: ext || null,
        uploaded_by: user.id,
      });
      if (dbError) throw dbError;

      setProgress(100);
      toast.success('File uploaded!');
      setTitle('');
      setDescription('');
      if (fileRef.current) fileRef.current.value = '';
      await fetchFiles();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (file: Tables<'files'>) => {
    // Extract path from URL
    const urlParts = file.file_url.split('/study-materials/');
    const storagePath = urlParts[1] ? decodeURIComponent(urlParts[1]) : null;

    if (storagePath) {
      await supabase.storage.from('study-materials').remove([storagePath]);
    }
    const { error } = await supabase.from('files').delete().eq('id', file.id);
    if (error) { toast.error('Delete failed'); return; }
    toast.success('File deleted');
    setFiles(prev => prev.filter(f => f.id !== file.id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Upload Study Materials</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload files for your students (max 500MB)</p>
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
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <Input ref={fileRef} type="file" accept=".pdf,.docx,.pptx,.ppt,.zip,.mp4,.jpg,.jpeg,.png,.gif,.webp" required />
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
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
        ) : (
          <div className="grid gap-2">
            {files.map(f => (
              <Card key={f.id} className="shadow-card">
                <CardContent className="p-3 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{f.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{f.file_type?.toUpperCase()}</span>·
                      <span>{(f.file_size / (1024 * 1024)).toFixed(1)} MB</span>·
                      <span>{new Date(f.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(f)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherUpload;
