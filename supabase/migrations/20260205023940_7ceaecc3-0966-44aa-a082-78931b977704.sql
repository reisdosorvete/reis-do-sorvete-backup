-- 1. Criar função para criar app_user automaticamente no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
  user_role public.user_role_type;
BEGIN
  -- Pegar o nome do metadata ou do email
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Verificar se é o email de suporte
  IF NEW.email = 'suporte.viaurb@gmail.com' THEN
    user_role := 'suporte';
  ELSE
    user_role := 'conferente'; -- Role padrão para novos usuários
  END IF;
  
  -- Inserir na tabela app_users
  INSERT INTO public.app_users (id, email, name, role, active)
  VALUES (NEW.id, NEW.email, user_name, user_role, true)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(NULLIF(EXCLUDED.name, ''), app_users.name);
  
  RETURN NEW;
END;
$$;

-- 2. Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Função para verificar se usuário tem role específica (para RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.user_role_type
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.app_users WHERE id = _user_id LIMIT 1
$$;

-- 4. Função para verificar se é suporte ou admin
CREATE OR REPLACE FUNCTION public.is_admin_or_suporte(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_users
    WHERE id = _user_id
      AND role IN ('admin', 'suporte')
  )
$$;

-- 5. Função para verificar se é suporte
CREATE OR REPLACE FUNCTION public.is_suporte(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_users
    WHERE id = _user_id
      AND role = 'suporte'
  )
$$;