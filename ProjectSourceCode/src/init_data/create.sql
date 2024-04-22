DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    username VARCHAR(100) NOT NULL UNIQUE, -- Keeping the UNIQUE constraint
    email VARCHAR(100),
    phone_number VARCHAR(15), -- Assuming phone numbers will be at most 15 characters
    address TEXT, -- Using TEXT to allow for longer addresses
    password CHAR(60) NOT NULL -- CHAR(60) is still appropriate for bcrypt hashes
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
