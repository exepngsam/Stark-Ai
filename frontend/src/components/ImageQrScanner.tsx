import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  UploadCloud,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileImage,
  ScanLine,
  RotateCcw,
  Check
} from 'lucide-react';
import { analyzeImageScreenshot } from '../services/api';
import type { ImageAnalysisResponse } from '../types';

const SAMPLE_QR_TESTS = [
  {
    name: 'UPI "Refund" QR Code',
    desc: 'Encodes direct ₹4,999 debit intent disguised as cashback',
    url: 'upi://pay?pa=refund-desk@ybl&pn=PhonePeCashback&am=4999&cu=INR',
  },
  {
    name: 'Electricity Bill Notice QR',
    desc: 'Encodes malicious phishing payment link',
    url: 'http://electricity-bill-pay.site/quickpay?cid=99381',
  },
  {
    name: 'Benign Merchant QR',
    desc: 'Standard nominal grocery payment without deceptive urgency',
    url: 'upi://pay?pa=cornerstore@icici&pn=Green%20Grocers&am=120&cu=INR',
  },
];

export const ImageQrScanner: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setScanning(true);
    setResult(null);

    try {
      const res = await analyzeImageScreenshot(file);
      setResult(res);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Generate synthetic canvas QR/Image for test presets
  const handleTestPreset = (preset: typeof SAMPLE_QR_TESTS[0]) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 300);
      ctx.fillStyle = '#111827';
      // Draw simulated QR finder patterns
      ctx.fillRect(30, 30, 70, 70);
      ctx.clearRect(45, 45, 40, 40);
      ctx.fillRect(55, 55, 20, 20);

      ctx.fillRect(200, 30, 70, 70);
      ctx.clearRect(215, 45, 40, 40);
      ctx.fillRect(225, 55, 20, 20);

      ctx.fillRect(30, 200, 70, 70);
      ctx.clearRect(45, 215, 40, 40);
      ctx.fillRect(55, 225, 20, 20);

      // Random matrix dots
      for (let x = 30; x < 270; x += 15) {
        for (let y = 30; y < 270; y += 15) {
          if (Math.random() > 0.5) {
            ctx.fillRect(x, y, 10, 10);
          }
        }
      }
      ctx.font = '10px monospace';
      ctx.fillText(preset.name, 40, 285);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${preset.name.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
        processFile(file);
      }
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <section
      id="scan"
      className="relative min-h-screen w-full px-6 md:px-16 lg:px-24 py-28 z-20 flex flex-col justify-center"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="font-mono-cad text-xs text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>[03]</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00e575]" />
              <span className="text-neutral-300">OPTICAL & QR DIAGNOSIS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Screenshot & QR threat scanner.
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Upload an image of a suspicious payment QR code or chat screenshot. STARK AI decodes payment URIs via OpenCV to verify if funds are actually leaving your bank.
          </p>
        </div>

        {/* Quick Test Presets */}
        <div className="mb-8">
          <div className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-3">
            QUICK QR SCENARIO TESTS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_QR_TESTS.map((test, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTestPreset(test)}
                className="p-4 rounded-2xl glass-card text-left transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(0,229,117,0.18)] flex items-start justify-between group cursor-pointer border-beam-glow"
              >
                <div>
                  <div className="font-medium text-xs text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_#00e575] transition-all" />
                    <span>{test.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1 pl-3">{test.desc}</div>
                </div>
                <QrCode className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 shrink-0 ml-2 mt-0.5 transition-all group-hover:scale-110" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Drag Drop / Scan Zone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dropzone & Preview */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <motion.div
              whileHover={{ scale: 1.008 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative p-8 rounded-3xl glass-card border-2 border-dashed border-white/[0.12] hover:border-emerald-400/60 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[340px] text-center overflow-hidden shadow-2xl group"
            >
              {/* Cyber Reticle Corner Brackets */}
              <span className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-emerald-400/30 group-hover:border-emerald-400/80 transition-colors pointer-events-none" />
              <span className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-emerald-400/30 group-hover:border-emerald-400/80 transition-colors pointer-events-none" />
              <span className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-emerald-400/30 group-hover:border-emerald-400/80 transition-colors pointer-events-none" />
              <span className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-emerald-400/30 group-hover:border-emerald-400/80 transition-colors pointer-events-none" />

              {/* Ambient Cyber Laser Scanline running across dropzone */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent shadow-[0_0_12px_#00e575] animate-scanline pointer-events-none" />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full h-full flex flex-col items-center z-10">
                  <img
                    src={previewUrl}
                    alt="Scan target preview"
                    className="max-h-56 rounded-xl object-contain shadow-md border border-white/[0.1]"
                  />
                  {/* Active Laser Scanning Animation Effect when analyzing */}
                  {scanning && (
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#06b6d4]"
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <div className="mt-4 font-mono-cad text-xs text-neutral-300 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/[0.08]">
                    <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedFile?.name || 'Image ready'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center z-10">
                  {/* Upload Cloud with Concentric Sonar Pulse Rings */}
                  <div className="relative mb-4 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-2xl border border-emerald-400/20 animate-ping absolute pointer-events-none" />
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(0,229,117,0.2)] group-hover:scale-110 group-hover:border-emerald-400/50 transition-all duration-300">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="font-display font-medium text-sm text-white mb-1">
                    Drag and drop screenshot or QR code
                  </div>
                  <div className="text-xs text-neutral-400 max-w-xs mb-4">
                    Supports PNG, JPG, WEBP. Decoded locally using computer vision.
                  </div>
                  <span className="btn-fxology-primary px-4 py-2 text-xs font-semibold shadow-[0_0_16px_rgba(0,229,117,0.3)]">
                    Select Image
                  </span>
                </div>
              )}
            </motion.div>

            {previewUrl && (
              <button
                onClick={handleReset}
                className="self-start text-xs font-mono-cad text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors pl-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload different image</span>
              </button>
            )}
          </div>

          {/* Analysis & Detection Output */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {scanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-3xl glass-card flex flex-col items-center justify-center min-h-[340px] text-center shadow-2xl"
                >
                  <ScanLine className="w-8 h-8 text-emerald-400 animate-pulse mb-3" />
                  <div className="font-display text-sm font-medium text-white">
                    Running OpenCV Optical Inspection...
                  </div>
                  <div className="text-xs text-emerald-400 mt-1 font-mono-cad">
                    LOCATING FINDER PATTERNS & PARSING DEBIT SCHEMAS
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 md:p-8 rounded-3xl glass-card shadow-2xl border border-white/[0.1] flex flex-col gap-6"
                >
                  {/* Verdict Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div>
                      <div className="font-mono-cad text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                        SCANNER DIAGNOSIS
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono-cad ${
                            result.analysis.verdict.includes('DANGER')
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {result.analysis.verdict.includes('DANGER') ? (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          {result.analysis.verdict}
                        </span>
                        <span className="text-xs font-medium text-neutral-300">
                          {result.analysis.scam_category}
                        </span>
                      </div>
                    </div>

                    <div className="font-mono-cad text-sm text-neutral-400">
                      RISK: <span className="font-bold text-white">{result.analysis.risk_score}%</span>
                    </div>
                  </div>

                  {/* Decoded QR Payload box */}
                  {result.decoded_content && (
                    <div>
                      <div className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>DECODED URI PAYLOAD</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-emerald-400 font-mono-cad border border-white/[0.08]">
                          OPENCV DECODED
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.02] font-mono-cad text-xs text-neutral-200 break-all select-all border border-white/[0.06]">
                        {result.decoded_content}
                      </div>
                    </div>
                  )}

                  {/* Critical Warning if UPI */}
                  {result.analysis.critical_warning && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>{result.analysis.critical_warning}</div>
                    </div>
                  )}

                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-1.5">
                      EXECUTIVE SUMMARY
                    </h4>
                    <p className="text-sm text-neutral-200 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06]">
                      {result.analysis.summary}
                    </p>
                  </div>

                  {/* Red flags */}
                  {result.analysis.red_flags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-2">
                        FLAGGED THREAT FACTORS
                      </h4>
                      <div className="flex flex-col gap-2">
                        {result.analysis.red_flags.map((f, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs"
                          >
                            <div className="font-semibold text-white mb-0.5">{f.indicator}</div>
                            <div className="text-neutral-400 font-mono-cad text-[11px]">{f.evidence}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended actions */}
                  <div>
                    <h4 className="text-xs font-mono-cad text-neutral-400 uppercase tracking-wider mb-2">
                      DEFENSE PROTOCOLS
                    </h4>
                    <ul className="flex flex-col gap-1.5">
                      {result.analysis.recommended_actions.map((act, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <div className="relative h-full min-h-[340px] rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.015] flex flex-col items-center justify-center p-8 text-center text-neutral-500 overflow-hidden group">
                  {/* Subtle Background Cyber Radar Grid Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-56 h-56 rounded-full border border-emerald-400/30 animate-radar" />
                    <div className="w-36 h-36 rounded-full border border-dashed border-cyan-400/30 animate-radar [animation-direction:reverse] [animation-duration:8s] absolute" />
                  </div>

                  {/* Central Radar Scanner Node */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center mb-4 text-emerald-400 shadow-[0_0_25px_rgba(0,229,117,0.15)] group-hover:border-emerald-400/50 group-hover:scale-105 transition-all duration-300">
                    <span className="absolute inset-0 rounded-2xl border border-emerald-400/30 animate-ping pointer-events-none opacity-40" />
                    <QrCode className="w-7 h-7" />
                  </div>

                  <div className="relative z-10 font-display font-medium text-white text-sm mb-1.5 flex items-center gap-2">
                    <span>Optical Telemetry Ready</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00e575]" />
                  </div>

                  <p className="relative z-10 text-xs text-neutral-400 max-w-sm leading-relaxed">
                    Drop a payment QR code or select one of the quick test scenarios above to observe how STARK AI isolates fraudulent debit intents.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
