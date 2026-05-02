-- Remover políticas antigas permissivas
DROP POLICY IF EXISTS "Authenticated users can manage app users" ON public.app_users;
DROP POLICY IF EXISTS "Authenticated users can view app users" ON public.app_users;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;

-- Políticas para app_users
-- Todos autenticados podem ver usuários
CREATE POLICY "Authenticated users can view app_users"
ON public.app_users FOR SELECT
TO authenticated
USING (true);

-- Somente suporte e admin podem gerenciar usuários
CREATE POLICY "Admins and suporte can manage app_users"
ON public.app_users FOR ALL
TO authenticated
USING (public.is_admin_or_suporte(auth.uid()))
WITH CHECK (public.is_admin_or_suporte(auth.uid()));

-- Políticas para products
CREATE POLICY "Authenticated users can view products"
ON public.products FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins and suporte can manage products"
ON public.products FOR ALL
TO authenticated
USING (public.is_admin_or_suporte(auth.uid()))
WITH CHECK (public.is_admin_or_suporte(auth.uid()));

-- Políticas para orders - todos autenticados podem ver e criar
CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins and suporte can delete orders"
ON public.orders FOR DELETE
TO authenticated
USING (public.is_admin_or_suporte(auth.uid()));

-- Políticas para order_items
CREATE POLICY "Authenticated users can view order_items"
ON public.order_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create order_items"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update order_items"
ON public.order_items FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins and suporte can delete order_items"
ON public.order_items FOR DELETE
TO authenticated
USING (public.is_admin_or_suporte(auth.uid()));