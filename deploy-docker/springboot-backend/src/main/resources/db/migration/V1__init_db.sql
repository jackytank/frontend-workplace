-- TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) 
);

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL,
    code VARCHAR(255) UNIQUE,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_roles (
    id BIGSERIAL,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL
);

-- PK
ALTER TABLE users 
ADD PRIMARY KEY (id);

ALTER TABLE roles
ADD PRIMARY KEY (id);

ALTER TABLE user_roles
ADD PRIMARY KEY (id);

-- FK
ALTER TABLE user_roles 
ADD CONSTRAINT fk_user_roles_user_id 
FOREIGN KEY (user_id)
REFERENCES users(id);

ALTER TABLE user_roles
ADD CONSTRAINT fk_user_roles_role_id
FOREIGN KEY (role_id)
REFERENCES roles(id);

-- INDEX
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

