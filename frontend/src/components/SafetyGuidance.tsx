import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Check, Copy, ExternalLink, AlertOctagon } from 'lucide-react';

const EMERGENCY_STEPS = [
  {
    step: '01',
    title: 'Stop Communication Immediately',
    desc: 'Cease replying on WhatsApp, Telegram, SMS, or phone calls. Do not negotiate with or confront the scammer.',
  },
  {
    step: '02',
    title: 'Never Share Sensitive Credentials',
    desc: 'Never enter or verbally disclose your 4/6-digit UPI PIN, SMS OTP, NetBanking password, or debit card CVV.',
  },
  {
    step: '03',
    title: 'Contact Bank via Official Channels',
    desc: 'Call the official customer helpline printed on the back of your physical debit card to freeze compromised cards or accounts.',
  },
  {
    step: '04',
    title: 'Dial 1930 — National Cyber Crime Helpline',
    desc: 'Call 1930 immediately if any money has been debited. The National Cyber Crime Reporting Portal can freeze mule accounts within the golden hour.',
  },
  {
    step: '05',
    title: 'Preserve All Digital Evidence',
    desc: 'Take complete screenshots of chats, payment receipts, UPI Reference (UTR) numbers, and caller IDs before deleting them.',
  },
];

export const SafetyGuidance: React.FC = () => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleCopyTemplate = () => {
    const template = `INCIDENT REPORT TEMPLATE
Date & Time: ${new Date().toLocaleString()}
Scam Type: [e.g. Fake UPI Refund / Electricity Cutoff / Telegram Task]
Suspect Phone Number / Telegram ID: 
Scammer UPI VPA / Bank Details: 
UTR / Transaction Reference: 
Amount Debited (if any): INR 
Incident Summary: `;
    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <section
      id="safety"
      className="relative min-h-screen w-full px-6 md:px-16 lg:px-24 py-28 z-20 flex flex-col justify-center"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="font-mono-cad text-xs text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>[05]</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_#f43f5e]" />
              <span className="text-neutral-300">INCIDENT RESPONSE PROTOCOL</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Emergency safety guidance.
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Follow this disciplined checklist if you or a family member have encountered an active phishing or cyber fraud attempt.
          </p>
        </div>

        {/* Golden Rule Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-10 p-6 rounded-3xl bg-neutral-900/80 border border-amber-400/40 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle Ambient Amber Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 animate-beacon relative">
              <span className="w-full h-full rounded-2xl border border-amber-400/30 animate-ping absolute pointer-events-none opacity-50" />
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-mono-cad text-[10px] text-amber-400 tracking-wider uppercase mb-1 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24]" />
                <span>FUNDAMENTAL UPI LAW</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-neutral-200 max-w-2xl leading-relaxed">
                Receiving money via UPI <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-4 font-bold">NEVER</span> requires entering your UPI PIN, scanning a QR code, or sharing an OTP.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <motion.a
              href="tel:1930"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 text-neutral-950 text-xs font-bold hover:bg-amber-300 transition-all shadow-[0_0_25px_rgba(251,191,36,0.45)] cursor-pointer overflow-hidden group"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Call 1930</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Minimal High-Impact Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
          {EMERGENCY_STEPS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-5 rounded-2xl glass-card flex flex-col justify-between border border-white/[0.08] hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(0,229,117,0.15)] transition-all duration-300 group cursor-default border-beam-glow"
            >
              <div>
                <div className="font-mono-cad text-xs font-bold text-neutral-500 group-hover:text-emerald-300 transition-colors mb-2 flex items-center justify-between">
                  <span>{item.step}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_#00e575] transition-all" />
                </div>
                <h3 className="font-display font-semibold text-sm text-white mb-2 leading-snug group-hover:text-neutral-100 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Official Resources & Complaint Template */}
        <div className="p-6 md:p-8 rounded-3xl glass-card border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="font-display font-medium text-white text-sm mb-1">
              National Cyber Crime Reporting Portal (Govt. of India)
            </div>
            <p className="text-xs text-neutral-400">
              For online complaints and official cyber fraud lodging: <span className="font-mono-cad text-emerald-400">cybercrime.gov.in</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-200 text-xs font-mono-cad transition-colors border border-white/[0.1] cursor-pointer"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>{copiedTemplate ? 'Copied Template' : 'Copy Evidence Template'}</span>
            </button>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fxology-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
