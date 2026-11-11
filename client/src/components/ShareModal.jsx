import React, { useState } from 'react';
import { X, Share2, Copy, Check, RefreshCw, Eye, ExternalLink } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, shareToken, onRegenerateToken }) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/?token=${shareToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Regenerating will revoke access for existing shared links. Proceed?')) {
      return;
    }
    setRegenerating(true);
    await onRegenerateToken();
    setRegenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Share Read-Only Dashboard</h3>
            <p className="text-xs text-slate-500">Provide this link to clients or team members</p>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-5 flex items-start gap-2.5">
          <Eye className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 leading-relaxed">
            Anyone with this link can view all sales entries, receipts, and filter by day, week, or month, but <strong>cannot make any edits or deletions</strong>.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Shareable Read-Only Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all outline-none"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shrink-0 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-medium"
            >
              Preview link as viewer <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
              Regenerate Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

