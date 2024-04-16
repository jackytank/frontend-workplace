-- TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) 
);

-- PK
ALTER TABLE users 
ADD PRIMARY KEY (id);

