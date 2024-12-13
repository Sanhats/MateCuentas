-- Asegurarnos que la tabla users existe (Supabase la crea automáticamente)
-- Crear la relación entre group_members y users
ALTER TABLE group_members
ADD CONSTRAINT fk_group_members_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Crear la relación entre group_members y groups
ALTER TABLE group_members
ADD CONSTRAINT fk_group_members_group
FOREIGN KEY (group_id)
REFERENCES groups(id)
ON DELETE CASCADE;

