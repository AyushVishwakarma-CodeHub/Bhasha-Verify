<?php
// db_debug.php
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

if ($host === 'NOT_SET' || $host === 'localhost') {
    die("ERROR: Environment variables (DB_HOST) are not reaching the PHP app. Did you add them to Render?");
}

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

echo "Attempting Connection Method 1 (Explicit SSL Path)...\n";
try {
    $options1 = [
        PDO::MYSQL_ATTR_SSL_CA => '/etc/ssl/certs/ca-certificates.crt',
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ];
    $pdo1 = new PDO($dsn, $user, $pass, $options1);
    die("SUCCESS: Connection established via Method 1!");
} catch (Exception $e) {
    echo "Method 1 Failed: " . $e->getMessage() . "\n\n";
}

echo "Attempting Connection Method 2 (Simple SSL)...\n";
try {
    $options2 = [
        PDO::MYSQL_ATTR_SSL_CA => true,
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ];
    $pdo2 = new PDO($dsn, $user, $pass, $options2);
    die("SUCCESS: Connection established via Method 2!");
} catch (Exception $e) {
    echo "Method 2 Failed: " . $e->getMessage() . "\n\n";
}

echo "Attempting Connection Method 3 (No Cert Verify)...\n";
try {
    $options3 = [
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ];
    $pdo3 = new PDO($dsn, $user, $pass, $options3);
    die("SUCCESS: Connection established via Method 3!");
} catch (Exception $e) {
    echo "Method 3 Failed: " . $e->getMessage() . "\n\n";
}
