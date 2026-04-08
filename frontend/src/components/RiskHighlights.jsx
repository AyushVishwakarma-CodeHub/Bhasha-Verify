import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function RiskHighlights({ message, heuristics }) {
  if (!heuristics || Object.keys(heuristics).length === 0) {
    return (
      <div className="glass-panel p-6 border-l-4 border-l-neon-green flex items-center gap-3 text-white">
        <AlertCircle className="text-neon-green" />
        No explicit risk keywords or patterns identified.
      </div>
    );
  }

  let highlightedMessage = message || '';
  if (typeof highlightedMessage !== 'string') {
    highlightedMessage = String(highlightedMessage);
  }
  
  const escapeRegExp = (string) => {
    if (!string || typeof string !== 'string') return '';
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
  };

  const wrapText = (arr, colorHex) => {
      if (!arr || !Array.isArray(arr)) return;
      arr.forEach(word => {
         if(!word || typeof word !== 'string' || word.length < 3) return; 
         try {
           const reg = new RegExp(`(${escapeRegExp(word)})`, 'gi');
           const style = `background-color: ${colorHex}4D; color: ${colorHex}; font-weight: bold; padding: 0 4px; border-radius: 4px; text-shadow: 0 0 5px ${colorHex}80;`;
           highlightedMessage = highlightedMessage.replace(reg, `<span style="${style}">$1</span>`);
         } catch (e) {
           console.error("Regex highlight error:", e);
         }
      });
  };

  wrapText(heuristics.suspicious_links, '#FF4D4D');
  wrapText(heuristics.otp_requests, '#FF4D4D');
  wrapText(heuristics.urgency, '#FFC857');
  wrapText(heuristics.sensitive_actions, '#FFC857');

  return (
    <div className="glass-panel p-6 border-l-4 border-l-neon-red flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="text-neon-red" size={24} />
        <h3 className="text-xl font-semibold text-white">Highlighted Risks</h3>
      </div>
      
      <div 
        className="text-gray-300 text-lg leading-relaxed bg-black/40 p-4 rounded-xl whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: highlightedMessage }} 
      />

      <div className="flex gap-4 mt-2 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF4D4D]"></span> Critical Risk
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FFC857]"></span> Suspicious
        </div>
      </div>
    </div>
  );
}
