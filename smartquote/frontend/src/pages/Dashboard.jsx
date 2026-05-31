import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quoteApi } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, FileText, DollarSign, Award,
  Download, Trash2, Eye, Plus, RefreshCw
} from 'lucide-react';

const STATUS_COLORS = {
  saved: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  sent: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
  draft: 'bg-slate-500/15 text-slate-400 border-slate-500/20'
};

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-blue-400' }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      <Icon size={16} className={color} />
    </div>
    <div className={`text-2xl font-bold num-display ${color}`}>{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 100 ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await quoteApi.getUserQuotes();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this quote?')) return;
    setDeleting(id);
    try {
      await quoteApi.delete(id);
      setData(prev => ({
        ...prev,
        quotes: prev.quotes.filter(q => q._id !== id)
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePDF = async (id) => {
    try { await quoteApi.downloadPDF(id); }
    catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full spinner" />
    </div>
  );

  const { quotes = [], analytics = {} } = data || {};

  // Prepare skill chart data
  const skillChartData = Object.entries(analytics.skillCounts || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({ name: name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '), count }));

  // Pricing distribution
  const priceRanges = { '<$1k': 0, '$1k-5k': 0, '$5k-15k': 0, '$15k+': 0 };
  quotes.forEach(q => {
    const v = q.result?.fixedPrice || 0;
    if (v < 1000) priceRanges['<$1k']++;
    else if (v < 5000) priceRanges['$1k-5k']++;
    else if (v < 15000) priceRanges['$5k-15k']++;
    else priceRanges['$15k+']++;
  });
  const pieData = Object.entries(priceRanges).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>
        <Link to="/calculator" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Quote
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Quotes" value={analytics.total || 0} color="text-blue-400" />
        <StatCard icon={DollarSign} label="Total Value" value={`$${(analytics.totalValue || 0).toLocaleString()}`} color="text-emerald-400" />
        <StatCard icon={TrendingUp} label="Avg Quote" value={`$${(analytics.avgValue || 0).toLocaleString()}`} color="text-amber-400" />
        <StatCard icon={Award} label="Accepted" value={analytics.statusCounts?.accepted || 0} color="text-purple-400" />
      </div>

      {/* Charts */}
      {quotes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Monthly trend */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Quotes Trend (6 months)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={analytics.monthlyTrend || []}>
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} name="Quotes" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pricing distribution */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Price Ranges</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} dataKey="value" strokeWidth={0}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {pieData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-slate-400">{d.name}</span>
                      </div>
                      <span className="text-slate-300 font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
            )}
          </div>

          {/* Skills bar chart */}
          {skillChartData.length > 0 && (
            <div className="card p-5 lg:col-span-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Most Quoted Skills</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={skillChartData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Quotes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Quote History Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Quote History</h3>
          <button onClick={load} className="btn-ghost text-xs flex items-center gap-1.5 py-1">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={36} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">No quotes yet. Create your first one!</p>
            <Link to="/calculator" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Generate Quote
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {['Title', 'Skill', 'Hourly', 'Fixed Price', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left text-xs text-slate-500 uppercase tracking-wider px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {quotes.map(q => (
                  <tr key={q._id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-200 truncate max-w-[140px]">{q.title}</div>
                      {q.clientName && <div className="text-xs text-slate-500 truncate">{q.clientName}</div>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 capitalize">{q.inputs?.skill?.replace(/-/g, ' ')}</td>
                    <td className="px-5 py-3.5 num-display text-slate-300">${q.result?.finalHourly?.toLocaleString()}/hr</td>
                    <td className="px-5 py-3.5 num-display font-semibold text-emerald-400">${q.result?.fixedPrice?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge border ${STATUS_COLORS[q.status] || STATUS_COLORS.draft}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link to={`/quotes/${q._id}`} className="btn-ghost p-1.5" title="View">
                          <Eye size={14} />
                        </Link>
                        <button onClick={() => handlePDF(q._id)} className="btn-ghost p-1.5" title="Download PDF">
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          disabled={deleting === q._id}
                          className="btn-ghost p-1.5 hover:text-red-400 hover:bg-red-500/10"
                          title="Delete"
                        >
                          {deleting === q._id
                            ? <RefreshCw size={14} className="spinner" />
                            : <Trash2 size={14} />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
