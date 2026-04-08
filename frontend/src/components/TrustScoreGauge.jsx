import React from 'react';
import { motion } from 'framer-motion';

export default function TrustScoreGauge({ probability, riskLevel }) {
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - probability / 100 * circumference;

  let color = 'text-neon-green';
  let strokeColor = '#00FF9F';
  if (riskLevel === 'Suspicious') {
    color = 'text-neon-yellow';
    strokeColor = '#FFC857';
  } else if (riskLevel === 'Scam') {
    color = 'text-neon-red';
    strokeColor = '#FF4D4D';
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color}`}>{probability}%</span>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-6"
      >
        <h2 className={`text-2xl font-semibold uppercase tracking-widest ${color}`}>
          {riskLevel}
        </h2>
        <p className="text-gray-400 mt-2 text-sm leading-tight text-center">
          {riskLevel === 'Safe' ? "No significant threats found." : 
           riskLevel === 'Suspicious' ? "Proceed with extreme caution." : 
           "High likelihood of fraudulent intent."}
        </p>
      </motion.div>
    </div>
  );
}
