-- Populate roles table with initial data
INSERT INTO roles (code, name) VALUES
('ROLE_USER', 'User'),
('ROLE_ADMIN', 'Administrator');

-- Populate users table with initial data
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john.doe@example.com', 'hashed_password1'),
('Jane Smith', 'jane.smith@example.com', 'hashed_password2');

-- Assuming you have the user IDs and role IDs, populate user_roles table with initial data
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Assigning 'User' role to 'John Doe'
(2, 2); -- Assigning 'Administrator' role to 'Jane Smith'
