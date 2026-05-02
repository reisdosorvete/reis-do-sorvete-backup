-- 1. Adicionar 'suporte' ao enum de roles
ALTER TYPE public.user_role_type ADD VALUE IF NOT EXISTS 'suporte';