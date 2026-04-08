import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, BrainCircuit } from 'lucide-react';

const steps = [
  { id: 1, icon: FileSearch, text: "Checking heuristics & keywords..." },
  { id: 2, icon: BrainCircuit, text: "Understanding semantic intent..." },
  { id: 3, icon: FileSearch, text: "Verifying with official sources..." } // Using available icons
];

export default function LoadingAnalyzer() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 800);
    const timer2 = setTimeout(() => setCurrentStep(2), 1600);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="glass-panel p-10 flex flex-col items-center text-center">
        <div className="relative w-24 h-24 mb-6">
          <motion.div 
            className="absolute inset-0 border-t-4 border-neon-green rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
             {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon size={32} className="text-neon-green" />
             })()}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-medium text-white"
          >
            {steps[currentStep].text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
