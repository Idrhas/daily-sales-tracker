import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  Image as ImageIcon, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Download, 
  Clock, 
  Eye, 
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  Package,
  Banknote,
  CreditCard,
  Smartphone
} from 'lucide-react';

export default function SalesList({
  sales = [],
  loading = false,
  filter = 'all',
  onFilterChange,
  customStart,
  customEnd,
  onCustomDateChange,
  search = '',
  onSearchChange,
  sortBy = 'date',
  sortOrder = 'DESC',
  onSortChange,
  onDeleteSale,
  onOpenReceipt,
  onOpenAudit,
  isReadOnly = false,
  currency = '$',
  onExportCsv
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [expandedSaleIds, setExpandedSaleIds] = useState(new Set());

  // Aggregate totals across sales for summary display
  const totalAmount = sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const totalCash = sales.reduce((sum, s) => sum + (Number(s.cash_amount) || 0), 0);
  const totalCard = sales.reduce((sum, s) => sum + (Number(s.card_amount) || 0), 0);
  const totalOther = sales.reduce((sum, s) => sum + (Number(s.other_amount) || 0), 0);

  const toggleExpand = (id) => {
    setExpandedSaleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditForm({
      amount: s.amount,
      description: s.description,
      category: s.category,
      date: s.date,
      time: s.time,
      cash_amount: s.cash_amount,
      card_amount: s.card_amount,
      other_amount: s.other_amount,
      other_payment_name: s.other_payment_name,
      notes: s.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id, onSaveSuccess) => {
    try {
      const token = localStorage.getItem('sales_tracker_token');
      const res = await fetch(`/api/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingId(null);
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch (err) {
      alert('Failed to save changes: ' + err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' },
            { id: 'custom', label: 'Custom Range' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === item.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side: Search, Sort, CSV Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search sales..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [col, order] = e.target.value.split('-');
                onSortChange(col, order);
              }}
              className="text-xs border border-slate-300 rounded-xl px-2.5 py-1.5 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="date-DESC">Date: Newest First</option>
              <option value="date-ASC">Date: Oldest First</option>
              <option value="amount-DESC">Amount: Highest First</option>
              <option value="amount-ASC">Amount: Lowest First</option>
              <option value="description-ASC">Description: A to Z</option>
            </select>
          </div>

          {!isReadOnly && (
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              title="Download Excel / CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {filter === 'custom' && (
        <div className="bg-slate-50 p-3 border-b border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700">From:</span>
          <input
            type="date"
            value={customStart || ''}
            onChange={(e) => onCustomDateChange(e.target.value, customEnd)}
            className="border border-slate-300 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="font-semibold text-slate-700">To:</span>
          <input
            type="date"
            value={customEnd || ''}
            onChange={(e) => onCustomDateChange(customStart, e.target.value)}
            className="border border-slate-300 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-3 w-8"></th>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-4">Sales Description / Items</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Payment Split</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-3 text-center">Proof</th>
              {!isReadOnly && <th className="py-3 px-4 text-center">Audit Trail</th>}
              {!isReadOnly && <th className="py-3 px-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={isReadOnly ? 7 : 9} className="py-12 text-center text-slate-400">
                  Loading sales records...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={isReadOnly ? 7 : 9} className="py-12 text-center text-slate-400">
                  No sales found for the selected period.
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const isEditing = editingId === sale.id;
                const isExpanded = expandedSaleIds.has(sale.id);

                let parsedItems = [];
                try {
                  if (sale.items) {
                    parsedItems = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
                  }
                } catch (e) {}

                const hasItems = Array.isArray(parsedItems) && parsedItems.length > 0;
                const cash = Number(sale.cash_amount) || 0;
                const card = Number(sale.card_amount) || 0;
                const other = Number(sale.other_amount) || 0;

                return (
                  <React.Fragment key={sale.id}>
                    <tr className={`hover:bg-slate-50/70 transition group ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                      {/* Expand Chevron */}
                      <td className="py-3.5 px-3 text-center">
                        {hasItems ? (
                          <button
                            onClick={() => toggleExpand(sale.id)}
                            className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-slate-200/60 transition"
                            title={isExpanded ? 'Collapse items' : 'View itemized breakdown'}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        ) : null}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {isEditing ? (
                          <div className="space-y-1">
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                              className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-full"
                            />
                            <input
                              type="time"
                              value={editForm.time}
                              onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                              className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-full"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold text-slate-800">{sale.date}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {sale.time}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Description & Items count */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                          />
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{sale.description}</span>
                              {hasItems && (
                                <button
                                  onClick={() => toggleExpand(sale.id)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                >
                                  <Package className="w-3 h-3" />
                                  <span>{parsedItems.length} item{parsedItems.length === 1 ? '' : 's'}</span>
                                </button>
                              )}
                            </div>
                            {sale.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">{sale.notes}</p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {sale.category || 'General'}
                        </span>
                      </td>

                      {/* Payment Breakdown Badges */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex flex-wrap items-center gap-1">
                          {cash > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60" title="Cash">
                              <Banknote className="w-3 h-3 text-emerald-600" /> {currency}{cash.toFixed(0)}
                            </span>
                          )}
                          {card > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200/60" title="Card / POS">
                              <CreditCard className="w-3 h-3 text-blue-600" /> {currency}{card.toFixed(0)}
                            </span>
                          )}
                          {other > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-800 border border-purple-200/60" title={sale.other_payment_name || 'Other/Transfer'}>
                              <Smartphone className="w-3 h-3 text-purple-600" /> {currency}{other.toFixed(0)}
                            </span>
                          )}
                          {cash === 0 && card === 0 && other === 0 && (
                            <span className="text-[10px] text-slate-400">
                              {sale.payment_method || 'Cash'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="border border-slate-300 rounded px-2 py-1 text-xs text-right w-24"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 text-sm">
                            {currency}{Number(sale.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        )}
                      </td>

                      {/* Proof Image (Single image viewable by both general and admin) */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {sale.proof_url || sale.receipt_url ? (
                          <button
                            onClick={() => onOpenReceipt(sale.proof_url || sale.receipt_url, sale.description)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition text-xs font-semibold shadow-2xs group cursor-pointer"
                            title="View single image proof"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium italic">No Proof</span>
                        )}
                      </td>

                      {/* Audit Trail (Admin only) */}
                      {!isReadOnly && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => onOpenAudit(sale)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition cursor-pointer"
                            title="Click to view immutable audit trail"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {sale.updated_at && (
                              <span className="px-1 bg-amber-100 text-amber-800 rounded text-[9px] font-sans font-semibold">
                                Edited
                              </span>
                            )}
                          </button>
                        </td>
                      )}

                      {/* Actions */}
                      {!isReadOnly && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => saveEdit(sale.id, () => onFilterChange(filter))}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => startEdit(sale)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                title="Edit Entry"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteSale(sale.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>

                    {/* Expandable Itemized Breakdown & Payment Details */}
                    {hasItems && isExpanded && (
                      <tr className="bg-slate-50/70 border-b border-slate-100">
                        <td colSpan={isReadOnly ? 8 : 9} className="py-3 px-6">
                          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-2">
                            <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap justify-between items-center text-xs font-semibold text-slate-700 gap-2">
                              <span>Itemized List ({parsedItems.length} items)</span>
                              <div className="flex items-center gap-3">
                                {cash > 0 && <span className="text-emerald-700">Cash: {currency}{cash.toFixed(2)}</span>}
                                {card > 0 && <span className="text-blue-700">Card: {currency}{card.toFixed(2)}</span>}
                                {other > 0 && <span className="text-purple-700">{sale.other_payment_name || 'Other'}: {currency}{other.toFixed(2)}</span>}
                                <span className="text-slate-900 font-bold border-l pl-3 border-slate-300">
                                  Total: {currency}{Number(sale.amount).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 bg-slate-50/50">
                                  <th className="py-1.5 px-3">Item Name</th>
                                  <th className="py-1.5 px-3">Category</th>
                                  <th className="py-1.5 px-3 text-center">Qty</th>
                                  <th className="py-1.5 px-3 text-right">Unit Price</th>
                                  <th className="py-1.5 px-3 text-right">Line Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {parsedItems.map((it, itemIdx) => (
                                  <tr key={itemIdx} className="hover:bg-slate-50/40">
                                    <td className="py-2 px-3 font-medium text-slate-800">
                                      {it.name || it.description || 'Item'}
                                    </td>
                                    <td className="py-2 px-3 text-slate-500">
                                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                                        {it.category || sale.category || 'General'}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-center text-slate-600 font-mono">
                                      {it.qty || 1}
                                    </td>
                                    <td className="py-2 px-3 text-right text-slate-600 font-mono">
                                      {currency}{Number(it.price || 0).toFixed(2)}
                                    </td>
                                    <td className="py-2 px-3 text-right font-semibold text-slate-800 font-mono">
                                      {currency}{Number(it.total || ((it.qty || 1) * (it.price || 0))).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {/* Table Footer with Cash Total, Card Total, and Final Total */}
          {sales.length > 0 && (
            <tfoot className="border-t-2 border-slate-300 bg-slate-100/90 text-xs font-semibold text-slate-800">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  Totals ({sales.length} records)
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300" title="Total Cash">
                      <Banknote className="w-3 h-3 text-emerald-700" /> Cash: {currency}{totalCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300" title="Total Card">
                      <CreditCard className="w-3 h-3 text-blue-700" /> Card: {currency}{totalCard.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {totalOther > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 text-purple-900 border border-purple-300" title="Total Other">
                        <Smartphone className="w-3 h-3 text-purple-700" /> Other: {currency}{totalOther.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Final Total</span>
                    <span className="text-base font-extrabold text-emerald-700">
                      {currency}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </td>
                <td colSpan={isReadOnly ? 1 : 3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Bottom Summary Bar: Cash Total, Card Total, Final Total */}
      {sales.length > 0 && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-800 font-bold">{sales.length}</strong> sales transactions
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span>Cash Total: {currency}{totalCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Card Total: {currency}{totalCard.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold shadow-xs">
              <span className="text-emerald-100 uppercase text-[10px] tracking-wider">Final Total:</span>
              <span className="text-sm font-extrabold">{currency}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
