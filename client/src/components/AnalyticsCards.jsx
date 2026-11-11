import React from 'react';
import { DollarSign, ShoppingCart, TrendingUp, BarChart2, Banknote, CreditCard, Smartphone } from 'lucide-react';

export default function AnalyticsCards({ stats, sales = [], currency = '$' }) {
  const totalAmount = stats?.totalAmount || 0;
  const totalCash = stats?.totalCash || 0;
  const totalCard = stats?.totalCard || 0;
  const totalOther = stats?.totalOther || 0;
  const count = stats?.count || 0;
  const avg = stats?.averageAmount || 0;

  const cashPct = totalAmount > 0 ? Math.round((totalCash / totalAmount) * 100) : 0;
  const cardPct = totalAmount > 0 ? Math.round((totalCard / totalAmount) * 100) : 0;
  const otherPct = totalAmount > 0 ? Math.round((totalOther / totalAmount) * 100) : 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {currency}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{count} transaction{count === 1 ? '' : 's'}</span>
            <span>Avg: {currency}{avg.toFixed(0)}</span>
          </div>
        </div>

        {/* Total Cash */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Cash Total
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-bold text-emerald-950 tracking-tight">
              {currency}{totalCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Physical cash</span>
            <span className="font-semibold text-emerald-700">{cashPct}% of total</span>
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Card / POS
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-bold text-blue-950 tracking-tight">
              {currency}{totalCard.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Terminal / POS</span>
            <span className="font-semibold text-blue-700">{cardPct}% of total</span>
          </div>
        </div>

        {/* Total Other / Transfers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-purple-600" /> Transfers / Other
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-bold text-purple-950 tracking-tight">
              {currency}{totalOther.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Banks, Mobile, Apps</span>
            <span className="font-semibold text-purple-700">{otherPct}% of total</span>
          </div>
        </div>
      </div>
    </div>
  );
}
