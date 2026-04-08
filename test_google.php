<?php
$token = "fake_token";
$verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($token);
$opts = [ 'ssl' => [ 'verify_peer' => false, 'verify_peer_name' => false ] ];
$context = stream_context_create($opts);
$response = @file_get_contents($verifyUrl, false, $context);
var_dump($response);
$error = error_get_last();
var_dump($error);
