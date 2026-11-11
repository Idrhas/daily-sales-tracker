import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';

export default function ReceiptModal({ imageUrl, description, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Receipt Attachment</h3>
            <p className="text-xs text-slate-500 truncate max-w-sm">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Open full image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={imageUrl}
              download
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-900/5 max-h-[75vh] overflow-auto flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Receipt"
            className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-sm object-contain"
          />
        </div>
      </div>
    </div>
  );
}

