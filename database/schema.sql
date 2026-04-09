-- Create Users Table for Authentication First
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Scans Table Second
CREATE TABLE IF NOT EXISTS scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    original_message TEXT NOT NULL,
    risk_level ENUM('Scam', 'Suspicious', 'Safe') NOT NULL,
    probability DECIMAL(5,2) NOT NULL,
    analysis_data JSON NOT NULL, -- Store full heuristic/AI/RAG blob
    source ENUM('text', 'audio') DEFAULT 'text',
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
