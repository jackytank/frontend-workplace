-- V2__init_data.sql
INSERT INTO data_logs (log_date, log_level, log_message, log_status) VALUES
('2024-04-15 10:00:00', 'INFO', 'Initial data load started', 'FAILURE'),
('2024-04-15 10:01:00', 'INFO', 'Data load in progress', 'SUCCESS'),
('2024-04-15 10:02:00', 'WARN', 'Data load taking longer than expected', 'FAILURE'),
('2024-04-15 10:03:00', 'ERROR', 'Data load failed due to unexpected error', 'SUCCESS');
