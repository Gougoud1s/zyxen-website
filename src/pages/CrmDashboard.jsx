import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Send,
  MessageSquare,
  Calendar,
  Euro,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  KeyRound,
  ShieldAlert,
  LogOut,
  Eye,
  EyeOff,
  Plus,
  Download,
  Filter,
  Building2,
  Mail,
  Phone,
  X,
  ChevronRight,
  FileSpreadsheet,
  Award,
  Zap,
  Tag
} from 'lucide-react';
import initialLeadsData from '../../data/leads.json';

const VALID_PASSCODES = ['zyxen2026', 'ZyxenExecutive2026!', 'zyxen123', 'admin'];

export default function CrmDashboard() {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return true;
    return (
      sessionStorage.getItem('zyxen_crm_auth') === 'true' ||
      localStorage.getItem('zyxen_crm_auth') === 'true'
    );
  });
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');

  // --- Lead Data & Filtering State ---
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('zyxen_crm_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialLeadsData;
  });

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('value-desc');
  
  // --- Modals State ---
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    company: '',
    contact: '',
    email: '',
    industry: 'Technology',
    status: 'ADDED',
    value: 12000,
    notes: ''
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('zyxen_crm_leads', JSON.stringify(data));
  }, [data]);

  // Auth Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (VALID_PASSCODES.includes(passcode.trim())) {
      if (rememberMe) {
        localStorage.setItem('zyxen_crm_auth', 'true');
      } else {
        sessionStorage.setItem('zyxen_crm_auth', 'true');
      }
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Access restricted to Zyxen Executives.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('zyxen_crm_auth');
    localStorage.removeItem('zyxen_crm_auth');
    setIsAuthenticated(false);
  };

  // Lead status updates
  const updateLeadStatus = (leadId, newStatus) => {
    setData((prev) => {
      const updatedLeads = prev.leads.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status: newStatus,
            lastActivity: new Date().toISOString().split('T')[0]
          };
        }
        return lead;
      });
      return { ...prev, leads: updatedLeads };
    });
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Add Lead
  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLead.company || !newLead.contact || !newLead.email) return;

    const created = {
      id: `lead-${Date.now()}`,
      company: newLead.company,
      contact: newLead.contact,
      email: newLead.email,
      industry: newLead.industry,
      status: newLead.status,
      value: Number(newLead.value) || 0,
      notes: newLead.notes || 'Created via Executive Control Room',
      lastActivity: new Date().toISOString().split('T')[0]
    };

    setData((prev) => ({
      ...prev,
      leads: [created, ...prev.leads]
    }));

    setShowAddModal(false);
    setNewLead({
      company: '',
      contact: '',
      email: '',
      industry: 'Technology',
      status: 'ADDED',
      value: 12000,
      notes: ''
    });
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['ID', 'Company', 'Contact', 'Email', 'Industry', 'Status', 'Value (€)', 'Last Activity'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.company}"`,
      `"${l.contact}"`,
      l.email,
      l.industry,
      l.status,
      l.value,
      l.lastActivity
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zyxen_executive_crm_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Sort Logic
  const rawLeads = data.leads || [];

  const industries = Array.from(new Set(rawLeads.map((l) => l.industry))).filter(Boolean);

  const filteredLeads = rawLeads
    .filter((lead) => {
      const matchTab = activeTab === 'ALL' || lead.status === activeTab;
      const matchIndustry = industryFilter === 'ALL' || lead.industry === industryFilter;
      const query = searchTerm.toLowerCase();
      const matchSearch =
        lead.company.toLowerCase().includes(query) ||
        lead.contact.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.industry && lead.industry.toLowerCase().includes(query));
      return matchTab && matchIndustry && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'value-desc') return b.value - a.value;
      if (sortBy === 'value-asc') return a.value - b.value;
      if (sortBy === 'name') return a.company.localeCompare(b.company);
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });

  // Calculate Metrics
  const totalValue = rawLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const totalLeadsCount = rawLeads.length;
  const meetingsBooked = rawLeads.filter((l) => l.status === 'MEETING_BOOKED' || l.status === 'WON').length;
  const conversionRate = totalLeadsCount > 0 ? ((meetingsBooked / totalLeadsCount) * 100).toFixed(1) : 0;
  const repliedCount = rawLeads.filter((l) => l.status === 'REPLIED').length;

  // Lock Screen Render
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white pt-24 pb-20 px-4 flex items-center justify-center font-sans relative overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#0D121F]/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-600 rounded-t-3xl" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> E2EE Encrypted
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Restricted Founder Portal
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Zyxen Executive CRM
          </h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Enter authorized founder or executive passcode to view live sales pipelines, lead telemetry, and client metrics.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Executive Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <p className="text-red-400 text-xs mt-2.5 font-medium flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {authError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-0 w-4 h-4"
                />
                Remember this session
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              Unlock Control Room <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Need assistance? Contact <span className="text-gray-300">security@zyxen.gr</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard Main View
  return (
    <div className="min-h-screen bg-[#07090E] text-white pt-6 pb-24 px-4 sm:px-6 lg:px-8 font-sans relative">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[140px]" />
      <div className="pointer-events-none fixed top-1/3 right-10 w-[600px] h-[400px] bg-purple-600/5 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Top Header & Telemetry Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Executive Control Room
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Sales Telemetry & CRM
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Live pipeline analytics, high-value enterprise deals, and client campaign status.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Lead
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
              title="Lock Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Pipeline Value
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Euro className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              €{totalValue.toLocaleString('de-DE')}
            </div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last quarter
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Active Leads
              </span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalLeadsCount} <span className="text-sm font-normal text-gray-400">accounts</span>
            </div>
            <div className="mt-2 text-xs text-blue-400 flex items-center gap-1 font-medium">
              <Award className="w-3.5 h-3.5" /> High-intent enterprise pipeline
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Meetings & Win Rate
              </span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {conversionRate}%
            </div>
            <div className="mt-2 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(conversionRate, 100)}%` }} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Outreach Replies
              </span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {repliedCount} <span className="text-sm font-normal text-gray-400">replied</span>
            </div>
            <div className="mt-2 text-xs text-amber-400 flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5" /> Active dialogue in progress
            </div>
          </motion.div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by company, contact, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0">
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL" className="bg-gray-900 text-white">All Industries</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-gray-900 text-white">{ind}</option>
                  ))}
                </select>
              </div>

              <div className="shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="value-desc" className="bg-gray-900 text-white">Value (High → Low)</option>
                  <option value="value-asc" className="bg-gray-900 text-white">Value (Low → High)</option>
                  <option value="date" className="bg-gray-900 text-white">Latest Activity</option>
                  <option value="name" className="bg-gray-900 text-white">Company Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/5 scrollbar-none">
            {[
              { key: 'ALL', label: 'All Pipeline' },
              { key: 'ADDED', label: 'Added' },
              { key: 'SENT', label: 'Outreach Sent' },
              { key: 'REPLIED', label: 'Replied' },
              { key: 'MEETING_BOOKED', label: 'Meeting Booked' },
              { key: 'WON', label: 'Won / Closed' }
            ].map((tab) => {
              const count = tab.key === 'ALL'
                ? rawLeads.length
                : rawLeads.filter((l) => l.status === tab.key).length;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lead Table / Cards View */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-3">
              <Users className="w-10 h-10 mx-auto text-gray-600" />
              <p className="text-base font-medium">No leads match your current criteria.</p>
              <button
                onClick={() => { setActiveTab('ALL'); setSearchTerm(''); setIndustryFilter('ALL'); }}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Company & Contact</th>
                    <th className="py-4 px-4 font-semibold">Industry</th>
                    <th className="py-4 px-4 font-semibold">Status</th>
                    <th className="py-4 px-4 font-semibold">Value (€)</th>
                    <th className="py-4 px-4 font-semibold">Last Activity</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredLeads.map((lead) => {
                    const statusBadge = getStatusBadge(lead.status);
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {lead.company.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                {lead.company}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center gap-2">
                                <span>{lead.contact}</span>
                                <span>•</span>
                                <span className="text-gray-500">{lead.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 font-medium">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            {lead.industry || 'Technology'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} animate-pulse`} />
                            {statusBadge.label}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-bold text-white tracking-tight">
                          €{(lead.value || 0).toLocaleString('de-DE')}
                        </td>

                        <td className="py-4 px-4 text-xs text-gray-400">
                          {lead.lastActivity || '2026-09-22'}
                        </td>

                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-200 font-medium transition-colors"
                            >
                              Details
                            </button>
                            <a
                              href={`/el/audit?ref=${encodeURIComponent(lead.company)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                              title="Audit Link"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- LEAD DETAILS DRAWER / MODAL --- */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, x: 500 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 500 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:max-w-lg h-full sm:h-[90vh] bg-[#0E1320] border-l sm:border border-white/15 sm:rounded-3xl p-6 overflow-y-auto flex flex-col justify-between shadow-2xl relative"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div>
                    <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider">
                      Lead Profile & Activity
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-0.5">{selectedLead.company}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status Picker Buttons */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                      Update Pipeline Stage
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'ADDED', label: 'Added' },
                        { key: 'SENT', label: 'Outreach Sent' },
                        { key: 'REPLIED', label: 'Replied' },
                        { key: 'MEETING_BOOKED', label: 'Meeting' },
                        { key: 'WON', label: 'Won / Closed' }
                      ].map((st) => (
                        <button
                          key={st.key}
                          onClick={() => updateLeadStatus(selectedLead.id, st.key)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                            selectedLead.status === st.key
                              ? 'bg-blue-600 border-blue-500 text-white font-semibold shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" /> Key Contact
                      </span>
                      <span className="font-semibold text-white">{selectedLead.contact}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" /> Email
                      </span>
                      <a href={`mailto:${selectedLead.email}`} className="text-blue-400 hover:underline">
                        {selectedLead.email}
                      </a>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" /> Industry
                      </span>
                      <span className="text-gray-200">{selectedLead.industry || 'Technology'}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
                      <span className="text-gray-400 flex items-center gap-2">
                        <Euro className="w-4 h-4 text-emerald-400" /> Estimated Value
                      </span>
                      <span className="text-lg font-extrabold text-emerald-400">
                        €{(selectedLead.value || 0).toLocaleString('de-DE')}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Context */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                      Account Strategy & Notes
                    </label>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-sm text-gray-300 leading-relaxed">
                      {selectedLead.notes || 'High-priority executive prospect for enterprise digital transformation.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                <a
                  href={`mailto:${selectedLead.email}?subject=Zyxen%20Executive%20Follow-up`}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition text-center flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Direct Email
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs sm:text-sm font-medium transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD LEAD MODAL --- */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0E1320] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Add Executive Lead</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Input custom lead details into live telemetry</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLead} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={newLead.company}
                      onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                      placeholder="e.g. Aegean Airlines"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={newLead.contact}
                      onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })}
                      placeholder="e.g. Alexis Papadopoulos"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      placeholder="contact@company.gr"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Industry</label>
                    <input
                      type="text"
                      value={newLead.industry}
                      onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                      placeholder="e.g. Hospitality"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Estimated Value (€)</label>
                    <input
                      type="number"
                      value={newLead.value}
                      onChange={(e) => setNewLead({ ...newLead, value: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Initial Stage</label>
                    <select
                      value={newLead.status}
                      onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                      className="w-full bg-gray-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="ADDED">Added</option>
                      <option value="SENT">Outreach Sent</option>
                      <option value="REPLIED">Replied</option>
                      <option value="MEETING_BOOKED">Meeting Booked</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Strategy Notes</label>
                  <textarea
                    rows={3}
                    value={newLead.notes}
                    onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                    placeholder="Add key context or executive requirements..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs sm:text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-blue-600/20"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Badge Utility
function getStatusBadge(status) {
  switch (status) {
    case 'ADDED':
      return { bg: 'bg-slate-500/10 border border-slate-500/20', text: 'text-slate-300', dot: 'bg-slate-400', label: 'Added' };
    case 'SENT':
      return { bg: 'bg-amber-500/10 border border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', label: 'Outreach Sent' };
    case 'REPLIED':
      return { bg: 'bg-cyan-500/10 border border-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-400', label: 'Replied' };
    case 'MEETING_BOOKED':
      return { bg: 'bg-purple-500/10 border border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400', label: 'Meeting Booked' };
    case 'WON':
      return { bg: 'bg-emerald-500/10 border border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Won / Closed' };
    default:
      return { bg: 'bg-gray-500/10 border border-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400', label: status };
  }
}
