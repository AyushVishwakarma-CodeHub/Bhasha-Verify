<?php

use GuzzleHttp\Client;

class AIService {
    private $client;
    private $apiKey;
    private $provider;

    public function __construct() {
        $this->client = new Client();
        $this->apiKey = $_ENV['GEMINI_API_KEY'] ?? $_ENV['OPENAI_API_KEY'] ?? '';
        $this->provider = !empty($_ENV['GEMINI_API_KEY']) ? 'gemini' : 'openai';
    }

    public function analyze($message) {
        if (empty($this->apiKey) || $this->apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            return $this->fallbackAnalysis($message);
        }

        $prompt = "You are a Scam Detection Expert. Analyze the following message and determine if it is a scam.

Message: \"$message\"

Respond ONLY with a valid JSON object (no markdown, no explanation outside JSON) with these exact keys:
{
  \"intent\": \"scam\" or \"safe\",
  \"urgency\": \"low\" or \"medium\" or \"high\",
  \"sensitive_request\": true or false,
  \"explanation\": \"A simple 1-2 sentence human-friendly explanation\"
}";

        try {
            if ($this->provider === 'gemini') {
                $result = $this->callGemini($prompt);
                if ($result !== null) return $result;
            } else {
                $result = $this->callOpenAI($prompt);
                if ($result !== null) return $result;
            }
            // If API returned null, use fallback
            return $this->fallbackAnalysis($message);
        } catch (\Exception $e) {
            // On ANY API error (429, 500, timeout), use intelligent fallback
            return $this->fallbackAnalysis($message);
        }
    }

    /**
     * Smart fallback when Gemini/OpenAI is unavailable
     * Uses keyword-based heuristic analysis to provide AI-like insights
     */
    private function fallbackAnalysis($message) {
        $lower = strtolower($message);
        
        $scamIndicators = 0;
        $urgency = 'low';
        $sensitiveRequest = false;
        $reasons = [];
        
        // Check urgency words (English + Hindi/Hinglish)
        $urgencyWords = ['urgent', 'immediately', 'action required', 'blocked', 'last chance', 'suspended', 'within 24 hours', 'block', 'jaldi', 'timeout', 'band', 'turant', 'permanently block', 'band ho jayega'];
        foreach ($urgencyWords as $word) {
            if (strpos($lower, $word) !== false) {
                $scamIndicators++;
                $urgency = 'high';
                $reasons[] = 'creates urgency';
            }
        }
        
        // Check for sensitive requests (English + Hindi/Hinglish)
        $sensitiveWords = ['otp', 'password', 'pin', 'click here', 'verify your', 'update kyc', 'batao', 'cvv', 'aadhaar', 'pan card', 'link par', 'verify karein'];
        foreach ($sensitiveWords as $word) {
            if (strpos($lower, $word) !== false) {
                $scamIndicators++;
                $sensitiveRequest = true;
                $reasons[] = 'asks for sensitive info';
            }
        }
        
        // Check for suspicious links
        if (preg_match('/(bit\.ly|tinyurl|goo\.gl|t\.co|cutt\.ly)/i', $message)) {
            $scamIndicators += 2;
            $reasons[] = 'contains suspicious link';
        }
        
        // Determine intent
        $intent = $scamIndicators >= 2 ? 'scam' : 'safe';
        
        if ($intent === 'scam') {
            $explanation = 'This message ' . implode(' and ', array_unique($reasons)) . '. Be cautious before taking any action.';
        } else {
            $explanation = 'This message appears to be a standard notification. No clear scam signals detected.';
        }
        
        return [
            'intent' => $intent,
            'urgency' => $urgency,
            'sensitive_request' => $sensitiveRequest,
            'explanation' => $explanation,
            'source' => 'fallback'  // Flag so frontend knows AI wasn't used
        ];
    }

    private function callGemini($prompt) {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $this->apiKey;
        $response = $this->client->post($url, [
            'json' => [
                'contents' => [
                    ['parts' => [['text' => $prompt]]]
                ]
            ],
            'curl' => [CURLOPT_SSL_VERIFYPEER => false],
            'timeout' => 15
        ]);

        $body = json_decode((string)$response->getBody(), true);
        $text = $body['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
        
        // Clean markdown formatting if present
        $text = preg_replace('/```json\s*/', '', $text);
        $text = preg_replace('/```\s*/', '', $text);
        $result = json_decode(trim($text), true);
        
        if ($result && isset($result['intent'])) {
            $result['source'] = 'gemini';
            return $result;
        }
        return null;
    }

    private function callOpenAI($prompt) {
        $url = 'https://api.openai.com/v1/chat/completions';
        $response = $this->client->post($url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json'
            ],
            'json' => [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a JSON-only API.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.2
            ],
            'curl' => [CURLOPT_SSL_VERIFYPEER => false],
            'timeout' => 15
        ]);

        $body = json_decode((string)$response->getBody(), true);
        $text = $body['choices'][0]['message']['content'] ?? '{}';
        $result = json_decode(trim($text), true);
        
        if ($result && isset($result['intent'])) {
            $result['source'] = 'openai';
            return $result;
        }
        return null;
    }
}
