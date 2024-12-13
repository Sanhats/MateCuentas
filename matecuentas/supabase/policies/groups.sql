-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view their groups" ON groups;
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Users can update their groups" ON groups;
DROP POLICY IF EXISTS "Users can delete their groups" ON groups;

-- Habilitar RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Política para ver grupos
CREATE POLICY "Users can view their groups"
ON groups
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM group_members 
    WHERE group_id = id
  )
);

-- Política para crear grupos
CREATE POLICY "Users can create groups"
ON groups
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para actualizar grupos
CREATE POLICY "Users can update their groups"
ON groups
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM group_members 
    WHERE group_id = id AND role = 'admin'
  )
);

-- Política para eliminar grupos
CREATE POLICY "Users can delete their groups"
ON groups
FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM group_members 
    WHERE group_id = id AND role = 'admin'
  )
);

