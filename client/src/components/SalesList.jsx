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
  FileSpreadsheet 
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

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditForm({
      amount: s.amount,
      description: s.description,
      category: s.category,
      date: s.date,
      time: s.time,
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
      {/* Controls Bar: Date Filter Pills, Search, Export */}
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
          {/* Search Box */}
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

          {/* Sort Dropdown */}
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

          {/* Export to CSV */}
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
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Receipt</th>
              <th className="py-3 px-4">Upload Proof & Audit</th>
              {!isReadOnly && <th className="py-3 px-4 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={isReadOnly ? 6 : 7} className="py-12 text-center text-slate-400">
                  Loading sales records...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={isReadOnly ? 6 : 7} className="py-12 text-center text-slate-400">
                  No sales found for the selected period.
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const isEditing = editingId === sale.id;

                return (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50/70 transition group"
                  >
                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
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

                    {/* Description */}
                    <td className="py-3.5 px-4 min-w-[180px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                        />
                      ) : (
                        <div>
                          <p className="font-semibold text-slate-900">{sale.description}</p>
                          {sale.notes && (
                            <p className="text-[11px] text-slate-500 italic mt-0.5">{sale.notes}</p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="border border-slate-300 rounded px-1.5 py-1 text-xs"
                        >
                          <option value="Retail">Retail</option>
                          <option value="Services">Services</option>
                          <option value="Wholesale">Wholesale</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Online">Online</option>
                          <option value="General">General</option>
                        </select>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {sale.category || 'General'}
                        </span>
                      )}
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

                    {/* Receipt Preview */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {sale.receipt_url ? (
                        <button
                          onClick={() => onOpenReceipt(sale.receipt_url, sale.description)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-[11px] font-medium"
                          title="View receipt attachment"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>View Photo</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">None</span>
                      )}
                    </td>

                    {/* Immutable Upload Proof & Audit Trail */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenAudit(sale)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono transition"
                          title="Click to view full immutable audit trail"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {sale.updated_at && (
                            <span className="px-1 bg-amber-100 text-amber-800 rounded text-[9px] font-sans font-semibold">
                              Edited
                            </span>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Actions (Only visible in edit mode) */}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

