import React, { useState, useEffect } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UrlPreview({ message }) {
  const [extractedUrl, setExtractedUrl] = useState(null);

  useEffect(() => {
    // Regular expression to extract the first http/https URL from the message
    const urlRegex = /(https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/\S*)?)/i;
    if (message) {
      const match = typeof message === 'string' ? message.match(urlRegex) : null;
      if (match && match[0]) {
        setExtractedUrl(match[0]);
      }
    }
  }, [message]);

  if (!extractedUrl) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel p-6 border-l-4 border-l-neon-yellow mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-neon-yellow" size={24} />
          <h3 className="text-xl font-semibold text-white">Live URL Scanner (Sandbox)</h3>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-neon-yellow uppercase tracking-wider">
          Visual Proof
        </span>
      </div>
      
      <p className="text-gray-400 mb-4 text-sm leading-relaxed">
        We detected a link in this message. We safely captured a screenshot of the website in an isolated sandbox environment so you can see what it looks like without clicking it.
      </p>

      <div className="bg-black/50 rounded-xl p-4 border border-white/5 relative group overflow-hidden">
        <div className="flex items-center gap-2 mb-3 text-neon-yellow break-all text-sm font-mono bg-black/40 p-2 rounded">
          <ExternalLink size={16} />
          {extractedUrl}
        </div>
        
        {/* Render live screenshot safely using thum.io */}
        <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-900 min-h-[200px] flex items-center justify-center relative">
          <img 
            src={`https://mini.s-shot.ru/1024x768/PNG/800/Z100/?${extractedUrl}`} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://s0.wp.com/mshots/v1/${encodeURIComponent(extractedUrl)}?w=800`;
            }}
            alt="Website Preview" 
            className="w-full object-cover opacity-80 hover:opacity-100 transition-opacity"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="bg-black/80 text-white text-xs px-3 py-1 rounded backdrop-blur-sm border border-red-500/50">
              DO NOT VISIT THIS SITE
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
