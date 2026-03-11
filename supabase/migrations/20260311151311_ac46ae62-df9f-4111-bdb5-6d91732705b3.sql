ALTER TABLE public.student_uploads
ADD CONSTRAINT student_uploads_student_id_profiles_fkey
FOREIGN KEY (student_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;