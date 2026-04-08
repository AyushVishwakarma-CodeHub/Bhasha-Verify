<?php

class RAGService {
    private $officialTemplates = [];

    public function __construct() {
        // Mock dataset of official templates
        $this->officialTemplates = [
            [
                'bank' => 'SBI',
                'type' => 'alert',
                'pattern' => 'dear sbi customer, your account a/c no. XXXXXX has been credited with rs. XX on XX. available balance is rs. XX.'
            ],
            [
                'bank' => 'HDFC',
                'type' => 'otp',
                'pattern' => 'never share your otp with anyone. your otp for hdfc bank transaction is XXXXXX.'
            ],
            [
                'bank' => 'Govt',
                'type' => 'pan',
                'pattern' => 'income tax dept never asks for your pin or passwords or detailed personal information by email. link your pan to uidai by visiting incometax.gov.in.'
            ]
        ];
    }

    public function analyze($message) {
        $lowerMessage = strtolower($message);
        
        $similarityScore = 0;
        $mismatchFlags = [];

        // Simple similarity comparison: Does it mimic a bank but fail formatting?
        // E.g. Mentions 'sbi' or 'hdfc' but doesn't look like their templates.
        
        $mentionsBank = false;
        $matchesTemplate = false;

        $banks = ['sbi', 'state bank', 'hdfc', 'icici', 'axis', 'pnb', 'punjab national', 'bank of baroda', 'reserve bank', 'rbi'];
        foreach ($banks as $bank) {
            if (strpos($lowerMessage, $bank) !== false) {
                $mentionsBank = true;
                
                // Compare with official templates
                foreach ($this->officialTemplates as $template) {
                    if (strtolower($template['bank']) === $bank) {
                        // Compare words (Basic Bag of Words similarity)
                        $templateWords = explode(' ', $template['pattern']);
                        $messageWords = explode(' ', $lowerMessage);
                        
                        $intersect = array_intersect($templateWords, $messageWords);
                        $similarity = count($intersect) / count($templateWords);
                        
                        if ($similarity > 0.4) {
                            $matchesTemplate = true;
                            $similarityScore = $similarity * 100; // E.g., 60% match
                        }
                    }
                }
            }
        }

        if ($mentionsBank && !$matchesTemplate) {
            $mismatchFlags[] = "Mentions banking institution but format is unofficial.";
            $similarityScore = 10; // Low similarity == High risk of spoofing
        } else if (!$mentionsBank) {
            // Irrelevant to bank templates, just generic text
            $similarityScore = 50; 
            $mismatchFlags[] = "No official source verifiable.";
        }

        return [
            'similarity_score' => min(100, max(0, $similarityScore)),
            'mismatch_flags' => $mismatchFlags
        ];
    }
}
