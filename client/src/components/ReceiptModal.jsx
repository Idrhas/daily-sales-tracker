import React, { useState } from 'react';
import { X, ExternalLink, Download, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function ReceiptModal({ imageUrl, description, onClose }) {
  const [imgError, setImgError] = useState(false);

  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Transaction Proof</h3>
              <p className="text-xs text-slate-500 truncate max-w-md">{description || 'Sales Record Proof'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition"
              title="Open full image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={imageUrl}
              download="sales-proof-image"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition"
              title="Download proof image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/5 max-h-[78vh] overflow-auto flex items-center justify-center min-h-[260px]">
          {!imgError ? (
            <img
              src={imageUrl}
              alt="Proof"
              onError={() => setImgError(true)}
              className="max-h-[72vh] w-auto max-w-full rounded-lg shadow-md object-contain bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-sm font-semibold text-slate-800">Proof image could not be loaded</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs break-all">{imageUrl}</p>
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Try opening directly
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

