<?php

class MessageModel {
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
            // Log error but don't crash the whole app if DB is down
            error_log("Database connection failed: " . $e->getMessage());
        }
    }

    /**
     * Logs the scan request and its results to MySQL
     */
    public function logScan($message, $trustScore, $heuristics, $aiInsights, $ragResult, $source = 'text', $userId = null) {
        if (!$this->pdo) return null;

        $sql = "INSERT INTO scans (user_id, original_message, risk_level, probability, analysis_data, source, scanned_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->pdo->prepare($sql);
        
        $analysisData = json_encode([
            'heuristics' => $heuristics,
            'ai' => $aiInsights,
            'rag' => $ragResult
        ]);

        $currentTime = date('Y-m-d H:i:s');

        $stmt->execute([
            $userId,
            $message,
            $trustScore['risk_level'],
            $trustScore['probability'],
            $analysisData,
            $source,
            $currentTime
        ]);

        return $this->pdo->lastInsertId();
    }

    /**
     * Fetches the last 20 scans for the history view
     */
    public function getHistory($limit = 20, $userId = null) {
        if (!$this->pdo) return [];

        if ($userId) {
            $stmt = $this->pdo->prepare("SELECT * FROM scans WHERE user_id = ? ORDER BY scanned_at DESC LIMIT $limit");
            $stmt->execute([$userId]);
        } else {
            $stmt = $this->pdo->query("SELECT * FROM scans ORDER BY scanned_at DESC LIMIT $limit");
        }
        
        $results = $stmt->fetchAll();

        // Decode JSON data for frontend convenience
        foreach ($results as &$row) {
            $row['analysis_data'] = json_decode($row['analysis_data'], true);
        }

        return $results;
    }

    /**
     * Aggregates database statistics for the massive Admin Dashboard
     */
    public function getAnalytics($userId = null) {
        if (!$this->pdo) return null;

        $whereClause = $userId ? "WHERE user_id = ?" : "";
        $params = $userId ? [$userId] : [];

        // Total scans & average probability
        $stmt = $this->pdo->prepare("SELECT COUNT(*) as totalScans, AVG(probability) as avgProb FROM scans $whereClause");
        $stmt->execute($params);
        $summary = $stmt->fetch();
        
        // Group by risk
        $stmt = $this->pdo->prepare("SELECT risk_level, COUNT(*) as count FROM scans $whereClause GROUP BY risk_level");
        $stmt->execute($params);
        $riskGroups = $stmt->fetchAll();
        $risks = ['Safe' => 0, 'Suspicious' => 0, 'Scam' => 0];
        foreach ($riskGroups as $row) {
            $risks[$row['risk_level']] = (int)$row['count'];
        }

        // Group by source (Audio vs Text)
        $stmt = $this->pdo->prepare("SELECT source, COUNT(*) as count FROM scans $whereClause GROUP BY source");
        $stmt->execute($params);
        $sourceGroups = $stmt->fetchAll();
        $sources = ['text' => 0, 'audio' => 0];
        foreach ($sourceGroups as $row) {
            $sources[$row['source'] ?: 'text'] = (int)$row['count'];
        }

        // Catch the last 7 days of activity for the timeline chart
        $stmt = $this->pdo->prepare("
            SELECT DATE(scanned_at) as date, COUNT(*) as count 
            FROM scans 
            $whereClause 
            GROUP BY date 
            ORDER BY date DESC LIMIT 7
        ");
        $stmt->execute($params);
        $timelineGroups = $stmt->fetchAll();

        return [
            'totalScans' => (int)$summary['totalScans'],
            'avgProbability' => round((float)$summary['avgProb'], 1),
            'riskDistribution' => $risks,
            'sourceDistribution' => $sources,
            'recentActivity' => array_reverse($timelineGroups)
        ];
    }

    /**
     * Returns all registered users with their scan counts for the Admin Portal
     */
    public function getAllUsers() {
        if (!$this->pdo) return [];

        $sql = "SELECT u.id, u.full_name, u.email, u.created_at,
                       COUNT(s.id) as scan_count,
                       MAX(s.scanned_at) as last_active
                FROM users u
                LEFT JOIN scans s ON u.id = s.user_id
                GROUP BY u.id, u.full_name, u.email, u.created_at
                ORDER BY u.created_at DESC";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }

    /**
     * Returns the latest 50 scan activities with user info for the Admin Activity Feed
     */
    public function getRecentActivityFeed($limit = 50) {
        if (!$this->pdo) return [];

        $sql = "SELECT s.id, s.original_message, s.risk_level, s.probability, 
                       s.source, s.scanned_at,
                       COALESCE(u.full_name, 'Anonymous') as user_name,
                       u.email as user_email
                FROM scans s
                LEFT JOIN users u ON s.user_id = u.id
                ORDER BY s.scanned_at DESC
                LIMIT $limit";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }

    /**
     * Returns pending account deletion requests
     */
    public function getDeletionRequests() {
        if (!$this->pdo) return [];

        $sql = "SELECT s.id as scan_id, s.scanned_at as requested_at, 
                       u.id as user_id, u.full_name, u.email, u.created_at
                FROM scans s
                INNER JOIN users u ON s.user_id = u.id
                WHERE s.original_message LIKE 'SYSTEM ALERT: USER REQUESTED ACCOUNT DELETION%'
                ORDER BY s.scanned_at DESC";

        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }
}
