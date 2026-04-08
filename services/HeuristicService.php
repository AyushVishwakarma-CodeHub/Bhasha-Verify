<?php

class HeuristicService {
    public function analyze($message) {
        $score = 0;
        $matchedPatterns = [
            'urgency' => [],
            'suspicious_links' => [],
            'otp_requests' => [],
            'sensitive_actions' => []
        ];
        
        $lowerMessage = strtolower($message);
        
        // 1. Check for Urgency Words
        foreach (RegexPatterns::$URGENCY_WORDS as $word) {
            if (strpos($lowerMessage, $word) !== false) {
                $matchedPatterns['urgency'][] = $word;
                $score += 15;
            }
        }

        // 2. Check for Suspicious Links
        if (preg_match_all(RegexPatterns::$SUSPICIOUS_LINKS_REGEX, $message, $matches)) {
            $matchedPatterns['suspicious_links'] = $matches[0];
            $score += 50; // Super high risk
        }

        // 3. Check for OTP Requests
        if (preg_match_all(RegexPatterns::$OTP_REQUEST_REGEX, $message, $matches)) {
            $matchedPatterns['otp_requests'] = array_unique(array_map('strtolower', $matches[0]));
            $score += 40;
        }
        
        // 4. Check for Sensitive Actions
        if (preg_match_all(RegexPatterns::$SENSITIVE_ACTIONS_REGEX, $message, $matches)) {
            $matchedPatterns['sensitive_actions'] = array_unique(array_map('strtolower', $matches[0]));
            $score += 25;
        }

        return [
            'score' => min($score, 100),
            'matches' => array_filter($matchedPatterns) // Removes empty arrays
        ];
    }
}
