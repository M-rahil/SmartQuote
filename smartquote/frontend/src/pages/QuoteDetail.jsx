import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { quoteApi } from '../services/api';
import { ArrowLeft, Download, CheckCircle, XCircle, Send, Copy, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS = ['saved', 'sent', 'accepted', 'rejected'];
const STATUS_COLORS = {
  saved: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  sent: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
  draft: 'bg-slate-500/15 text-slate-400 border-slate-500/20'
};

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    quoteApi.getById(id)
      .then(res => setQuote(res.data.quote))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    try {
      const res = await quoteApi.updateStatus(id, status);
      setQuote(res.data.quote);
    } catch (err) { console.error(err); }
    finally { setUpdating(false); }
  };

  const handlePDF = async () => {
    try { await quoteApi.downloadPDF(id); }
    catch (err) { console.error(err); }
  };

  const copyJustification = () => {
    navigator.clipboard.writeText(quote?.result?.justification || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full spinner" />
    </div>
  );

  if (!quote) return null;
  const { inputs, result } = quote;

  return (
    <div className="space-y-6 animate-fade-up max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="btn-ghost p-2"><ArrowLeft size={18} /></Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{quote.title}</h1>
          {quote.clientName && <p className="text-slate-400 text-sm">Client: {quote.clientName}</p>}
        </div>
        <span className={`badge border text-sm ${STATUS_COLORS[quote.status]}`}>{quote.status}</span>
      </div>

      {/* Price summary */}
      <div className="card p-6 glow-blue">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-slate-500 mb-1">Hourly Rate</div>
            <div className="text-3xl font-extrabold num-display text-white">
              ${result.finalHourly?.toLocaleString()}<span className="text-slate-500 text-base font-normal">/hr</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Fixed Price ({inputs.estimatedHours}h)</div>
            <div className="text-3xl font-extrabold num-display text-emerald-400">
              ${result.fixedPrice?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Project Parameters</h3>
          <div className="space-y-2.5">
            {[
              ['Skill', inputs.skill?.replace(/-/g, ' ')],
              ['Experience', inputs.experienceLevel],
              ['Country', inputs.country],
              ['Hours', inputs.estimatedHours],
              ['Complexity', inputs.complexity],
              ['Urgency', inputs.urgency],
              ['Overhead', `${(inputs.overheadPct * 100).toFixed(0)}%`],
              ['Profit Margin', `${(inputs.profitMarginPct * 100).toFixed(0)}%`]
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500 capitalize">{label}</span>
                <span className="text-slate-200 capitalize font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Price Breakdown</h3>
          <div className="space-y-2 text-sm">
            {[
              ['Base Rate', `$${result.baseHourly}/hr`],
              ['After Level Adj.', `$${result.levelAdjusted}/hr`],
              ['After Complexity', `$${result.complexityAdjusted}/hr`],
              ['After Market', `$${result.countryAdjusted}/hr`],
              ['After Urgency', `$${result.urgencyAdjusted}/hr`],
              ['After Overhead', `$${result.hourlyWithOverhead}/hr`],
              ['Final Hourly', `$${result.finalHourly}/hr`]
            ].map(([label, val], i, arr) => (
              <div key={label} className={`flex justify-between ${i === arr.length - 1 ? 'pt-2 border-t border-slate-700 font-semibold text-blue-400' : 'text-slate-400'}`}>
                <span>{label}</span>
                <span className="num-display">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Justification */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Client Justification</h3>
          <button onClick={copyJustification} className="btn-ghost text-xs flex items-center gap-1.5 py-1">
            {copied ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 rounded-xl p-4">
          {result.justification}
        </p>
      </div>

      {/* Status update */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => handleStatusUpdate(s)}
              disabled={updating || quote.status === s}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 capitalize
                ${quote.status === s
                  ? STATUS_COLORS[s]
                  : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handlePDF} className="btn-primary flex items-center gap-2">
          <Download size={16} /> Download PDF
        </button>
        <Link to="/calculator" className="btn-secondary">New Quote</Link>
      </div>

      <div className="text-xs text-slate-600">
        Created {new Date(quote.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
