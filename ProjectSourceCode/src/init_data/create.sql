DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100),
    username VARCHAR(100) NOT NULL UNIQUE, -- Adding UNIQUE constraint here
    email VARCHAR(100),
    password CHAR(60) NOT NULL -- Assuming password hashes, CHAR(60) is appropriate for bcrypt
);

DROP TABLE IF EXISTS conversions CASCADE;
CREATE TABLE IF NOT EXISTS conversions (
    conversion_id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    from_currency VARCHAR(3),
    to_currency VARCHAR(3),
    amount DECIMAL(10, 2),
    rate numeric,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    converted_amount numeric generated always as (amount * rate) STORED
);

