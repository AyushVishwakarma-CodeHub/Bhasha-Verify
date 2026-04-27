import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrustScoreGauge from '../components/TrustScoreGauge';
import RiskHighlights from '../components/RiskHighlights';
import AIExplanation from '../components/AIExplanation';
import UrlPreview from '../components/UrlPreview';
import { ArrowLeft, Mic, FileAudio } from 'lucide-react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('/scanner')} className="text-neon-green underline">Go Back</button>
      </div>
    );
  }

  const probability = data.trust_score?.probability || 0;
  const risk_level = data.trust_score?.risk_level || 'Unknown';

  return (
    <div className="min-h-screen p-6 md:p-12 relative">
      <button 
        onClick={() => navigate('/scanner')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={20} /> New Scan
      </button>

      <div className="max-w-6xl mx-auto">

        {/* Audio Source Badge + Transcription Preview */}
        {data.source === 'audio' && data.transcription && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-5 mb-8 border-l-4 border-l-neon-yellow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-neon-yellow/10 rounded-full">
                <FileAudio size={20} className="text-neon-yellow" />
              </div>
              <div>
                <span className="text-white font-semibold">Source: Audio Recording</span>
                <span className="text-gray-500 text-sm ml-3">Transcribed via AI</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-4 text-gray-300 text-base leading-relaxed italic">
              "{data.transcription}"
            </div>
          </motion.div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Gauge and Explanation */}
        <div className="col-span-1 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 flex flex-col items-center text-center h-full"
          >
            <TrustScoreGauge probability={probability} riskLevel={risk_level} />
          </motion.div>

          {data.explanations && data.explanations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-white border-b border-gray-800 pb-2">Why?</h3>
              <ul className="space-y-3">
                {data.explanations.map((exp, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-300">
                    <span className="text-neon-red mt-1">⚠️</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Right Column: AI Insight & Highlighted Message */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AIExplanation aiInsights={data?.ai_insights} />
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
          >
            <RiskHighlights 
              message={data?.original_message}
              heuristics={data?.heuristic_analysis?.matches || {}}
            />
            <UrlPreview message={data?.original_message} />
          </motion.div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="glass-panel p-6 border-l-4 border-l-neon-green"
          >
            <h3 className="font-semibold text-white mb-2">Suggested Action:</h3>
            <p className="text-gray-400">
              {risk_level === 'Scam' ? "Do not click any links. Block the sender immediately." : 
               risk_level === 'Suspicious' ? "Verify directly with the official source. Do not rely on info in this message." : 
               "This message seems safe, but always remain vigilant."}
            </p>
          </motion.div>
        </div>

      </div>
      </div>
    </div>
  );
}
