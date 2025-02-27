-- TABLE
CREATE TABLE IF NOT EXISTS "data_logs" (
    id BIGSERIAL,
    log_date TIMESTAMP NOT NULL,
    log_level TEXT NOT NULL, -- log level: INFO, WARN, ERROR
    log_message TEXT NOT NULL,
    log_status TEXT NOT NULL -- status: SUCCESS, FAILURE
);

-- PK
ALTER TABLE "data_logs"
ADD PRIMARY KEY (id);
