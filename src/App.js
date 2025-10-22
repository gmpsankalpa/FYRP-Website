import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Analytics } from "@vercel/analytics/react"
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';

import Footer from './components/Footer';
import Navigation from './components/Navigation';
import SocialMedia from './components/SocialMedia';
import Home from './pages/Home';
import Download from './pages/Download';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Configure from './pages/Configure';
import Profile from './pages/Profile';
import SourceCode from './pages/SourceCode';
import ChangeLog from './pages/ChangeLog';
import AiModel from './pages/AiModel';
import FAQ from './pages/FAQ';
import Status from './pages/ServerStatus';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Error404 from './pages/Error404';

function App() {
  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <AuthProvider>
        <Router>
        <Analytics />
        <Navigation />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/download" element={<Download />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/source" element={<SourceCode />} />
            <Route path="/change-log" element={<ChangeLog />} />
            <Route path="/ai-model" element={<AiModel />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/status" element={<Status />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Protected Routes - Requires Login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configure"
              element={
                <ProtectedRoute>
                  <Configure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* 404 Catch-All Route (MUST BE LAST) */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
        <SocialMedia />
        <Footer />
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
