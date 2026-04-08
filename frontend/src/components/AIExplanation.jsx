import React from 'react';
import { Bot, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function AIExplanation({ aiInsights }) {
  if (!aiInsights) return null;

  const isScam = aiInsights.intent === 'scam';
  const isSafe = aiInsights.intent === 'safe';
  const isGemini = aiInsights.source === 'gemini' || aiInsights.source === 'openai';

  return (
    <div className={`glass-panel p-6 border-l-4 flex flex-col gap-4 ${
      isScam ? 'border-l-neon-red' : 
      isSafe ? 'border-l-neon-green' : 'border-l-neon-yellow'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className={isScam ? "text-neon-red" : isSafe ? "text-neon-green" : "text-neon-yellow"} size={28} />
          <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
        </div>
        
        {/* Source badge */}
        <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-400 uppercase tracking-wider">
          {isGemini ? (aiInsights.source === 'gemini' ? '🤖 Gemini' : '🤖 OpenAI') : '⚡ Heuristic'}
        </span>
      </div>
      
      {/* Explanation text */}
      <div className={`text-lg leading-relaxed bg-black/30 p-4 rounded-xl ${
        isScam ? 'text-neon-red/90' : 'text-gray-300'
      }`}>
        <span className="italic">"{aiInsights.explanation || "No clear explanation could be generated."}"</span>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-3 mt-1">
        {/* Intent */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase ${
          isScam ? 'bg-neon-red/15 text-neon-red' : 
          isSafe ? 'bg-neon-green/15 text-neon-green' : 'bg-white/10 text-gray-400'
        }`}>
          {isScam ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
          {aiInsights.intent || 'unknown'}
        </div>

        {/* Urgency */}
        {aiInsights.urgency && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase ${
            aiInsights.urgency === 'high' ? 'bg-neon-red/15 text-neon-red' : 
            aiInsights.urgency === 'medium' ? 'bg-neon-yellow/15 text-neon-yellow' : 
            'bg-neon-green/15 text-neon-green'
          }`}>
            <Zap size={14} />
            Urgency: {aiInsights.urgency}
          </div>
        )}
        
        {/* Sensitive request */}
        {aiInsights.sensitive_request && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-neon-red/15 text-neon-red">
            <AlertTriangle size={14} />
            Asks for Sensitive Info
          </div>
        )}
      </div>
    </div>
  );
}
