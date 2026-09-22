import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TermsOfUse from './pages/TermsOfUse';
import NotFound from './pages/NotFound';
import Technologies from './pages/Technologies';
import AuditTool from './pages/AuditTool';
import CrmDashboard from './pages/CrmDashboard';
import { ScrollProgressBar } from './components/Interactive2DCanvas';
import IntroAnimation from './components/IntroAnimation';

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('zyxen_intro_shown');
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('zyxen_intro_shown', 'true');
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClientInstance}>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <Router>
        <ScrollProgressBar />
        <Routes>
          <Route element={<Layout />}>
            {/* Root routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/audit" element={<AuditTool />} />
            <Route path="/crm" element={<CrmDashboard />} />
            <Route path="/admin/crm" element={<CrmDashboard />} />

            {/* Localized Greek routes (/el/*) */}
            <Route path="/el" element={<Home />} />
            <Route path="/el/about" element={<About />} />
            <Route path="/el/services" element={<Services />} />
            <Route path="/el/services/:slug" element={<ServiceDetail />} />
            <Route path="/el/projects" element={<Projects />} />
            <Route path="/el/projects/:slug" element={<ProjectDetail />} />
            <Route path="/el/contact" element={<Contact />} />
            <Route path="/el/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/el/cookie-policy" element={<CookiePolicy />} />
            <Route path="/el/terms" element={<TermsOfUse />} />
            <Route path="/el/technologies" element={<Technologies />} />
            <Route path="/el/audit" element={<AuditTool />} />
            <Route path="/el/crm" element={<CrmDashboard />} />
            <Route path="/el/admin/crm" element={<CrmDashboard />} />

            {/* Localized English routes (/en/*) */}
            <Route path="/en" element={<Home />} />
            <Route path="/en/about" element={<About />} />
            <Route path="/en/services" element={<Services />} />
            <Route path="/en/services/:slug" element={<ServiceDetail />} />
            <Route path="/en/projects" element={<Projects />} />
            <Route path="/en/projects/:slug" element={<ProjectDetail />} />
            <Route path="/en/contact" element={<Contact />} />
            <Route path="/en/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/en/cookie-policy" element={<CookiePolicy />} />
            <Route path="/en/terms" element={<TermsOfUse />} />
            <Route path="/en/technologies" element={<Technologies />} />
            <Route path="/en/audit" element={<AuditTool />} />
            <Route path="/en/en/audit" element={<AuditTool />} />
            <Route path="/en/crm" element={<CrmDashboard />} />
            <Route path="/en/admin/crm" element={<CrmDashboard />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;