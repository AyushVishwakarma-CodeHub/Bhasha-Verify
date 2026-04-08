<?php

class ScanController {
    private $heuristicService;
    private $aiService;
    private $ragService;
    private $messageModel;

    public function __construct() {
        $this->heuristicService = new HeuristicService();
        $this->aiService = new AIService();
        $this->ragService = new RAGService();
        $this->messageModel = new MessageModel();
    }

    public function scanMessage($message, $source = 'text', $userId = null) {
        // 1. Heuristic Engine (30% weight)
        $heuristicResult = $this->heuristicService->analyze($message);
        
        // 2. AI Semantic Engine (40% weight)
        $aiResult = $this->aiService->analyze($message);
        
        // 3. RAG Verification (30% weight)
        $ragResult = $this->ragService->analyze($message);

        // Calculate final trust score
        $heuristicWeight = 0.35;
        $aiWeight = 0.40;
        $ragWeight = 0.25;

        // DYNAMIC REBALANCING: If AI is in fallback/error mode, give more power to Heuristics/RAG
        $isAIFallback = (isset($aiResult['source']) && $aiResult['source'] === 'fallback');
        if ($isAIFallback) {
            $heuristicWeight = 0.60; // Heuristics are now primary
            $aiWeight = 0.10;        // AI (fallback) has low weight
            $ragWeight = 0.30;       // RAG keeps steady authority
        }

        $heuristicScore = $heuristicResult['score']; // High = risky
        
        // AI Score: High = risky
        $aiScore = 0;
        if (isset($aiResult['intent']) && $aiResult['intent'] === 'scam') {
            $aiScore += 60;
            if (isset($aiResult['urgency']) && $aiResult['urgency'] === 'high') $aiScore += 20;
            if (isset($aiResult['urgency']) && $aiResult['urgency'] === 'medium') $aiScore += 10;
            if (!empty($aiResult['sensitive_request'])) $aiScore += 20;
        } else if (isset($aiResult['intent']) && $aiResult['intent'] === 'safe') {
            $aiScore = 0;
        } else {
            $aiScore = 0;
        }

        // RAG Score: High similarity to official = safe, Low = risky
        $ragSimilarity = $ragResult['similarity_score'];
        $ragMentionsBank = !empty($ragResult['mismatch_flags']) && 
            in_array("Mentions banking institution but format is unofficial.", $ragResult['mismatch_flags']);
        
        if ($ragMentionsBank) {
            $ragScore = 90;
        } else if ($ragSimilarity >= 40) {
            $ragScore = max(0, 100 - $ragSimilarity);
        } else {
            $ragScore = 5;
        }

        $finalProbability = ($heuristicScore * $heuristicWeight) + 
                            ($aiScore * $aiWeight) + 
                            ($ragScore * $ragWeight);

        $finalProbability = min(100, max(0, round($finalProbability, 1)));

        // Determine Risk Level
        if ($finalProbability >= 70) {
            $riskLevel = 'Scam';
        } else if ($finalProbability >= 40) {
            $riskLevel = 'Suspicious';
        } else {
            $riskLevel = 'Safe';
        }

        $result = [
            'original_message' => $message,
            'trust_score' => [
                'probability' => $finalProbability,
                'risk_level' => $riskLevel
            ],
            'heuristic_analysis' => $heuristicResult,
            'ai_insights' => $aiResult,
            'rag_verification' => $ragResult,
            'explanations' => $this->generateTopExplanations($heuristicResult, $aiResult, $ragResult)
        ];

        // 4. Log to Database
        $this->messageModel->logScan($message, $result['trust_score'], $heuristicResult, $aiResult, $ragResult, $source, $userId);

        return $result;
    }

    private function generateTopExplanations($heu, $ai, $rag) {
        $explanations = [];

        // Heuristic explanations only (AI shows in its own card)
        if (!empty($heu['matches']['urgency'])) {
            $words = implode(', ', $heu['matches']['urgency']);
            $explanations[] = "Urgency language detected: $words.";
        }

        if (!empty($heu['matches']['suspicious_links'])) {
            $explanations[] = "A potentially dangerous link was detected — do NOT click.";
        }
        
        if (!empty($heu['matches']['otp_requests'])) {
            $explanations[] = "The sender is asking for sensitive codes or passwords.";
        }

        if (!empty($heu['matches']['sensitive_actions'])) {
            $words = implode(', ', $heu['matches']['sensitive_actions']);
            $explanations[] = "Suspicious actions requested: $words.";
        }

        if (!empty($rag['mismatch_flags'])) {
            foreach ($rag['mismatch_flags'] as $flag) {
                // Only include meaningful flags, skip generic ones for safe messages
                if ($flag !== "No official source verifiable.") {
                    $explanations[] = $flag;
                }
            }
        }

        // If nothing suspicious was found, say so
        if (empty($explanations)) {
            $explanations[] = "No suspicious patterns were detected.";
        }

        return array_slice($explanations, 0, 4);
    }
}
