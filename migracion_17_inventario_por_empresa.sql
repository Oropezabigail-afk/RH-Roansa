-- ============================================================
-- MIGRACIÓN 17 - Inventario separado por empresa (Chamarras,
-- Playeras y Camisola) + tallas numéricas de camisola
-- Ejecutar en: SQL Editor de Supabase (proyecto RH ROANSA)
--
-- Agrega la columna "empresa" a la tabla de inventario, para que
-- las Chamarras, Playeras y la Camisola blanca lleven su stock
-- por separado entre ROANSA y SPG. El resto de las prendas
-- (pantalones, chalecos, gorras, corbata, botas, complementos,
-- antidoping) no se ven afectadas: siguen siendo un solo stock
-- compartido (quedan con empresa = '').
--
-- No se pierde ningún inventario ya cargado: todo lo que ya
-- tenías queda con empresa = '' (sin dividir). Si quieres que
-- ese stock existente de chamarras/playeras/camisola se reparta
-- entre ROANSA y SPG, edítalo tú desde la pantalla de Inventario
-- después de correr este SQL (ajusta la cantidad de la fila vieja
-- y agrega una fila nueva para la otra empresa), o dime y te
-- ayudo con un script puntual para repartirlo.
-- ============================================================

alter table public.inventario_items
  add column if not exists empresa text not null default '';

-- El stock ahora también se distingue por empresa (antes solo por
-- categoría, tipo, talla y estado).
alter table public.inventario_items drop constraint if exists inventario_items_categoria_tipo_talla_estado_key;
alter table public.inventario_items add constraint inventario_items_categoria_tipo_talla_estado_empresa_key
  unique (categoria, tipo, talla, estado, empresa);

-- Se reemplaza la función que suma/resta inventario para que
-- también reciba y respete la empresa.
drop function if exists public.ajustar_inventario(text,text,text,text,integer);

create or replace function public.ajustar_inventario(
  p_categoria text,
  p_tipo text,
  p_talla text,
  p_estado text,
  p_delta integer,
  p_empresa text default ''
) returns public.inventario_items
language plpgsql
as $$
declare
  resultado public.inventario_items;
begin
  insert into public.inventario_items (id, categoria, tipo, talla, estado, cantidad, empresa)
  values (gen_random_uuid()::text, p_categoria, p_tipo, coalesce(p_talla,''), p_estado, greatest(p_delta,0), coalesce(p_empresa,''))
  on conflict (categoria, tipo, talla, estado, empresa)
  do update set cantidad = greatest(public.inventario_items.cantidad + p_delta, 0)
  returning * into resultado;
  return resultado;
end;
$$;

grant execute on function public.ajustar_inventario(text,text,text,text,integer,text) to authenticated;
