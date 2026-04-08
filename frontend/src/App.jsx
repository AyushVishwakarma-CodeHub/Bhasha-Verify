import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-dark">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-green/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-red/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/result" element={<Result />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
