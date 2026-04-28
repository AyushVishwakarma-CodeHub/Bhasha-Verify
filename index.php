<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

date_default_timezone_set('Asia/Kolkata');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/utils/RegexPatterns.php';
require_once __DIR__ . '/services/HeuristicService.php';
require_once __DIR__ . '/services/AIService.php';
require_once __DIR__ . '/services/RAGService.php';
require_once __DIR__ . '/services/TranscriptionService.php';
require_once __DIR__ . '/models/MessageModel.php';
require_once __DIR__ . '/models/UserModel.php';
require_once __DIR__ . '/controllers/ScanController.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// ─── Route 1: Text Scan ──────────────────────────────
if ($path === '/api/scan' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Message is required']);
        exit();
    }
    
    $controller = new ScanController();
    $userId = isset($input['user_id']) ? (int)$input['user_id'] : null;
    $result = $controller->scanMessage($input['message'], 'text', $userId);
    
    header('Content-Type: application/json');
    echo json_encode($result);
    exit();
}

// ─── Route 2: Audio Scan (Upload → Transcribe → Analyze) ─────
if ($path === '/api/scan-audio' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Check if file was uploaded
    if (!isset($_FILES['audio']) || $_FILES['audio']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Audio file is required. Please upload a valid audio file.']);
        exit();
    }

    $file = $_FILES['audio'];
    
    // Validate file size (max 25MB)
    $maxSize = 25 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'File too large. Maximum size is 25MB.']);
        exit();
    }

    // Validate mime type
    $allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg', 'audio/webm'];
    $mimeType = $file['type'] ?: 'audio/mpeg';
    
    // Step 1: Transcribe Audio
    $transcriptionService = new TranscriptionService();
    $transcription = $transcriptionService->transcribe($file['tmp_name'], $mimeType);
    
    if (!$transcription['success']) {
        header('Content-Type: application/json');
        echo json_encode([
            'error' => $transcription['error'],
            'transcription' => null
        ]);
        exit();
    }

    // Step 2: Analyze the transcribed text through the same 3-layer pipeline
    $controller = new ScanController();
    $userId = isset($_POST['user_id']) ? (int)$_POST['user_id'] : null;
    $result = $controller->scanMessage($transcription['text'], 'audio', $userId);
    
    // Add transcription info to the result
    $result['source'] = 'audio';
    $result['transcription'] = $transcription['text'];
    
    header('Content-Type: application/json');
    echo json_encode($result);
    exit();
}

// ─── Route 3: Fetch Scan History ──────────────────────────
if ($path === '/api/history' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $model = new MessageModel();
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
    $history = $model->getHistory(20, $userId);
    
    header('Content-Type: application/json');
    echo json_encode($history);
    exit();
}

// ─── Route 4: Twilio WhatsApp Webhook ─────────────────────
if ($path === '/api/webhook/whatsapp' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Twilio sends data as form-urlencoded
    $message = $_POST['Body'] ?? '';
    $numMedia = (int)($_POST['NumMedia'] ?? 0);
    $source = 'text';
    
    header('Content-Type: text/xml');
    
    // Check if the user sent a WhatsApp Audio Note or Video
    if ($numMedia > 0 && isset($_POST['MediaUrl0'])) {
        $source = 'audio';
        $mediaUrl = $_POST['MediaUrl0'];
        $contentType = $_POST['MediaContentType0'] ?? 'audio/ogg';
        
        // Securely download the audio file to a temporary system location
        $tmpAudioFile = tempnam(sys_get_temp_dir(), 'bw_audio_');
        
        // Setup basic stream context to handle the download ignoring SSL issues
        $opts = [ 
            'http' => [ 'method' => "GET", 'follow_location' => 1 ],
            'ssl' => [ 'verify_peer' => false, 'verify_peer_name' => false ]
        ];
        $context = stream_context_create($opts);
        
        // Suppress PHP warnings (@) so they don't break the XML response
        $audioContent = @file_get_contents($mediaUrl, false, $context);
        if ($audioContent === false) {
            $reply = "❌ *Audio Error*: Failed to download the voice note. Twilio Sandbox blocks local downloads.";
            header("Content-Type: text/xml");
            echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response><Message><Body>" . htmlspecialchars($reply) . "</Body></Message></Response>";
            exit();
        }
        
        file_put_contents($tmpAudioFile, $audioContent);
        
        // Ensure file is not tiny (e.g. an HTML auth error page)
        if (filesize($tmpAudioFile) < 1000) {
            $reply = "❌ *Audio Error*: Downloaded file is too small or corrupt. Twilio may be blocking media access.";
            echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response><Message><Body>" . htmlspecialchars($reply) . "</Body></Message></Response>";
            exit();
        }
        
        // Transcribe the downloaded audio using Gemini
        $transcriptionService = new TranscriptionService();
        $transResp = $transcriptionService->transcribe($tmpAudioFile, $contentType);
        
        // Clean up hard drive immediately
        @unlink($tmpAudioFile);
        
        if (!$transResp['success']) {
            $reply = "❌ *Audio Error*: Transcription failed. " . $transResp['error'];
            echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response><Message><Body>" . htmlspecialchars($reply) . "</Body></Message></Response>";
            exit();
        }
        
        $message = "AUDIO_TRANSCRIPT: " . $transResp['text'];
    }
    
    if (trim(str_replace('AUDIO_TRANSCRIPT: ', '', $message)) === '') {
        $response = "Welcome to Bhasha-Verify! Forward me any suspicious message, link, or *voice note*, and I will scan it for scams.";
        echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response><Message><Body>" . htmlspecialchars($response) . "</Body></Message></Response>";
        exit();
    }
    
    // Analyze message
    $controller = new ScanController();
    $result = $controller->scanMessage($message, $source);
    
    $risk = $result['trust_score']['risk_level'];
    $prob = (int)$result['trust_score']['probability'];
    
    // Format response beautifully for WhatsApp
    $emoji = $risk === 'Scam' ? '🚨' : ($risk === 'Suspicious' ? '⚠️' : '✅');
    $reply = "*Bhasha-Verify Result*\n";
    $reply .= "$emoji *Risk:* $risk ($prob% Probable)\n\n";
    
    if (!empty($result['explanations'])) {
        $reply .= "*Analysis:*\n";
        foreach ($result['explanations'] as $exp) {
            $reply .= "- $exp\n";
        }
    }
    
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<Response><Message><Body>" . htmlspecialchars($reply) . "</Body></Message></Response>";
    exit();
}

// ─── Route 5: Admin Analytics ──────────────────────────────
if ($path === '/api/admin/analytics' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $model = new MessageModel();
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
    $stats = $model->getAnalytics($userId);
    
    header('Content-Type: application/json');
    echo json_encode($stats);
    exit();
}

// ─── Admin Guard: Only these emails can access admin routes ───
$ADMIN_EMAILS = ['ayushvishwakarmadto29@gmail.com'];

function isAdminRequest($adminEmails) {
    $email = isset($_GET['admin_email']) ? strtolower(trim($_GET['admin_email'])) : '';
    return in_array($email, $adminEmails);
}

// ─── Route 5a: Admin — All Users (PROTECTED) ──────────────
if ($path === '/api/admin/users' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isAdminRequest($ADMIN_EMAILS)) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. Admin only.']);
        exit();
    }
    $model = new MessageModel();
    $users = $model->getAllUsers();
    
    header('Content-Type: application/json');
    echo json_encode($users);
    exit();
}

// ─── Route 5b: Admin — Activity Feed (PROTECTED) ──────────
if ($path === '/api/admin/activity' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isAdminRequest($ADMIN_EMAILS)) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. Admin only.']);
        exit();
    }
    $model = new MessageModel();
    $activity = $model->getRecentActivityFeed(50);
    
    header('Content-Type: application/json');
    echo json_encode($activity);
    exit();
}

// ─── Route 6: User Registration ────────────────────────────
if ($path === '/api/auth/register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['full_name']) || empty($input['email']) || empty($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required.']);
        exit();
    }
    
    $userModel = new UserModel();
    $result = $userModel->createUser($input['full_name'], $input['email'], $input['password']);
    
    header('Content-Type: application/json');
    if (isset($result['error'])) {
        http_response_code(400);
        echo json_encode($result);
    } else {
        echo json_encode($result);
    }
    exit();
}

// ─── Route 7: User Login ───────────────────────────────────
if ($path === '/api/auth/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['email']) || empty($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required.']);
        exit();
    }
    
    $userModel = new UserModel();
    $result = $userModel->authenticateUser($input['email'], $input['password']);
    
    header('Content-Type: application/json');
    if (isset($result['error'])) {
        http_response_code(401);
        echo json_encode($result);
    } else {
        echo json_encode($result);
    }
    exit();
}

// ─── Route 8: Google SSO Login ─────────────────────────────
if ($path === '/api/auth/google' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['token'])) {
        http_response_code(400);
        echo json_encode(['error' => 'JWT Token is required.']);
        exit();
    }
    
    // Verify the JWT token securely against Google's tokeninfo endpoint
    $verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($input['token']);
    $opts = [ 
        'http' => [ 'ignore_errors' => true ],
        'ssl' => [ 'verify_peer' => false, 'verify_peer_name' => false ] 
    ];
    $context = stream_context_create($opts);
    
    $googleResponse = @file_get_contents($verifyUrl, false, $context);
    
    // Debug logging logic
    error_log("GOOGLE RAW RESPONSE: " . $googleResponse);
    
    if (!$googleResponse) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired Google Authentication Token.']);
        exit();
    }
    
    $googleData = json_decode($googleResponse, true);
    
    if (empty($googleData['email']) || empty($googleData['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Could not extract email or name from Google Profile.']);
        exit();
    }
    
    // Seamlessly register or login the user
    $userModel = new UserModel();
    $result = $userModel->authenticateGoogleUser($googleData['name'], $googleData['email']);
    
    header('Content-Type: application/json');
    if (isset($result['error'])) {
        http_response_code(500);
        echo json_encode($result);
    } else {
        echo json_encode($result);
    }
    exit();
}

// ─── Route 9: Admin — Delete User & Data (PROTECTED) ──────
if ($path === '/api/admin/delete-user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['admin_email']) || empty($input['user_id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Admin email and user_id are required.']);
        exit();
    }
    
    // Verify admin
    if (!in_array(strtolower(trim($input['admin_email'])), $ADMIN_EMAILS)) {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied. Admin only.']);
        exit();
    }
    
    $userModel = new UserModel();
    $result = $userModel->deleteUserAndData($input['user_id']);
    
    header('Content-Type: application/json');
    if (isset($result['error'])) {
        http_response_code(500);
    }
    echo json_encode($result);
    exit();
}

// ─── Route 10: User — Request Account Deletion ────────────
if ($path === '/api/user/request-delete' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['user_id']) || empty($input['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID and email are required.']);
        exit();
    }
    
    // Log the deletion request to the database so the admin sees it in the Activity Feed
    $messageModel = new MessageModel();
    $alertMessage = "SYSTEM ALERT: USER REQUESTED ACCOUNT DELETION. Please review and delete user ID: " . $input['user_id'];
    
    $trustScore = [
        'risk_level' => 'Scam', // Use "Scam" so it shows up in RED in the activity feed
        'probability' => 100
    ];
    
    $messageModel->logScan(
        $alertMessage, 
        $trustScore, 
        ['User requested data deletion (DPDP Act)'], 
        ['Action Required: Delete this user from Admin Dashboard'], 
        null, 
        'text', 
        (int)$input['user_id']
    );
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'Your account deletion request has been submitted. Your data will be removed within 72 hours.'
    ]);
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'API route not found']);
