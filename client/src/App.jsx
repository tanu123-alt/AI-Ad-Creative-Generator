import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Studio from "./pages/Studio";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Navbar from "./components/layout/Navbar";
import FeedbackModal from "./components/ui/FeedbackModal";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import "./styles/globals.css";
import "./styles/responsive.css";

function AppRoutes() {
  const location = useLocation();
  const [showFeedback, setShowFeedback] = useState(false);
  const hideNavbar = location.pathname === "/" || location.pathname === "/auth";

  return (
    <>
      {!hideNavbar && <Navbar onFeedback={() => setShowFeedback(true)} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}