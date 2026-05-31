import { Link } from 'react-router-dom';
import { Zap, TrendingUp, FileText, BarChart3, Shield, Globe, CheckCircle, ArrowRight, Star } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Data-Driven Pricing',
    desc: 'Market-calibrated rates across 14 skills and 16 countries. Never underprice again.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Zap,
    title: 'Real-Time Engine',
    desc: 'Sub-second calculations with multi-factor pricing — complexity, urgency, experience, and market.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    icon: FileText,
    title: 'PDF Proposals',
    desc: 'One-click professional contract PDFs with milestones, payment schedules, and terms.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Visualize pricing trends, skill distribution, and quote performance over time.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  {
    icon: Globe,
    title: 'Global Market Rates',
    desc: 'Country-adjusted multipliers reflect real purchasing power and competitive markets worldwide.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'JWT authentication, encrypted storage, and your quotes are yours alone.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10'
  }
];

const steps = [
  { n: '01', title: 'Select Your Skill', desc: 'Choose from 14 professional skills across development, design, marketing, and more.' },
  { n: '02', title: 'Set Your Parameters', desc: 'Specify experience level, complexity, urgency, project hours, and your country.' },
  { n: '03', title: 'Get Instant Pricing', desc: 'Receive a detailed breakdown with hourly rate, fixed price, and market justification.' },
  { n: '04', title: 'Download Proposal', desc: 'Generate a professional PDF proposal ready to send to your client.' }
];

const testimonials = [
  { name: 'Sarah K.', role: 'UI/UX Designer', text: 'Finally stopped underselling myself. SmartQuote showed me I was charging 40% below market.', rating: 5 },
  { name: 'Marcus T.', role: 'Full-Stack Developer', text: 'The PDF proposals look incredibly professional. Clients take me more seriously now.', rating: 5 },
  { name: 'Priya N.', role: 'Digital Marketer', text: 'The country-adjusted rates were eye-opening. Perfect for competing in global markets.', rating: 5 }
];

export default function Landing() {
  return (
    <div className="min-h-screen mesh-bg text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 border-b border-slate-700/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white">SmartQuote</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/calculator" className="btn-ghost text-sm font-medium">Try Free</Link>
            <Link to="/login" className="btn-ghost text-sm font-medium">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">Data-driven pricing for modern freelancers</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
            Stop guessing.<br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Price with confidence.
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            SmartQuote uses market intelligence to generate accurate, justified freelance quotes in seconds.
            14 skills, 16 countries, professional PDF proposals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/calculator" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 glow-blue">
              <TrendingUp size={18} />
              Try the Calculator Free
              <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn-secondary text-base px-8 py-3.5">
              Create Account
            </Link>
          </div>

          <p className="text-xs text-slate-600 mt-5">No credit card required. Free to use.</p>
        </div>

        {/* Demo Card */}
        <div className="max-w-2xl mx-auto mt-16 card p-6 glow-blue">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Senior Web Developer · High Complexity</div>
              <div className="text-2xl font-bold num-display text-white">$157.50<span className="text-slate-500 text-base font-normal">/hr</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Fixed Price (120 hrs)</div>
              <div className="text-2xl font-bold num-display text-emerald-400">$18,900</div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Base Rate (Web Dev)', value: '$75.00' },
              { label: '× Senior Experience (×1.55)', value: '$116.25' },
              { label: '× High Complexity (×1.40)', value: '$162.75' },
              { label: '× US Market (×1.0)', value: '$162.75' },
              { label: '× Normal Urgency (×1.0)', value: '$162.75' },
              { label: '+ Overhead (20%)', value: '$195.30' },
              { label: '+ Profit Margin (25%)', value: '$244.13' }
            ].map((row, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-400">{row.label}</span>
                <span className="text-slate-200 num-display">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-2">
            <CheckCircle size={14} className="text-blue-400" />
            <span className="text-xs text-slate-500">Live calculation — adjust any parameter to update instantly</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to quote confidently</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">A complete toolkit built for freelancers who take their business seriously.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={i} className="card p-6 hover:border-slate-600/60 transition-all duration-300 group">
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">From inputs to proposal in 60 seconds</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, title, desc }, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-extrabold text-slate-700/50 num-display mb-3">{n}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 -right-3 text-slate-700">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by freelancers worldwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <div>
                  <div className="font-medium text-white text-sm">{name}</div>
                  <div className="text-xs text-slate-500">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center card p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to price smarter?</h2>
          <p className="text-slate-400 mb-8">Join thousands of freelancers generating accurate quotes with SmartQuote.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-300">SmartQuote</span>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} SmartQuote. Freelance Pricing Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
