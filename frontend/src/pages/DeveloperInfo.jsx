import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  User, 
  Mail, 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';

const DeveloperInfo = () => {
  const navigate = useNavigate();

  const developer = {
    name: "Ayush Vishwakarma",
    role: "Full Stack AI Developer",
    bio: "Passionate about building secure, AI-driven solutions that bridge the gap between complex technology and everyday user needs. Creator of Bhasha-Verify.",
    email: "ayushvishwakarmadto29@gmail.com",
    github: "https://github.com/AyushVishwakarma-CodeHub", // Adjusted based on repository name
    linkedin: "https://www.linkedin.com/in/ayushraj2908",
    skills: ["React.js", "PHP", "Aiven MySQL", "Google Gemini AI", "Tailwind CSS", "Framer Motion"]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-dark text-white p-6 md:p-12 relative overflow-hidden flex flex-col items-center">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="w-full max-w-4xl mb-12 relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-neon-green transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>

      <motion.div 
        className="w-full max-w-4xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="glass-panel p-8 text-center flex flex-col items-center h-full border border-white/10 rounded-3xl">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-neon-green to-blue-500 p-1 mb-6 relative group">
                <div className="w-full h-full rounded-[1.4rem] bg-dark overflow-hidden">
                  <img src="/developer-photo.jpg" alt="Ayush Vishwakarma" className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-neon-green text-dark p-2 rounded-xl shadow-lg">
                  <ShieldCheck size={20} />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-1">{developer.name}</h1>
              <p className="text-neon-green font-medium text-sm mb-6 uppercase tracking-widest">{developer.role}</p>
              
              <div className="flex flex-col gap-3 w-full">
                <a 
                  href={developer.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#0077B5]/20 hover:border-[#0077B5] transition-all group"
                >
                  <User size={20} className="group-hover:text-[#0077B5]" />
                  <span>LinkedIn</span>
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href={developer.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/50 transition-all group"
                >
                  <Code2 size={20} />
                  <span>GitHub</span>
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a 
                  href={`mailto:${developer.email}`}
                  className="flex items-center justify-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500 transition-all group"
                >
                  <Mail size={20} className="group-hover:text-red-500" />
                  <span>Email</span>
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Experience */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Bio Card */}
            <motion.div variants={itemVariants} className="glass-panel p-8 border border-white/10 rounded-3xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="text-blue-400" size={24} /> About Me
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg italic">
                "{developer.bio}"
              </p>
            </motion.div>

            {/* Skills Card */}
            <motion.div variants={itemVariants} className="glass-panel p-8 border border-white/10 rounded-3xl flex-1">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Code2 className="text-neon-green" size={24} /> Core Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {developer.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:border-neon-green transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-12 p-6 rounded-2xl bg-neon-green/5 border border-neon-green/20">
                <h4 className="text-neon-green font-bold text-sm uppercase tracking-widest mb-2">Project Vision</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Bhasha-Verify was created to solve the growing threat of regional language scams in India. 
                  By leveraging state-of-the-art LLMs, we provide a localized security layer that global tools miss.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer Signature */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-center text-gray-600 text-sm font-medium tracking-widest uppercase"
      >
        Built with ❤️ for a safer Digital India
      </motion.div>
    </div>
  );
};

export default DeveloperInfo;
