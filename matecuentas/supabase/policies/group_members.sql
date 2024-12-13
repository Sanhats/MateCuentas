-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view group members" ON group_members;
DROP POLICY IF EXISTS "Users can insert group members" ON group_members;
DROP POLICY IF EXISTS "Users can delete group members" ON group_members;

-- Habilitar RLS
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Política para ver miembros del grupo
CREATE POLICY "Users can view group members"
ON group_members
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM group_members 
    WHERE group_id = group_members.group_id
  )
);

-- Política para insertar miembros del grupo
CREATE POLICY "Users can insert group members"
ON group_members
FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM group_members 
    WHERE group_id = group_members.group_id AND role = 'admin'
  )
);

-- Política para eliminar miembros del grupo
CREATE POLICY "Users can delete group members"
ON group_members
FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM group_members 
    WHERE group_id = group_members.group_id AND role = 'admin'
  )
);

