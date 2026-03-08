ALTER TABLE public.code_submissions
ADD CONSTRAINT code_submissions_student_id_profiles_fkey
FOREIGN KEY (student_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;