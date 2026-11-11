import React from 'react';
import { DollarSign, ShoppingCart, TrendingUp, BarChart2 } from 'lucide-react';

export default function AnalyticsCards({ stats, sales = [], currency = '$' }) {
  const totalAmount = stats?.totalAmount || 0;
  const count = stats?.count || 0;
  const avg = stats?.averageAmount || 0;

  // Compute category breakdown
  const categoryMap = {};
  sales.forEach(s => {
    const cat = s.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(s.amount || 0);
  });
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        <p className="mt-1 text-xs text-slate-500">
          Across {count} recorded transaction{count === 1 ? '' : 's'}
        </p>
      </div>

      {/* Total Sales Count */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Transactions
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {count}
          </span>
          <span className="ml-2 text-xs font-medium text-slate-500">entries</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          In selected timeframe
        </p>
      </div>

      {/* Average Transaction */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Sale
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {currency}{avg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Per transaction average
        </p>
      </div>

      {/* Top Categories Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Top Categories
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-2 space-y-1.5">
          {topCategories.length > 0 ? (
            topCategories.map(([cat, amt]) => {
              const pct = totalAmount > 0 ? Math.round((amt / totalAmount) * 100) : 0;
              return (
                <div key={cat} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 truncate max-w-[120px]">{cat}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800">{currency}{amt.toFixed(0)}</span>
                    <span className="text-[10px] text-slate-400">({pct}%)</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 py-1">No categorized sales yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

