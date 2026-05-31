import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { skillsApi, quoteApi } from '../services/api';
import {
  Zap, TrendingUp, Save, Download, Copy, CheckCircle,
  ChevronDown, RefreshCw, Info, ArrowLeft
} from 'lucide-react';

const COUNTRIES = [
  { code: 'US', label: 'United States' }, { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' }, { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' }, { code: 'FR', label: 'France' },
  { code: 'IN', label: 'India' }, { code: 'BR', label: 'Brazil' },
  { code: 'PK', label: 'Pakistan' }, { code: 'PH', label: 'Philippines' },
  { code: 'NG', label: 'Nigeria' }, { code: 'UA', label: 'Ukraine' },
  { code: 'PL', label: 'Poland' }, { code: 'MX', label: 'Mexico' },
  { code: 'ZA', label: 'South Africa' }, { code: 'OTHER', label: 'Other' }
];

const LEVELS = [
  { value: 'junior', label: 'Junior', desc: '0–2 years' },
  { value: 'mid', label: 'Mid-Level', desc: '2–5 years' },
  { value: 'senior', label: 'Senior', desc: '5–10 years' },
  { value: 'expert', label: 'Expert', desc: '10+ years' }
];

const COMPLEXITY = [
  { value: 'low', label: 'Low', desc: 'Simple, well-defined' },
  { value: 'medium', label: 'Medium', desc: 'Standard project' },
  { value: 'high', label: 'High', desc: 'Complex requirements' },
  { value: 'critical', label: 'Critical', desc: 'Mission-critical' }
];

const URGENCY = [
  { value: 'relaxed', label: 'Relaxed', desc: 'Flexible timeline' },
  { value: 'normal', label: 'Normal', desc: 'Standard timeline' },
  { value: 'urgent', label: 'Urgent', desc: 'Accelerated' },
  { value: 'rush', label: 'Rush', desc: 'ASAP delivery' }
];

const BreakdownRow = ({ label, value, highlight, dim }) => (
  <div className={`flex justify-between items-center py-2.5 px-3 rounded-lg ${highlight ? 'bg-blue-500/10 border border-blue-500/20' : dim ? '' : 'hover:bg-slate-700/30'}`}>
    <span className={`text-sm ${dim ? 'text-slate-500' : highlight ? 'text-blue-300 font-medium' : 'text-slate-300'}`}>{label}</span>
    <span className={`num-display text-sm font-semibold ${highlight ? 'text-blue-400 text-base' : dim ? 'text-slate-500' : 'text-slate-100'}`}>{value}</span>
  </div>
);

export default function Calculator() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [skillsByCategory, setSkillsByCategory] = useState({});
  const [form, setForm] = useState({
    skill: '',
    experienceLevel: 'mid',
    country: user?.country || 'US',
    estimatedHours: 40,
    complexity: 'medium',
    urgency: 'normal',
    overheadPct: 0.20,
    profitMarginPct: 0.25
  });
  const [result, setResult] = useState(null);
  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    skillsApi.getAll().then(res => {
      const all = res.data.skills;
      setSkills(all);
      const byCat = {};
      all.forEach(s => {
        if (!byCat[s.category]) byCat[s.category] = [];
        byCat[s.category].push(s);
      });
      setSkillsByCategory(byCat);
      if (all.length) setForm(p => ({ ...p, skill: all[0].skill }));
    }).catch(console.error);
  }, []);

  const calculate = useCallback(async () => {
    if (!form.skill) return;
    setLoading(true);
    setSaved(false);
    try {
      const res = await quoteApi.calculate(form);
      setResult(res.data.result);
      setSkillData(res.data.skillData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    if (form.skill) {
      const timer = setTimeout(calculate, 300);
      return () => clearTimeout(timer);
    }
  }, [form, calculate]);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));
  const setNum = (field) => (e) => setForm(p => ({ ...p, [field]: parseFloat(e.target.value) || 0 }));

  const handleSave = async () => {
    if (!user) { navigate('/register'); return; }
    if (!result) return;
    setSaving(true);
    try {
      const res = await quoteApi.save({
        title: title || `${skillData?.displayName} Quote`,
        clientName,
        inputs: form,
        result
      });
      setSavedId(res.data.quote._id);
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyJustification = () => {
    if (!result?.justification) return;
    navigator.clipboard.writeText(result.justification);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!savedId) { await handleSave(); }
    if (savedId) {
      try { await quoteApi.downloadPDF(savedId); }
      catch (err) { console.error(err); }
    }
  };

  return (
    <div className="min-h-screen mesh-bg py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={user ? '/dashboard' : '/'} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-400" />
              Pricing Calculator
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time market-calibrated quotes</p>
          </div>
        </div>
        {!user && (
          <Link to="/register" className="btn-primary text-sm">Save Quotes Free</Link>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: Input Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Project Details</h2>

            {/* Skill */}
            <div className="mb-4">
              <label className="label">Skill / Service</label>
              <select className="select" value={form.skill} onChange={set('skill')}>
                {Object.entries(skillsByCategory).map(([cat, items]) => (
                  <optgroup key={cat} label={cat}>
                    {items.map(s => <option key={s.skill} value={s.skill}>{s.displayName}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <label className="label">Experience Level</label>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map(l => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, experienceLevel: l.value }))}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${form.experienceLevel === l.value
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                  >
                    <div className="text-xs font-semibold">{l.label}</div>
                    <div className="text-xs opacity-60">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Country & Hours */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="label">Country</label>
                <select className="select" value={form.country} onChange={set('country')}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Est. Hours</label>
                <input type="number" className="input" min="1" max="10000"
                  value={form.estimatedHours} onChange={setNum('estimatedHours')} />
              </div>
            </div>

            {/* Complexity */}
            <div className="mb-4">
              <label className="label">Project Complexity</label>
              <div className="grid grid-cols-2 gap-2">
                {COMPLEXITY.map(c => (
                  <button key={c.value} type="button"
                    onClick={() => setForm(p => ({ ...p, complexity: c.value }))}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${form.complexity === c.value
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                  >
                    <div className="text-xs font-semibold">{c.label}</div>
                    <div className="text-xs opacity-60">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="label">Timeline / Urgency</label>
              <div className="grid grid-cols-2 gap-2">
                {URGENCY.map(u => (
                  <button key={u.value} type="button"
                    onClick={() => setForm(p => ({ ...p, urgency: u.value }))}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${form.urgency === u.value
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                  >
                    <div className="text-xs font-semibold">{u.label}</div>
                    <div className="text-xs opacity-60">{u.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced settings */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info size={14} className="text-slate-500" /> Business Margins
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">Overhead</label>
                  <span className="text-sm font-medium text-slate-300 num-display">{(form.overheadPct * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0" max="0.5" step="0.01" value={form.overheadPct}
                  onChange={setNum('overheadPct')}
                  className="w-full accent-blue-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">Profit Margin</label>
                  <span className="text-sm font-medium text-slate-300 num-display">{(form.profitMarginPct * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0" max="0.6" step="0.01" value={form.profitMarginPct}
                  onChange={setNum('profitMarginPct')}
                  className="w-full accent-blue-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-3 space-y-5">
          {loading && (
            <div className="card p-8 flex items-center justify-center gap-3 text-slate-400">
              <RefreshCw size={18} className="spinner text-blue-400" />
              Calculating...
            </div>
          )}

          {result && !loading && (
            <>
              {/* Price Summary */}
              <div className="card p-6 glow-blue">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    {skillData?.displayName} · {form.experienceLevel}
                  </span>
                  <span className="badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Market Rate
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Hourly Rate</div>
                    <div className="text-4xl font-extrabold num-display text-white">
                      ${result.finalHourly.toLocaleString()}
                      <span className="text-lg text-slate-500 font-normal">/hr</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Fixed Price ({form.estimatedHours}h)</div>
                    <div className="text-4xl font-extrabold num-display text-emerald-400">
                      ${result.fixedPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Multiplier badges */}
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="badge bg-slate-700 text-slate-300 border border-slate-600">
                    Base ${result.baseHourly}/hr
                  </span>
                  <span className="badge bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    Level ×{result.multipliers.level}
                  </span>
                  <span className="badge bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Complexity ×{result.multipliers.complexity}
                  </span>
                  <span className="badge bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Market ×{result.multipliers.country}
                  </span>
                  <span className="badge bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    Urgency ×{result.multipliers.urgency}
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Pricing Breakdown</h3>
                <div className="space-y-0.5">
                  <BreakdownRow label="Base Market Rate" value={`$${result.baseHourly}/hr`} dim />
                  <BreakdownRow label={`× ${form.experienceLevel} Experience (×${result.multipliers.level})`} value={`$${result.levelAdjusted}/hr`} />
                  <BreakdownRow label={`× ${form.complexity} Complexity (×${result.multipliers.complexity})`} value={`$${result.complexityAdjusted}/hr`} />
                  <BreakdownRow label={`× ${form.country} Market (×${result.multipliers.country})`} value={`$${result.countryAdjusted}/hr`} />
                  <BreakdownRow label={`× ${form.urgency} Urgency (×${result.multipliers.urgency})`} value={`$${result.urgencyAdjusted}/hr`} />
                  <BreakdownRow label={`+ Overhead (${(form.overheadPct * 100).toFixed(0)}%)`} value={`$${result.hourlyWithOverhead}/hr`} />
                  <BreakdownRow label={`+ Profit Margin (${(form.profitMarginPct * 100).toFixed(0)}%)`} value={`$${result.finalHourly}/hr`} highlight />
                  <div className="my-2 border-t border-slate-700/50" />
                  <BreakdownRow label={`Fixed Price (${form.estimatedHours} hours)`} value={`$${result.fixedPrice.toLocaleString()}`} highlight />
                </div>
              </div>

              {/* Justification */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Client Justification</h3>
                  <button onClick={handleCopyJustification} className="btn-ghost text-xs flex items-center gap-1.5 py-1">
                    {copied ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 rounded-xl p-4">
                  {result.justification}
                </p>
              </div>

              {/* Save / PDF */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Save & Export</h3>
                {!saved ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label text-xs">Quote Title</label>
                        <input className="input text-sm" placeholder="e.g. E-commerce Project" value={title}
                          onChange={e => setTitle(e.target.value)} />
                      </div>
                      <div>
                        <label className="label text-xs">Client Name</label>
                        <input className="input text-sm" placeholder="e.g. Acme Corp" value={clientName}
                          onChange={e => setClientName(e.target.value)} />
                      </div>
                    </div>
                    <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                      {saving
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" /> Saving...</>
                        : <><Save size={16} /> Save Quote</>
                      }
                    </button>
                    {!user && <p className="text-xs text-slate-500 text-center">You'll be redirected to register — it's free!</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                      <CheckCircle size={16} />
                      Quote saved successfully!
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => navigate(`/quotes/${savedId}`)} className="btn-secondary flex items-center justify-center gap-2 text-sm">
                        View Quote
                      </button>
                      <button onClick={handleDownloadPDF} className="btn-primary flex items-center justify-center gap-2 text-sm">
                        <Download size={15} /> Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!result && !loading && (
            <div className="card p-12 text-center">
              <TrendingUp size={40} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Select a skill to generate your pricing quote.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
