COPY public.users (name, username, email, password) FROM stdin;
\N	testuser0123	\N	$2b$10$R4e7/630w.sRnlDPD6U.3Oo50mEXRkd8Wzk4ZUavtu2Kuh9JzhWD.
\N	test	\N	$2b$10$MeudfI1shbih0IM5UqulVur6EWdPER1q3R/S1dCVGjgLeQKkQOHS2
\.

COPY public.conversions (user_id, from_currency, to_currency, amount, rate, created_at) FROM stdin;
2	USD	EUR	2.00	0.9406001853	2024-04-16 04:39:35.197704+00
2	AMD	BAM	100.00	0.0046421464	2024-04-16 16:11:02.798+00
2	EUR	USD	2.00	1.0631509707	2024-04-16 16:12:51.274275+00
2	COP	USD	500.00	0.0002557351	2024-04-16 16:14:36.398669+00
\.
