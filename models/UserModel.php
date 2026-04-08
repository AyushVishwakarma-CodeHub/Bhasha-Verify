<?php

class UserModel {
    private $pdo;

    public function __construct() {
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $db   = $_ENV['DB_NAME'] ?? 'bhasha_verify';
        $user = $_ENV['DB_USER'] ?? 'root';
        $pass = $_ENV['DB_PASS'] ?? '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $user, $pass, $options);
        } catch (\PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
        }
    }

    /**
     * Determine if an email is already registered
     */
    public function emailExists($email) {
        if (!$this->pdo) return false;
        
        $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([strtolower(trim($email))]);
        return $stmt->fetch() !== false;
    }

    /**
     * Create a new user securely
     */
    public function createUser($fullName, $email, $rawPassword) {
        if (!$this->pdo) return ['error' => 'Database connection failed'];
        if ($this->emailExists($email)) return ['error' => 'Email is already registered'];

        $hashed = password_hash($rawPassword, PASSWORD_BCRYPT);
        
        $sql = "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        
        try {
            $stmt->execute([trim($fullName), strtolower(trim($email)), $hashed]);
            return ['success' => true, 'id' => $this->pdo->lastInsertId()];
        } catch (Exception $e) {
            return ['error' => 'Failed to create user: ' . $e->getMessage()];
        }
    }

    /**
     * Authenticate an existing user
     */
    public function authenticateUser($email, $rawPassword) {
        if (!$this->pdo) return ['error' => 'Database connection failed'];

        $stmt = $this->pdo->prepare("SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([strtolower(trim($email))]);
        $user = $stmt->fetch();

        if ($user && password_verify($rawPassword, $user['password_hash'])) {
            // Do not send hash back to frontend
            return [
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'full_name' => $user['full_name'],
                    'email' => $user['email']
                ]
            ];
        }

        return ['error' => 'Invalid email or password'];
    }
}
