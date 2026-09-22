import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Send,
  MessageSquare,
  Calendar,
  Euro,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  Sparkles
} from 'lucide-react';
import initialLeadsData from '../../data/leads.json';

export default function CrmDashboard() {
  const [data, setData] = useState(initialLeadsData);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const leads = data.leads || [];
  const stats = data.stats || {
    total_contacted: 0,
    replies_received: 0,
    meetings_booked: 0,
    total_pipeline_value: 0
  };

  const filteredLeads = leads.filter(l => {
    const matchesFilter = filter === 'ALL' || l.status === filter;
    const matchesSearch = l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPipeline = leads.reduce((acc, l) => acc + (l.pipeline_value || 2500), 0);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Hermes Autonomous Control Room
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Zyxen Pipeline & Lead CRM
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time outreach tracking, response monitoring, and automated lead management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" /> Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Contacted</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total_contacted}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Active Outreach Engine
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Replies Received</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.replies_received}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {stats.total_contacted > 0 ? `${((stats.replies_received / stats.total_contacted) * 100).toFixed(1)}% Conversion` : '0% Response Rate'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-amber-500/30 transition"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Meetings Booked</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.meetings_booked}</div>
          <div className="text-xs text-amber-400/80 flex items-center gap-1">
            High-Ticket Consultations
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">Pipeline Value</span>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
              <Euro className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalPipeline.toLocaleString('el-GR')} €</div>
          <div className="text-xs text-blue-300/80 flex items-center gap-1">
            Target Retainers & High-Ticket Deals
          </div>
        </motion.div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'ADDED', 'SENT', 'REPLIED', 'MEETING_BOOKED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Company & Contact</th>
                <th className="py-4 px-6">Industry</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Est. Value</th>
                <th className="py-4 px-6">Last Activity</th>
                <th className="py-4 px-6 text-right">Audit Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No leads found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white group-hover:text-blue-400 transition">
                        {lead.company}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lead.name} · <span className="text-gray-500">{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                        {lead.industry}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'REPLIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : lead.status === 'SENT'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : lead.status === 'MEETING_BOOKED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {lead.status === 'REPLIED' && <CheckCircle2 className="w-3 h-3" />}
                        {lead.status === 'SENT' && <Send className="w-3 h-3" />}
                        {lead.status === 'ADDED' && <Clock className="w-3 h-3" />}
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      {(lead.pipeline_value || 2500).toLocaleString('el-GR')} €
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400">
                      {lead.sent_at ? new Date(lead.sent_at).toLocaleDateString('el-GR') : 'Not sent yet'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={`/el/audit?ref=${lead.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Audit Tool <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
