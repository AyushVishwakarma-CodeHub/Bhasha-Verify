<?php

class UserModel {
    private $pdo;

    public function __construct() {
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $db   = $_ENV['DB_NAME'] ?? 'bhasha_verify';
        $port = $_ENV['DB_PORT'] ?? '3306';
        $user = $_ENV['DB_USER'] ?? 'root';
        $pass = $_ENV['DB_PASS'] ?? '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
        $options = [
            PDO::MYSQL_ATTR_SSL_CA => '/etc/ssl/certs/ca-certificates.crt',
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
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
        
        $sql = "INSERT INTO users (full_name, email, password_hash, created_at) VALUES (?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        
        $currentTime = date('Y-m-d H:i:s');

        try {
            $stmt->execute([trim($fullName), strtolower(trim($email)), $hashed, $currentTime]);
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
    /**
     * Authenticate or seamlessly rigster a Google User
     */
    public function authenticateGoogleUser($fullName, $email) {
        if (!$this->pdo) return ['error' => 'Database connection failed'];

        // 1. Check if user already exists
        $stmt = $this->pdo->prepare("SELECT id, full_name, email FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([strtolower(trim($email))]);
        $user = $stmt->fetch();

        if ($user) {
            return [
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'full_name' => $user['full_name'],
                    'email' => $user['email']
                ]
            ];
        }

        // 2. If they don't exist, magically register them with a secure dummy password!
        $randomPassword = bin2hex(random_bytes(16)); // Secure bypass password that can never be typed
        $hashed = password_hash($randomPassword, PASSWORD_BCRYPT);
        
        $sql = "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)";
        $insertStmt = $this->pdo->prepare($sql);
        
        try {
            $insertStmt->execute([trim($fullName), strtolower(trim($email)), $hashed]);
            return [
                'success' => true,
                'user' => [
                    'id' => $this->pdo->lastInsertId(),
                    'full_name' => trim($fullName),
                    'email' => strtolower(trim($email))
                ]
            ];
        } catch (Exception $e) {
            return ['error' => 'Failed to seamlessly register Google User: ' . $e->getMessage()];
        }
    }

    /**
     * Delete a user and all their associated scan data
     */
    public function deleteUserAndData($userId) {
        if (!$this->pdo) return ['error' => 'Database connection failed'];

        try {
            $this->pdo->beginTransaction();

            // Delete all scan history for this user
            $stmt = $this->pdo->prepare("DELETE FROM scanned_messages WHERE user_id = ?");
            $stmt->execute([(int)$userId]);

            // Delete the user record
            $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([(int)$userId]);

            $this->pdo->commit();

            return ['success' => true, 'message' => 'User and all associated data deleted successfully.'];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return ['error' => 'Failed to delete user: ' . $e->getMessage()];
        }
    }
}
