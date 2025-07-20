-- Dummy Data for TopUp Game MIS
-- Run this after schema.sql

USE topup_game_mis;

-- =============================================
-- INSERT ADMIN USERS
-- =============================================
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('manager@topupgame.com', '$2b$12$LQv3c1yqBwLFaAOjymHa.uyHanS7HgeyoRt8AiWvmknpKvuFlpUna', 'Manager Utama', 'manager'),
('admin@topupgame.com', '$2b$12$LQv3c1yqBwLFaAOjymHa.uyHanS7HgeyoRt8AiWvmknpKvuFlpUna', 'Admin System', 'admin'),
('analyst@topupgame.com', '$2b$12$LQv3c1yqBwLFaAOjymHa.uyHanS7HgeyoRt8AiWvmknpKvuFlpUna', 'Data Analyst', 'analyst');
-- Password for all: "password123"

-- =============================================
-- INSERT GAMES
-- =============================================
INSERT INTO games (name, icon, category, is_active) VALUES
('Free Fire', '🔥', 'Battle Royale', TRUE),
('Mobile Legends', '⚔️', 'MOBA', TRUE),
('Honor of Kings', '👑', 'MOBA', TRUE),
('Call of Duty Mobile', '🎯', 'FPS', TRUE),
('Clash of Clans', '🏰', 'Strategy', TRUE),
('Clash Royale', '👑', 'Strategy', TRUE),
('PUBG Mobile', '🎮', 'Battle Royale', TRUE),
('Genshin Impact', '⭐', 'RPG', TRUE),
('Arena of Valor', '⚡', 'MOBA', TRUE),
('Valorant', '🔫', 'FPS', TRUE);

-- =============================================
-- INSERT PAYMENT METHODS
-- =============================================
INSERT INTO payment_methods (name, type, fee_percentage, fee_fixed, is_active) VALUES
('Dana', 'ewallet', 1.50, 0.00, TRUE),
('GoPay', 'ewallet', 1.50, 0.00, TRUE),
('OVO', 'ewallet', 1.75, 0.00, TRUE),
('ShopeePay', 'ewallet', 1.50, 0.00, TRUE),
('Bank Transfer', 'bank_transfer', 0.00, 5000.00, TRUE),
('Credit Card', 'credit_card', 2.90, 0.00, TRUE),
('QRIS', 'ewallet', 0.70, 0.00, TRUE);

-- =============================================
-- INSERT PRODUCTS
-- =============================================
INSERT INTO products (game_id, name, denomination, price, cost, is_active) VALUES
-- Free Fire (game_id = 1)
(1, 'Free Fire Diamonds', '70 Diamonds', 12000, 10000, TRUE),
(1, 'Free Fire Diamonds', '140 Diamonds', 24000, 20000, TRUE),
(1, 'Free Fire Diamonds', '355 Diamonds', 60000, 50000, TRUE),
(1, 'Free Fire Diamonds', '720 Diamonds', 120000, 100000, TRUE),
(1, 'Free Fire Diamonds', '1450 Diamonds', 240000, 200000, TRUE),

-- Mobile Legends (game_id = 2)
(2, 'Mobile Legends Diamonds', '86 Diamonds', 20000, 17000, TRUE),
(2, 'Mobile Legends Diamonds', '172 Diamonds', 40000, 34000, TRUE),
(2, 'Mobile Legends Diamonds', '429 Diamonds', 99000, 85000, TRUE),
(2, 'Mobile Legends Diamonds', '878 Diamonds', 199000, 170000, TRUE),
(2, 'Mobile Legends Diamonds', '1159 Diamonds', 250000, 215000, TRUE),

-- Honor of Kings (game_id = 3)
(3, 'HOK Tokens', '60 Tokens', 15000, 12500, TRUE),
(3, 'HOK Tokens', '300 Tokens', 75000, 63000, TRUE),
(3, 'HOK Tokens', '980 Tokens', 240000, 205000, TRUE),
(3, 'HOK Tokens', '1980 Tokens', 480000, 410000, TRUE),

-- Call of Duty Mobile (game_id = 4)
(4, 'CODM CP', '80 CP', 18000, 15000, TRUE),
(4, 'CODM CP', '400 CP', 89000, 75000, TRUE),
(4, 'CODM CP', '800 CP', 179000, 152000, TRUE),
(4, 'CODM CP', '2000 CP', 449000, 382000, TRUE),

-- Clash of Clans (game_id = 5)
(5, 'COC Gems', '500 Gems', 65000, 55000, TRUE),
(5, 'COC Gems', '1200 Gems', 150000, 128000, TRUE),
(5, 'COC Gems', '2500 Gems', 299000, 255000, TRUE),
(5, 'COC Gems', '6500 Gems', 750000, 640000, TRUE),

-- Clash Royale (game_id = 6)
(6, 'Clash Royale Gems', '500 Gems', 65000, 55000, TRUE),
(6, 'Clash Royale Gems', '1200 Gems', 150000, 128000, TRUE),
(6, 'Clash Royale Gems', '2500 Gems', 299000, 255000, TRUE),

-- PUBG Mobile (game_id = 7)
(7, 'PUBG Mobile UC', '60 UC', 15000, 12500, TRUE),
(7, 'PUBG Mobile UC', '325 UC', 75000, 63000, TRUE),
(7, 'PUBG Mobile UC', '660 UC', 150000, 128000, TRUE),
(7, 'PUBG Mobile UC', '1800 UC', 399000, 340000, TRUE),

-- Genshin Impact (game_id = 8)
(8, 'Genshin Impact Genesis Crystals', '60 Crystals', 15000, 12500, TRUE),
(8, 'Genshin Impact Genesis Crystals', '300 Crystals', 75000, 63000, TRUE),
(8, 'Genshin Impact Genesis Crystals', '980 Crystals', 240000, 205000, TRUE),
(8, 'Genshin Impact Genesis Crystals', '1980 Crystals', 480000, 410000, TRUE);

-- =============================================
-- INSERT USERS (Customers)
-- =============================================
INSERT INTO users (email, username, phone, created_at) VALUES
('user1@gmail.com', 'gamer_pro_2024', '081234567890', '2024-01-15 10:30:00'),
('user2@gmail.com', 'ml_legend_king', '081234567891', '2024-01-20 14:20:00'),
('user3@gmail.com', 'ff_master_indo', '081234567892', '2024-02-01 09:15:00'),
('user4@gmail.com', 'cod_sniper_elite', '081234567893', '2024-02-10 16:45:00'),
('user5@gmail.com', 'clash_king_777', '081234567894', '2024-02-15 11:30:00'),
('user6@gmail.com', 'hok_warrior_88', '081234567895', '2024-03-01 13:20:00'),
('user7@gmail.com', 'pubg_ace_master', '081234567896', '2024-03-05 15:10:00'),
('user8@gmail.com', 'genshin_traveler', '081234567897', '2024-03-10 08:45:00'),
('user9@gmail.com', 'mobile_gamer_id', '081234567898', '2024-03-15 12:30:00'),
('user10@gmail.com', 'esports_champion', '081234567899', '2024-03-20 17:20:00'),
('user11@gmail.com', 'diamond_hunter_99', '081234567800', '2024-04-01 10:15:00'),
('user12@gmail.com', 'top_player_indo', '081234567801', '2024-04-05 14:40:00'),
('user13@gmail.com', 'game_addict_pro', '081234567802', '2024-04-10 09:25:00'),
('user14@gmail.com', 'royal_clash_lord', '081234567803', '2024-04-15 16:30:00'),
('user15@gmail.com', 'legend_player_id', '081234567804', '2024-04-20 11:45:00'),
('user16@gmail.com', 'battle_royale_king', '081234567805', '2024-05-01 13:15:00'),
('user17@gmail.com', 'moba_specialist', '081234567806', '2024-05-05 15:30:00'),
('user18@gmail.com', 'fps_shooter_pro', '081234567807', '2024-05-10 10:20:00'),
('user19@gmail.com', 'strategy_master', '081234567808', '2024-05-15 14:50:00'),
('user20@gmail.com', 'rpg_adventurer', '081234567809', '2024-05-20 12:10:00'),
('user21@gmail.com', 'competitive_gamer', '081234567810', '2024-06-01 09:30:00'),
('user22@gmail.com', 'casual_player_88', '081234567811', '2024-06-05 16:15:00'),
('user23@gmail.com', 'hardcore_gamer', '081234567812', '2024-06-10 11:40:00'),
('user24@gmail.com', 'mobile_esports', '081234567813', '2024-06-15 13:25:00'),
('user25@gmail.com', 'gaming_enthusiast', '081234567814', '2024-06-20 15:45:00');

-- =============================================
-- INSERT ORDERS
-- =============================================
INSERT INTO orders (user_id, product_id, quantity, total_amount, status, player_id, player_name, payment_method, created_at, updated_at, completed_at) VALUES
-- Completed Orders
(1, 1, 1, 12000, 'completed', '123456789', 'ProGamer2024', 'Dana', '2024-12-01 10:30:00', '2024-12-01 10:35:00', '2024-12-01 10:35:00'),
(2, 6, 1, 20000, 'completed', '987654321', 'MLLegendKing', 'GoPay', '2024-12-01 14:20:00', '2024-12-01 14:25:00', '2024-12-01 14:25:00'),
(3, 2, 1, 24000, 'completed', '456789123', 'FFMasterIndo', 'OVO', '2024-12-02 09:15:00', '2024-12-02 09:20:00', '2024-12-02 09:20:00'),
(4, 15, 1, 18000, 'completed', '789123456', 'CODSniperElite', 'ShopeePay', '2024-12-02 16:45:00', '2024-12-02 16:50:00', '2024-12-02 16:50:00'),
(5, 18, 1, 65000, 'completed', '321654987', 'ClashKing777', 'Bank Transfer', '2024-12-03 11:30:00', '2024-12-03 11:35:00', '2024-12-03 11:35:00'),
(6, 10, 1, 15000, 'completed', '654987321', 'HOKWarrior88', 'Dana', '2024-12-03 13:20:00', '2024-12-03 13:25:00', '2024-12-03 13:25:00'),
(7, 24, 1, 15000, 'completed', '147258369', 'PUBGAceMaster', 'GoPay', '2024-12-04 15:10:00', '2024-12-04 15:15:00', '2024-12-04 15:15:00'),
(8, 27, 1, 15000, 'completed', '369258147', 'GenshinTraveler', 'OVO', '2024-12-04 08:45:00', '2024-12-04 08:50:00', '2024-12-04 08:50:00'),
(9, 7, 1, 40000, 'completed', '258147369', 'MobileGamerID', 'Dana', '2024-12-05 12:30:00', '2024-12-05 12:35:00', '2024-12-05 12:35:00'),
(10, 16, 1, 89000, 'completed', '741852963', 'EsportsChampion', 'ShopeePay', '2024-12-05 17:20:00', '2024-12-05 17:25:00', '2024-12-05 17:25:00'),
(11, 3, 1, 60000, 'completed', '852963741', 'DiamondHunter99', 'Bank Transfer', '2024-12-06 10:15:00', '2024-12-06 10:20:00', '2024-12-06 10:20:00'),
(12, 8, 1, 99000, 'completed', '963741852', 'TopPlayerIndo', 'GoPay', '2024-12-06 14:40:00', '2024-12-06 14:45:00', '2024-12-06 14:45:00'),
(13, 11, 1, 75000, 'completed', '159753486', 'GameAddictPro', 'Dana', '2024-12-07 09:25:00', '2024-12-07 09:30:00', '2024-12-07 09:30:00'),
(14, 21, 1, 65000, 'completed', '486159753', 'RoyalClashLord', 'OVO', '2024-12-07 16:30:00', '2024-12-07 16:35:00', '2024-12-07 16:35:00'),
(15, 4, 1, 120000, 'completed', '753486159', 'LegendPlayerID', 'Bank Transfer', '2024-12-08 11:45:00', '2024-12-08 11:50:00', '2024-12-08 11:50:00'),
(16, 25, 1, 75000, 'completed', '357159486', 'BattleRoyaleKing', 'Dana', '2024-12-08 13:15:00', '2024-12-08 13:20:00', '2024-12-08 13:20:00'),
(17, 9, 1, 250000, 'completed', '486357159', 'MobaSpecialist', 'GoPay', '2024-12-09 15:30:00', '2024-12-09 15:35:00', '2024-12-09 15:35:00'),
(18, 17, 1, 179000, 'completed', '159486357', 'FPSShooterPro', 'ShopeePay', '2024-12-09 10:20:00', '2024-12-09 10:25:00', '2024-12-09 10:25:00'),
(19, 19, 1, 150000, 'completed', '357486159', 'StrategyMaster', 'OVO', '2024-12-10 14:50:00', '2024-12-10 14:55:00', '2024-12-10 14:55:00'),
(20, 28, 1, 75000, 'completed', '486159357', 'RPGAdventurer', 'Dana', '2024-12-10 12:10:00', '2024-12-10 12:15:00', '2024-12-10 12:15:00'),
(21, 12, 1, 240000, 'completed', '159357486', 'CompetitiveGamer', 'Bank Transfer', '2024-12-11 09:30:00', '2024-12-11 09:35:00', '2024-12-11 09:35:00'),
(22, 1, 2, 24000, 'completed', '357159864', 'CasualPlayer88', 'GoPay', '2024-12-11 16:15:00', '2024-12-11 16:20:00', '2024-12-11 16:20:00'),
(23, 26, 1, 240000, 'completed', '864357159', 'HardcoreGamer', 'Dana', '2024-12-12 11:40:00', '2024-12-12 11:45:00', '2024-12-12 11:45:00'),
(24, 18, 1, 449000, 'completed', '159864357', 'MobileEsports', 'ShopeePay', '2024-12-12 13:25:00', '2024-12-12 13:30:00', '2024-12-12 13:30:00'),
(25, 29, 1, 480000, 'completed', '357864159', 'GamingEnthusiast', 'Bank Transfer', '2024-12-13 15:45:00', '2024-12-13 15:50:00', '2024-12-13 15:50:00'),

-- Processing Orders
(1, 5, 1, 240000, 'processing', '123789456', 'ProGamer2024', 'Dana', '2024-12-20 10:30:00', '2024-12-20 10:35:00', NULL),
(3, 14, 1, 240000, 'processing', '456123789', 'FFMasterIndo', 'GoPay', '2024-12-20 11:15:00', '2024-12-20 11:20:00', NULL),

-- Pending Orders
(2, 20, 1, 299000, 'pending', '789456123', 'MLLegendKing', 'OVO', '2024-12-20 14:20:00', '2024-12-20 14:20:00', NULL),
(5, 13, 1, 480000, 'pending', '321987654', 'ClashKing777', 'Bank Transfer', '2024-12-20 16:45:00', '2024-12-20 16:45:00', NULL),

-- Failed Orders
(7, 22, 1, 299000, 'failed', '147369258', 'PUBGAceMaster', 'Credit Card', '2024-12-19 12:00:00', '2024-12-19 12:05:00', NULL);

-- =============================================
-- INSERT TRANSACTIONS (from completed orders)
-- =============================================
INSERT INTO transactions (order_id, user_id, product_id, amount, profit, status, payment_method, transaction_fee, completed_at) VALUES
(1, 1, 1, 12000, 2000, 'completed', 'Dana', 180, '2024-12-01 10:35:00'),
(2, 2, 6, 20000, 3000, 'completed', 'GoPay', 300, '2024-12-01 14:25:00'),
(3, 3, 2, 24000, 4000, 'completed', 'OVO', 420, '2024-12-02 09:20:00'),
(4, 4, 15, 18000, 3000, 'completed', 'ShopeePay', 270, '2024-12-02 16:50:00'),
(5, 5, 18, 65000, 10000, 'completed', 'Bank Transfer', 5000, '2024-12-03 11:35:00'),
(6, 6, 10, 15000, 2500, 'completed', 'Dana', 225, '2024-12-03 13:25:00'),
(7, 7, 24, 15000, 2500, 'completed', 'GoPay', 225, '2024-12-04 15:15:00'),
(8, 8, 27, 15000, 2500, 'completed', 'OVO', 262, '2024-12-04 08:50:00'),
(9, 9, 7, 40000, 6000, 'completed', 'Dana', 600, '2024-12-05 12:35:00'),
(10, 10, 16, 89000, 14000, 'completed', 'ShopeePay', 1335, '2024-12-05 17:25:00'),
(11, 11, 3, 60000, 10000, 'completed', 'Bank Transfer', 5000, '2024-12-06 10:20:00'),
(12, 12, 8, 99000, 14000, 'completed', 'GoPay', 1485, '2024-12-06 14:45:00'),
(13, 13, 11, 75000, 12000, 'completed', 'Dana', 1125, '2024-12-07 09:30:00'),
(14, 14, 21, 65000, 10000, 'completed', 'OVO', 1137, '2024-12-07 16:35:00'),
(15, 15, 4, 120000, 20000, 'completed', 'Bank Transfer', 5000, '2024-12-08 11:50:00'),
(16, 16, 25, 75000, 12000, 'completed', 'Dana', 1125, '2024-12-08 13:20:00'),
(17, 17, 9, 250000, 35000, 'completed', 'GoPay', 3750, '2024-12-09 15:35:00'),
(18, 18, 17, 179000, 27000, 'completed', 'ShopeePay', 2685, '2024-12-09 10:25:00'),
(19, 19, 19, 150000, 22000, 'completed', 'OVO', 2625, '2024-12-10 14:55:00'),
(20, 20, 28, 75000, 12000, 'completed', 'Dana', 1125, '2024-12-10 12:15:00'),
(21, 21, 12, 240000, 35000, 'completed', 'Bank Transfer', 5000, '2024-12-11 09:35:00'),
(22, 22, 1, 24000, 4000, 'completed', 'GoPay', 360, '2024-12-11 16:20:00'),
(23, 23, 26, 240000, 35000, 'completed', 'Dana', 3600, '2024-12-12 11:45:00'),
(24, 24, 18, 449000, 67000, 'completed', 'ShopeePay', 6735, '2024-12-12 13:30:00'),
(25, 25, 29, 480000, 70000, 'completed', 'Bank Transfer', 5000, '2024-12-13 15:50:00');

-- =============================================
-- UPDATE user totals (will be handled by triggers in real scenario)
-- =============================================
UPDATE users u 
SET 
    total_spent = (
        SELECT COALESCE(SUM(t.amount), 0) 
        FROM transactions t 
        WHERE t.user_id = u.id AND t.status = 'completed'
    ),
    total_transactions = (
        SELECT COUNT(*) 
        FROM transactions t 
        WHERE t.user_id = u.id AND t.status = 'completed'
    );

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check data counts
SELECT 'admin_users' as table_name, COUNT(*) as count FROM admin_users
UNION ALL
SELECT 'games', COUNT(*) FROM games
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'payment_methods', COUNT(*) FROM payment_methods;

-- Check revenue summary
SELECT 
    COUNT(*) as total_transactions,
    SUM(amount) as total_revenue,
    SUM(profit) as total_profit,
    AVG(amount) as avg_transaction_value
FROM transactions 
WHERE status = 'completed';

-- Check game performance
SELECT * FROM game_performance ORDER BY total_revenue DESC LIMIT 5;

-- Check monthly revenue
SELECT * FROM monthly_revenue ORDER BY month DESC LIMIT 6;