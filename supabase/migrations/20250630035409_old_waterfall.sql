-- TopUp Game MIS Database Schema
-- Created for MySQL/phpMyAdmin

-- Drop database if exists (be careful in production!)
DROP DATABASE IF EXISTS topup_game_mis;

-- Create database
CREATE DATABASE topup_game_mis CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE topup_game_mis;

-- =============================================
-- TABLE: users (customers who buy topup)
-- =============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    total_spent DECIMAL(15,2) DEFAULT 0.00,
    total_transactions INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
);

-- =============================================
-- TABLE: admin_users (for MIS login)
-- =============================================
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('manager', 'admin', 'analyst') DEFAULT 'manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =============================================
-- TABLE: games
-- =============================================
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- =============================================
-- TABLE: products
-- =============================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    denomination VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) GENERATED ALWAYS AS (price - cost) STORED,
    profit_margin DECIMAL(5,2) GENERATED ALWAYS AS ((price - cost) / price * 100) STORED,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_game_id (game_id),
    INDEX idx_is_active (is_active),
    INDEX idx_price (price)
);

-- =============================================
-- TABLE: orders
-- =============================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    player_id VARCHAR(100) NOT NULL,
    player_name VARCHAR(100),
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_completed_at (completed_at)
);

-- =============================================
-- TABLE: transactions (completed orders)
-- =============================================
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    profit DECIMAL(12,2) NOT NULL,
    status ENUM('completed', 'refunded', 'disputed') DEFAULT 'completed',
    payment_method VARCHAR(50) NOT NULL,
    transaction_fee DECIMAL(8,2) DEFAULT 0.00,
    net_profit DECIMAL(12,2) GENERATED ALWAYS AS (profit - transaction_fee) STORED,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refunded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    INDEX idx_status (status),
    INDEX idx_completed_at (completed_at),
    INDEX idx_amount (amount)
);

-- =============================================
-- TABLE: payment_methods
-- =============================================
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    type ENUM('ewallet', 'bank_transfer', 'credit_card', 'crypto') NOT NULL,
    fee_percentage DECIMAL(5,2) DEFAULT 0.00,
    fee_fixed DECIMAL(8,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- VIEWS for Analytics
-- =============================================

-- Monthly Revenue View
CREATE VIEW monthly_revenue AS
SELECT 
    DATE_FORMAT(completed_at, '%Y-%m') as month,
    DATE_FORMAT(completed_at, '%M %Y') as month_name,
    COUNT(*) as total_transactions,
    SUM(amount) as total_revenue,
    SUM(profit) as total_profit,
    AVG(amount) as avg_transaction_value
FROM transactions 
WHERE status = 'completed'
GROUP BY DATE_FORMAT(completed_at, '%Y-%m')
ORDER BY month DESC;

-- Game Performance View
CREATE VIEW game_performance AS
SELECT 
    g.id,
    g.name as game_name,
    g.icon,
    g.category,
    COUNT(t.id) as total_transactions,
    SUM(t.amount) as total_revenue,
    SUM(t.profit) as total_profit,
    AVG(t.amount) as avg_transaction_value,
    (SUM(t.profit) / SUM(t.amount) * 100) as profit_margin_percentage
FROM games g
LEFT JOIN products p ON g.id = p.game_id
LEFT JOIN transactions t ON p.id = t.product_id AND t.status = 'completed'
WHERE g.is_active = TRUE
GROUP BY g.id, g.name, g.icon, g.category
ORDER BY total_revenue DESC;

-- Product Performance View
CREATE VIEW product_performance AS
SELECT 
    p.id,
    p.name as product_name,
    p.denomination,
    g.name as game_name,
    g.icon as game_icon,
    p.price,
    p.cost,
    p.profit as unit_profit,
    p.profit_margin,
    COUNT(t.id) as times_sold,
    SUM(t.amount) as total_revenue,
    SUM(t.profit) as total_profit
FROM products p
JOIN games g ON p.game_id = g.id
LEFT JOIN transactions t ON p.id = t.product_id AND t.status = 'completed'
WHERE p.is_active = TRUE
GROUP BY p.id, p.name, p.denomination, g.name, g.icon, p.price, p.cost, p.profit, p.profit_margin
ORDER BY total_revenue DESC;

-- User Analytics View
CREATE VIEW user_analytics AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.created_at as registration_date,
    COUNT(t.id) as total_transactions,
    SUM(t.amount) as total_spent,
    AVG(t.amount) as avg_transaction_value,
    MAX(t.completed_at) as last_transaction_date,
    DATEDIFF(CURDATE(), MAX(t.completed_at)) as days_since_last_transaction
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id AND t.status = 'completed'
WHERE u.is_active = TRUE
GROUP BY u.id, u.username, u.email, u.created_at
ORDER BY total_spent DESC;

-- =============================================
-- TRIGGERS for maintaining calculated fields
-- =============================================

-- Update user totals when transaction is completed
DELIMITER //
CREATE TRIGGER update_user_totals_after_transaction
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE users 
        SET 
            total_spent = total_spent + NEW.amount,
            total_transactions = total_transactions + 1
        WHERE id = NEW.user_id;
    END IF;
END//

-- Update user totals when transaction is refunded
CREATE TRIGGER update_user_totals_after_refund
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    IF OLD.status = 'completed' AND NEW.status = 'refunded' THEN
        UPDATE users 
        SET 
            total_spent = total_spent - NEW.amount,
            total_transactions = total_transactions - 1
        WHERE id = NEW.user_id;
    END IF;
END//

DELIMITER ;