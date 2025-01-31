USE xacademydb;

-- Crea índice en name y lastname para búsquedas rápidas
CREATE INDEX idx_users_name ON Users(name);
CREATE INDEX idx_users_lastname ON Users(lastname);

-- Crea índice único en dni (si no hay valores duplicados)
ALTER TABLE Users ADD CONSTRAINT unique_dni UNIQUE (dni);

-- El email ya es UNIQUE, pero este es un índice explícito:
CREATE INDEX idx_users_email ON Users(email);