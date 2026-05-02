import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, ExternalLink, Server, Cpu, Zap, Activity, Pause, Wrench, Archive, Search, RotateCcw, Folder, Github, GitBranch, Lightbulb } from 'lucide-react';

const STORAGE_KEY = 'agent-inventory-v11';

const STATUS_CONFIG = {
  live: {
    label: 'Live',
    pillBg: '#DCFCE7', pillText: '#166534', pillBorder: '#BBF7D0', dotColor: '#10B981',
    filterText: '#166534', filterBorder: '#BBF7D0',
    stripeColor: '#10B981',
    icon: Activity,
  },
  development: {
    label: 'In Dev',
    pillBg: '#FEF3C7', pillText: '#92400E', pillBorder: '#FDE68A', dotColor: '#FACC15',
    filterText: '#92400E', filterBorder: '#FDE68A',
    stripeColor: '#FACC15',
    icon: Wrench,
  },
  paused: {
    label: 'Paused',
    pillBg: '#CFFAFE', pillText: '#155E75', pillBorder: '#A5F3FC', dotColor: '#06B6D4',
    filterText: '#155E75', filterBorder: '#A5F3FC',
    stripeColor: '#06B6D4',
    icon: Pause,
  },
  idea: {
    label: 'Idea',
    pillBg: '#FCE7F3', pillText: '#BE185D', pillBorder: '#FBCFE8', dotColor: '#EC4899',
    filterText: '#BE185D', filterBorder: '#FBCFE8',
    stripeColor: '#EC4899',
    icon: Lightbulb,
  },
  archived: {
    label: 'Archived',
    pillBg: '#F5F5F5', pillText: '#6B7280', pillBorder: '#E5E7EB', dotColor: '#9CA3AF',
    filterText: '#6B7280', filterBorder: '#E5E7EB',
    stripeColor: '#9CA3AF',
    icon: Archive,
  },
};

const SEED_AGENTS = [
  { id: '1', name: "ColorTuneLyrics", description: "Real-time neon lyric visualizer that syncs text, timing, and color to music.", status: "live", category: "Creative / Entertainment", techStack: ["Python (FastAPI)", "JavaScript", "Whisper", "yt-dlp", "LRCLIB", "MCP (planned)", "Neon CSS"], apis: ["Groq (Whisper)", "LRCLIB", "YouTube (yt-dlp)", "Pushover", "Railway API"], hosting: "Railway + Vercel + n8n + local", url: "https://www.colortunelyrics.com", repoUrl: "", deployMethod: "", folder: "D:/colortune", notes: "Rebuilding with hybrid LRCLIB → Whisper timing flow." },
  { id: '2', name: "Candace Uncut Pipeline", description: "Auto-curates and clips highlight moments from Candace Owens content for YouTube Shorts.", status: "live", category: "Content Automation", techStack: ["Python"], apis: ["yt-dlp", "Groq Whisper", "LLaMA", "FFmpeg", "Pushover"], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/yt_cu", notes: "File: candace_pipeline.py. Powers the Candace Uncut YouTube channel." },
  { id: '3', name: "StrongAutomation Dashboard", description: "Unified control center for all my automation engines.", status: "development", category: "Infrastructure", techStack: ["Next.js", "Python"], apis: [], hosting: "Vercel + Railway", url: "", repoUrl: "", deployMethod: "", folder: "D:/my-dashboard", notes: "Not working as intended right now. Needs a deeper look." },
  { id: '4', name: "Stock MCP Engine", description: "MCP-driven market engine running paper trades.", status: "development", category: "Finance", techStack: ["Python", "MCP"], apis: ["Alpaca (Paper Trading)"], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/stock-mcp", notes: "Paper trading only — no live capital." },
  { id: '5', name: "Bill Calendar AI", description: "AI-powered running calendar that tracks bills and due dates.", status: "live", category: "Personal Finance", techStack: [], apis: [], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/2025cal_scheduled", notes: "Tracking only — not full automation." },
  { id: '6', name: "Astrology Site", description: "New AI-powered astrology site, currently being built.", status: "development", category: "Creative AI", techStack: [], apis: [], hosting: "TBD", url: "", repoUrl: "", deployMethod: "", folder: "D:/Astrology", notes: "Active build." },
  { id: '7', name: "JSUE", description: "AI tool that searches for the next money-maker / income opportunity.", status: "live", category: "Market Intel", techStack: [], apis: [], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/JSUE", notes: "Working but not public. Opportunity discovery engine." },
  { id: '8', name: "AI Marketing Tool", description: "Creators upload screenshots; tool returns ready-made sales previews.", status: "development", category: "Creator Tools", techStack: [], apis: [], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/AI-Marketing-tool", notes: "Concept stage." },
  { id: '9', name: "Diagnostic Tool", description: "Chrome extension that evaluates company websites and suggests AI-driven improvements.", status: "development", category: "Diagnostics", techStack: ["JavaScript", "Manifest V3", "Claude API"], apis: ["Claude", "Chrome APIs"], hosting: "Local + Chrome extension", url: "", repoUrl: "", deployMethod: "", folder: "D:/diagnostic-tool", notes: "" },
  { id: '10', name: "Insta-scraper", description: "AI scrapes Instagram to source video content for personal site/channel use.", status: "development", category: "Content Automation", techStack: ["Python"], apis: [], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/insta-scaper", notes: "" },
  { id: '11', name: "News Blog Automation", description: "Automated pipeline pulling real news stories and publishing them.", status: "paused", category: "Content Automation", techStack: [], apis: [], hosting: "Local / TBD", url: "", repoUrl: "", deployMethod: "", folder: "D:/NEWS_BLOG", notes: "Automation broken. Lives on a server that needs restart before it'll run again." },
  { id: '12', name: "AI Inventory Dashboard", description: "This dashboard — personal index of every AI project, tool, and site.", status: "live", category: "Infrastructure", techStack: ["React", "Vite", "Tailwind"], apis: [], hosting: "GitHub Pages", url: "https://strongj3369.github.io/AI-inventory/", repoUrl: "https://github.com/strongj3369/AI-inventory", deployMethod: "Auto (GitHub Actions)", folder: "D:/AI_inventory", notes: "What you're looking at right now." },
  { id: '13', name: "JenniferStrong.dev", description: "Personal portfolio site — showcases templates, skills, and work.", status: "live", category: "Website / Portfolio", techStack: ["HTML", "CSS", "JavaScript"], apis: [], hosting: "GitHub Pages", url: "https://jenniferstrong.dev", repoUrl: "https://github.com/strongj3369/jenniferstrong.dev", deployMethod: "Auto (GitHub Actions)", folder: "D:/NEW-IMPROVED-PORT", notes: "Main professional portfolio." },
  { id: '14', name: "ExtendedCode", description: "Lead-gen site for AI automation services — landing page for client acquisition.", status: "live", category: "Website / Services", techStack: ["HTML", "CSS", "JavaScript"], apis: [], hosting: "GitHub Pages", url: "https://extendedcode.com", repoUrl: "https://github.com/strongj3369/extendedcode", deployMethod: "Auto (GitHub Actions)", folder: "TBD", notes: "Custom domain via GitHub Pages. Not actively pushing for clients yet." },
  { id: '15', name: "EchoFlow", description: "Voicemail-to-memo automation with caller intent detection and next-step routing.", status: "idea", category: "Async Ops", techStack: ["Python (FastAPI)", "Whisper", "Claude API", "MCP (planned)", "Pydantic", "Webhooks"], apis: ["Twilio", "Groq (Whisper)", "Claude", "Pushover"], hosting: "TBD", url: "", repoUrl: "", deployMethod: "", folder: "TBD", notes: "Originally a Nucamp course concept. Want to revisit when timing's right — possibly different scope than the course." },
  { id: '16', name: "Strong Labs Practice Platform", description: "Hands-on HTML/CSS learning platform. 8 email templates + 10 landing pages + 5 multi-page sites, all AI-built. Three-tier pricing designed (Starter $0, Refiner $12, Builder $35) but not deployed.", status: "paused", category: "Product / Learning Platform", techStack: ["HTML", "CSS", "JavaScript", "AI-assisted"], apis: [], hosting: "Local only", url: "", repoUrl: "", deployMethod: "", folder: "D:/samsung-1tb/practice-platform", notes: "23 finished templates sitting unused. Potential revenue path: bundle and sell on Gumroad/Etsy. Or use as a portfolio asset to showcase build volume." },
  { id: '17', name: "Nicole AI", description: "Voice AI phone agent for ExtendedCode. Takes inbound calls, gives product info on AI Automation Engineering services, qualifies interest, and books discovery calls via Cal.com when callers want to move forward.", status: "live", category: "Voice AI / Sales", techStack: ["Vapi", "Voice AI"], apis: ["Vapi", "Cal.com"], hosting: "Vapi cloud", url: "", repoUrl: "", deployMethod: "Vapi platform (managed)", folder: "D:/Sales-appointment-setter", notes: "Top-of-funnel agent for ExtendedCode. Handles first call → schedules follow-up with Jenn for closing. Connected to extendedcode.com lead flow." },
  { id: '18', name: "News Digest", description: "Daily AI-curated security/military intel digest pushed to phone via Pushover. Covers war, geopolitical tensions, US threat level, and includes a 'Reality Check' grounding statement to keep things factual.", status: "live", category: "Personal Intelligence", techStack: ["Python (likely)", "Claude API or similar"], apis: ["Pushover", "News sources / RSS"], hosting: "Local or server", url: "", repoUrl: "", deployMethod: "Scheduled / cron", folder: "TBD", notes: "Personal use — built to stay grounded in verified info while my mom consumes prepper content. Daily push to phone." },
];

const emptyAgent = () => ({
  id: '',
  name: '',
  description: '',
  status: 'development',
  category: '',
  techStack: [],
  apis: [],
  hosting: '',
  url: '',
  repoUrl: '',
  deployMethod: '',
  folder: '',
  notes: '',
});

const inputClass = "w-full px-3 py-2 bg-white border-[1.5px] border-[#FFE4EC] rounded-full text-[#6B4456] placeholder-[#B85878]/60 focus:outline-none focus:border-[#FF3D8A] transition-colors";
const textareaClass = "w-full px-3 py-2 bg-white border-[1.5px] border-[#FFE4EC] rounded-2xl text-[#6B4456] placeholder-[#B85878]/60 focus:outline-none focus:border-[#FF3D8A] transition-colors resize-none";

export default function AgentInventory() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAgents(JSON.parse(raw));
      } else {
        setAgents(SEED_AGENTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_AGENTS));
      }
    } catch {
      setAgents(SEED_AGENTS);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_AGENTS)); } catch {}
    }
    setLoading(false);
  }, []);

  const persist = (next) => {
    setAgents(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { console.error(e); }
  };

  const startNew = () => {
    setEditing({ ...emptyAgent(), id: Date.now().toString() });
    setIsNew(true);
  };

  const startEdit = (agent) => {
    setEditing({ ...agent });
    setIsNew(false);
  };

  const saveEdit = () => {
    if (!editing.name.trim()) return;
    const next = isNew
      ? [...agents, editing]
      : agents.map(a => a.id === editing.id ? editing : a);
    persist(next);
    setEditing(null);
    setIsNew(false);
  };

  const deleteAgent = (id) => {
    if (!confirm('Delete this agent?')) return;
    persist(agents.filter(a => a.id !== id));
  };

  const resetAll = () => {
    if (!confirm('Reset to default agent list? Your edits will be lost.')) return;
    persist(SEED_AGENTS);
  };

  const updateField = (field, value) => {
    setEditing(prev => ({ ...prev, [field]: value }));
  };

  const updateListField = (field, value) => {
    setEditing(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  const filtered = agents.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (search && !`${a.name} ${a.description} ${a.category} ${a.techStack.join(' ')} ${a.apis.join(' ')} ${a.repoUrl || ''} ${a.deployMethod || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: agents.length,
    live: agents.filter(a => a.status === 'live').length,
    development: agents.filter(a => a.status === 'development').length,
    paused: agents.filter(a => a.status === 'paused').length,
    idea: agents.filter(a => a.status === 'idea').length,
    archived: agents.filter(a => a.status === 'archived').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAFB] flex items-center justify-center">
        <div className="text-[#B85878] italic">Loading inventory…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAFB] text-[#6B4456]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-[10px] bg-[#FF3D8A] flex items-center justify-center"
                style={{ boxShadow: '0 0 0 3px #FFE4EC' }}
              >
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-glam text-4xl font-bold tracking-tight text-[#C2185B]">Agent Inventory</h1>
            </div>
            <p className="italic text-[#B85878]">What you've built and what's running it. ✨</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FFE4EC] text-[#C2185B] border-[1.5px] border-[#FFB8D1] rounded-full font-medium transition-colors text-sm"
              title="Reset to default agent list"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Agent
            </button>
          </div>
        </div>

        {/* Decorative hairline */}
        <div className="gradient-hairline mb-6" />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {['all', 'live', 'development', 'paused', 'idea', 'archived'].map(key => {
            const isActive = filter === key;
            const isAll = key === 'all';
            const cfg = STATUS_CONFIG[key];
            const label = isAll ? 'Total' : cfg?.label || key;

            const baseStyle = isAll
              ? { background: '#FF3D8A', color: '#FFFFFF', borderColor: 'transparent' }
              : { background: '#FFFFFF', color: cfg.filterText, borderColor: cfg.filterBorder };

            const activeShadow = isActive ? { boxShadow: '0 0 0 3px #FFE4EC' } : {};

            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="text-left p-4 rounded-[12px] border-[1.5px] transition-all"
                style={{ ...baseStyle, ...activeShadow }}
              >
                <div className="text-2xl font-bold">{counts[key]}</div>
                <div
                  className="text-[10.5px] uppercase mt-1 font-medium"
                  style={{ letterSpacing: '0.06em', color: isAll ? 'rgba(255,255,255,0.85)' : cfg.filterText }}
                >
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B85878]" />
          <input
            type="text"
            placeholder="Search by name, tech, API…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border-[1.5px] border-[#FFE4EC] rounded-full text-[#6B4456] placeholder-[#B85878]/60 focus:outline-none focus:border-[#FF3D8A] text-sm transition-colors"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#B85878] italic border-[1.5px] border-dashed border-[#FFB8D1] rounded-[12px] bg-white">
            No agents match. Try clearing filters or adding a new one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(agent => {
              const cfg = STATUS_CONFIG[agent.status] || STATUS_CONFIG.development;
              return (
                <div
                  key={agent.id}
                  className="group relative overflow-hidden bg-white border-[1.5px] border-[#FFE4EC] rounded-[12px] p-5 pt-6 hover:border-[#FFB8D1] hover:shadow-[0_4px_16px_rgba(255,61,138,0.08)] transition-all"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: cfg.stripeColor }}
                  />
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate text-[#C2185B]">{agent.name}</h3>
                      {agent.category && (
                        <div
                          className="text-[10.5px] uppercase mt-0.5 font-medium text-[#B85878]"
                          style={{ letterSpacing: '0.05em' }}
                        >
                          {agent.category}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(agent)}
                        className="p-1.5 text-[#B85878] hover:text-[#C2185B] hover:bg-[#FFE4EC] rounded-full"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="p-1.5 text-[#B85878] hover:text-[#C2185B] hover:bg-[#FFE4EC] rounded-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border-[1px] text-xs font-medium mb-3"
                    style={{ background: cfg.pillBg, color: cfg.pillText, borderColor: cfg.pillBorder }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${agent.status === 'live' ? 'animate-pulse' : ''}`}
                      style={{ background: cfg.dotColor }}
                    />
                    {cfg.label}
                  </div>

                  {agent.description && (
                    <p className="text-sm text-[#6B4456] mb-4 leading-relaxed">{agent.description}</p>
                  )}

                  <div className="space-y-2.5 text-xs">
                    {agent.techStack.length > 0 && (
                      <div>
                        <div
                          className="flex items-center gap-1.5 text-[#B85878] mb-1.5 uppercase font-medium text-[10px]"
                          style={{ letterSpacing: '0.06em' }}
                        >
                          <Cpu className="w-3 h-3" /> Tech
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.techStack.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full font-medium bg-[#DCFCE7] text-[#166534]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {agent.apis.length > 0 && (
                      <div>
                        <div
                          className="flex items-center gap-1.5 text-[#B85878] mb-1.5 uppercase font-medium text-[10px]"
                          style={{ letterSpacing: '0.06em' }}
                        >
                          <Zap className="w-3 h-3" /> APIs / Services
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.apis.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full font-medium bg-[#E0F2FE] text-[#075985]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {agent.hosting && (
                      <div className="flex items-start gap-1.5 text-[#6B4456]">
                        <Server className="w-3 h-3 text-[#B85878] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[#B85878]">Runs on: </span>
                          <span className="text-[#6B4456]">{agent.hosting}</span>
                        </div>
                      </div>
                    )}

                    {agent.url && (
                      <a
                        href={agent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#FF3D8A] hover:text-[#C2185B] mt-1 font-semibold"
                      >
                        <span aria-hidden="true">↗</span>
                        <span className="truncate">{agent.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                      </a>
                    )}

                    {agent.repoUrl && (
                      <a
                        href={agent.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#6B4456] hover:text-[#C2185B]"
                      >
                        <Github className="w-3 h-3 text-[#B85878] flex-shrink-0" />
                        <span className="truncate">{agent.repoUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                      </a>
                    )}

                    {agent.deployMethod && (
                      <div className="flex items-center gap-1.5 text-[#6B4456]">
                        <GitBranch className="w-3 h-3 text-[#B85878] flex-shrink-0" />
                        <span className="text-[#B85878]">Deploys:</span>
                        <span className="text-[#6B4456] truncate">{agent.deployMethod}</span>
                      </div>
                    )}

                    {agent.folder && (
                      <div className="flex items-center gap-1.5 text-[#6B4456]">
                        <Folder className="w-3 h-3 text-[#B85878] flex-shrink-0" />
                        <code className="font-mono text-[11px] text-[#6B4456] bg-[#FFF8DC] border-[1px] border-[#FFE4A3] rounded-full px-2 py-0.5 truncate">
                          {agent.folder}
                        </code>
                      </div>
                    )}

                    {agent.notes && (
                      <div className="pt-2 mt-2 border-t border-[#FFE4EC] text-[#B85878] italic">
                        {agent.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          style={{ background: 'rgba(194, 24, 91, 0.25)' }}
          onClick={() => setEditing(null)}
        >
          <div
            className="modal-scroll bg-white border-[1.5px] border-[#FFE4EC] rounded-[16px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#FFE4EC] p-5 flex items-center justify-between rounded-t-[16px]">
              <h2 className="font-glam text-2xl font-bold text-[#C2185B]">{isNew ? 'New Agent' : 'Edit Agent'}</h2>
              <button onClick={() => setEditing(null)} className="p-1 text-[#B85878] hover:text-[#C2185B] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <Field label="Name *">
                <input
                  type="text"
                  value={editing.name}
                  onChange={e => updateField('name', e.target.value)}
                  className={inputClass}
                  placeholder="e.g., ColorTuneLyrics"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={editing.description}
                  onChange={e => updateField('description', e.target.value)}
                  rows={2}
                  className={textareaClass}
                  placeholder="What it does"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Status">
                  <select
                    value={editing.status}
                    onChange={e => updateField('status', e.target.value)}
                    className={inputClass}
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Category">
                  <input
                    type="text"
                    value={editing.category}
                    onChange={e => updateField('category', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Content Automation"
                  />
                </Field>
              </div>

              <Field label="Tech Stack" hint="comma-separated">
                <input
                  type="text"
                  value={editing.techStack.join(', ')}
                  onChange={e => updateListField('techStack', e.target.value)}
                  className={inputClass}
                  placeholder="Python, JavaScript, MCP"
                />
              </Field>

              <Field label="APIs / Services" hint="comma-separated">
                <input
                  type="text"
                  value={editing.apis.join(', ')}
                  onChange={e => updateListField('apis', e.target.value)}
                  className={inputClass}
                  placeholder="Claude API, Pushover, Alpaca"
                />
              </Field>

              <Field label="Hosting / Where it runs">
                <input
                  type="text"
                  value={editing.hosting}
                  onChange={e => updateField('hosting', e.target.value)}
                  className={inputClass}
                  placeholder="Railway, Local, Vercel, AWS Lambda…"
                />
              </Field>

              <Field label="URL">
                <input
                  type="text"
                  value={editing.url}
                  onChange={e => updateField('url', e.target.value)}
                  className={inputClass}
                  placeholder="https://…"
                />
              </Field>

              <Field label="GitHub Repo">
                <input
                  type="text"
                  value={editing.repoUrl}
                  onChange={e => updateField('repoUrl', e.target.value)}
                  className={inputClass}
                  placeholder="https://github.com/..."
                />
              </Field>

              <Field label="Deploy Method">
                <input
                  type="text"
                  value={editing.deployMethod}
                  onChange={e => updateField('deployMethod', e.target.value)}
                  className={inputClass}
                  placeholder="Auto (GitHub Actions), Manual, n/a..."
                />
              </Field>

              <Field label="Folder" hint="local path">
                <input
                  type="text"
                  value={editing.folder}
                  onChange={e => updateField('folder', e.target.value)}
                  className={inputClass + ' font-mono text-sm'}
                  placeholder="D:/project-folder"
                />
              </Field>

              <Field label="Notes">
                <textarea
                  value={editing.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  rows={2}
                  className={textareaClass}
                  placeholder="Anything else worth remembering"
                />
              </Field>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#FFE4EC] p-5 flex justify-end gap-2 rounded-b-[16px]">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-[#B85878] hover:text-[#C2185B] rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!editing.name.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#FF3D8A] hover:bg-[#C2185B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label
        className="block text-[11px] uppercase font-medium text-[#B85878] mb-1.5"
        style={{ letterSpacing: '0.06em' }}
      >
        {label}
        {hint && <span className="text-[#B85878]/70 font-normal normal-case ml-2 tracking-normal">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
