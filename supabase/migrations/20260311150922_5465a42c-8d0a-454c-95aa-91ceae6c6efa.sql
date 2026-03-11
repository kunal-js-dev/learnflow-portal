
-- Create student_uploads table
CREATE TABLE public.student_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size bigint NOT NULL DEFAULT 0,
  description text,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_uploads ENABLE ROW LEVEL SECURITY;

-- Students can insert their own uploads
CREATE POLICY "Students can upload files"
ON public.student_uploads FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() AND has_role(auth.uid(), 'student'::app_role));

-- Students can view own uploads, teachers can view all
CREATE POLICY "Students and teachers can view uploads"
ON public.student_uploads FOR SELECT TO authenticated
USING (student_id = auth.uid() OR has_role(auth.uid(), 'teacher'::app_role));

-- Students can delete own uploads
CREATE POLICY "Students can delete own uploads"
ON public.student_uploads FOR DELETE TO authenticated
USING (student_id = auth.uid() AND has_role(auth.uid(), 'student'::app_role));

-- Create storage bucket for student code uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('student-uploads', 'student-uploads', true);

-- Storage policies
CREATE POLICY "Students can upload to student-uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'student-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone authenticated can view student-uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'student-uploads');

CREATE POLICY "Students can delete own files from student-uploads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'student-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
