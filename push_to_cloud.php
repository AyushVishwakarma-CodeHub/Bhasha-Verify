<?php
// push_to_cloud.php
// Run this locally to setup your Aiven tables!

$host = 'mysql-20296c3e-bhasha-verify.i.aivencloud.com';
$port = '10459';
$user = 'avnadmin';
$db   = 'defaultdb';
$pass = getenv('DB_PASS') ?: 'YOUR_DB_PASSWORD_HERE'; // Set DB_PASS env var before running

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to Aiven Cloud... \n";
    
    $sqlFile = 'database/schema.sql';
    if (!file_exists($sqlFile)) {
        die("Error: database/schema.sql not found!");
    }
    
    $sql = file_get_contents($sqlFile);
    $pdo->exec($sql);
    
    echo "--------------------------------------------------------\n";
    echo "SUCCESS! Your tables (users, scans) have been created.\n";
    echo "--------------------------------------------------------\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
