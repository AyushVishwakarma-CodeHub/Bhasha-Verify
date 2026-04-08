<?php
// db_debug.php
// Use this to find the EXACT reason the connection is failing.

header('Content-Type: text/plain');

$host = $_ENV['DB_HOST'] ?? 'NOT_SET';
$port = $_ENV['DB_PORT'] ?? 'NOT_SET';
$db   = $_ENV['DB_NAME'] ?? 'NOT_SET';
$user = $_ENV['DB_USER'] ?? 'NOT_SET';
$pass = $_ENV['DB_PASS'] ?? 'NOT_SET';

echo "DEBUG INFO:\n";
echo "Host: $host\n";
echo "Port: $port\n";
echo "DB: $db\n";
echo "User: $user\n\n";

if ($host === 'NOT_SET') {
    die("ERROR: Environment variables are not reaching the PHP app. Did you add them to Render?");
}

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $options = [
        PDO::MYSQL_ATTR_SSL_CA => true,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ];
    
    echo "Attempting connection...\n";
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "SUCCESS: Connection established!";
    
} catch (Exception $e) {
    echo "FAILURE: " . $e->getMessage();
}
