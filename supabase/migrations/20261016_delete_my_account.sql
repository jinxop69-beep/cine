-- Permite que cada persona elimine su propia cuenta desde Plano (RGPD, derecho de supresión).
-- Al borrar el usuario de auth.users se eliminan en cascada su perfil, diario, seguimientos y reacciones.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'authentication_required';
  end if;
  delete from auth.users where id = uid;
end
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
