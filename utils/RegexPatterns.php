<?php

class RegexPatterns {
    public static $URGENCY_WORDS = [
        // English
        'urgent', 'immediate', 'action required', 'blocked', 'last chance', 
        'suspend', 'verify now', 'account locked', 'within 24 hours', 'penalty',
        'update kyc', 'pan link', 'alert', 'important', 'permanently block',
        // Hindi / Hinglish
        'jaldi', 'turant', 'karein', 'ab blacklist', 'block', 'band', 
        'band ho jayega', 'timeout', 'block ho jayega', 'ghabrana mat', 'sirf'
    ];
    
    // Detects common URL shorteners or IPs masked as hosts
    public static $SUSPICIOUS_LINKS_REGEX = '/(http:\/\/|https:\/\/)?(bit\.ly|tinyurl|is\.gd|goo\.gl|t\.co|ow\.ly|lnkd\.in|db\.tt|qr\.ae|adf\.ly|bitly\.com|cutt\.ly|rebrand\.ly|shorte\.st|tiny\.cc)[^\s]*/i';
    
    // Generic phone structure
    public static $PHONE_NUMBER_REGEX = '/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/';
    
    // Looking for OTP or similar requests (English + Hindi/Hinglish)
    public static $OTP_REQUEST_REGEX = '/(otp|one time password|pin|code|password|batao|dijiye|share karein|batayein)\b/i';
    
    // Sensitive actions (English + Hindi/Hinglish)
    public static $SENSITIVE_ACTIONS_REGEX = '/(click here|login|verify|verification|update|kyc|pan|link par|khata|aadhaar|pan card)/i';
}
