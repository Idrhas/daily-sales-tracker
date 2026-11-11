import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, History, Clock, User, ArrowRight, AlertTriangle } from 'lucide-react';

export default function AuditModal({ sale, onClose, token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sale) return;

    const fetchAudit = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/sales/${sale.id}/audit`, { headers });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch (err) {
        console.error('Audit fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [sale, token]);

  if (!sale) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Audit Trail & Proof of Record</h3>
            <p className="text-xs text-slate-500">Record ID #{sale.id} • {sale.description}</p>
          </div>
        </div>

        {/* Server Enforced Immutable Upload Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Immutable Server Upload Time:
            </span>
            <span className="font-mono font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {new Date(sale.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-blue-600" /> Created By:
            </span>
            <span className="font-semibold text-slate-800">
              {sale.created_by || 'User'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 italic">
            * This upload timestamp is cryptographically saved at creation and cannot be modified.
          </div>
        </div>

        {/* Change History */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Full Change Log ({history.length} Event{history.length === 1 ? '' : 's'})
          </h4>

          {loading ? (
            <div className="text-center py-6 text-xs text-slate-400">Loading audit history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No subsequent changes recorded for this entry.
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {history.map((item) => {
                let parsedDetails = null;
                try {
                  parsedDetails = JSON.parse(item.details);
                } catch (e) {}

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        item.action === 'CREATE' ? 'bg-emerald-100 text-emerald-800' :
                        item.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.action}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(item.changed_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-slate-600">
                      Changed by: <strong className="text-slate-800">{item.changed_by}</strong>
                    </div>

                    {item.action === 'UPDATE' && parsedDetails && parsedDetails.previous && parsedDetails.current && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-1">
                        {Object.keys(parsedDetails.current).map((key) => {
                          const prev = parsedDetails.previous[key];
                          const curr = parsedDetails.current[key];
                          if (prev === curr) return null;
                          return (
                            <div key={key} className="flex items-center gap-2 text-[11px]">
                              <span className="font-semibold text-slate-500 capitalize">{key}:</span>
                              <span className="text-red-500 line-through truncate max-w-[120px]">{String(prev || 'empty')}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-emerald-600 font-medium truncate max-w-[120px]">{String(curr || 'empty')}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

