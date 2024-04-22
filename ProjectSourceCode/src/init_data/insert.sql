INSERT INTO users (username, password) VALUES ('test', '');

INSERT INTO conversions (user_id, from_currency, to_currency, amount, rate, created_at) VALUES
    (1, 'USD', 'EUR', 100.00, 1.2, '2024-01-01T00:00:00Z'),
    (1, 'USD', 'EUR', 150.00, 1.1, '2023-01-01T00:00:00Z'),
    (1, 'USD', 'COP', 100, 1.1, '2022-01-01T00:00:00Z'),
    (1, 'USD', 'COP', 100, 5.1, '2024-01-01T00:00:00Z'),
    (1, 'USD', 'BAM', 100, 2.1, '2021-01-01T00:00:00Z'),
    (1, 'USD', 'BAM', 100, 0.4, '2024-01-01T00:00:00Z'),
    (1, 'USD', 'BIF', 100, 7.2, '2020-01-01T00:00:00Z'),
    (1, 'USD', 'BIF', 100, 8.9, '2023-01-01T00:00:00Z');