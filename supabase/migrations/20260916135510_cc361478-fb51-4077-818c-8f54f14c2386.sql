CREATE TABLE public.ai_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workspace TEXT NOT NULL CHECK (workspace IN ('prospecting', 'travel-advisor', 'customer-service')),
  title TEXT NOT NULL DEFAULT 'New conversation',
  contact_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_threads TO authenticated;
GRANT ALL ON public.ai_threads TO service_role;
ALTER TABLE public.ai_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own AI threads" ON public.ai_threads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.ai_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  parts JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own AI messages" ON public.ai_messages FOR ALL TO authenticated USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.ai_threads t WHERE t.id = thread_id AND t.user_id = auth.uid())) WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.ai_threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));

CREATE INDEX ai_threads_user_updated_idx ON public.ai_threads(user_id, updated_at DESC);
CREATE INDEX ai_messages_thread_created_idx ON public.ai_messages(thread_id, created_at ASC);

CREATE OR REPLACE FUNCTION public.touch_ai_thread_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$ BEGIN UPDATE public.ai_threads SET updated_at = now() WHERE id = NEW.thread_id; RETURN NEW; END; $$;
CREATE TRIGGER touch_ai_thread_after_message AFTER INSERT ON public.ai_messages FOR EACH ROW EXECUTE FUNCTION public.touch_ai_thread_updated_at();