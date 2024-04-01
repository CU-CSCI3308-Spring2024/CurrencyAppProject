DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS conversions CASCADE;
CREATE TABLE IF NOT EXISTS conversions (
    conversion_id SERIAL PRIMARY KEY NOT NULL
); 

DROP TABLE IF EXISTS users_to_conversions CASCADE;
CREATE TABLE IF NOT EXISTS users_to_conversions (
    user_id INT NOT NULL,
    conversion_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (conversion_id) REFERENCES conversions (conversion_id) ON DELETE CASCADE
); 

