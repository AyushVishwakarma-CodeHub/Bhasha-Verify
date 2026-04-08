<?php
// Simulate Twilio incoming Audio Message
$_SERVER['REQUEST_METHOD'] = 'POST';
$_POST['NumMedia'] = 1;
$_POST['MediaUrl0'] = 'https://api.twilio.com/2010-04-01/Accounts/ACfake/Messages/MMfake/Media/MEfake';
$_POST['MediaContentType0'] = 'audio/ogg';
$_POST['Body'] = '';

// Include our index.php to trigger the route
$path = '/api/webhook/whatsapp';
$_SERVER['REQUEST_URI'] = $path;

ob_start();
try {
    require 'index.php';
} catch (Throwable $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
$output = ob_get_clean();
echo "OUTPUT WAS:\n" . $output;
