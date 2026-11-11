import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Plus, 
  Trash2, 
  DollarSign, 
  FileText, 
  Tag, 
  Calendar, 
  Clock, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  X, 
  Image as ImageIcon,
  Loader2,
  ListPlus,
  Receipt
} from 'lucide-react';

const DEFAULT_ITEM = () => ({
  id: Date.now() + Math.random(),
  name: '',
  category: 'Retail',
  qty: 1,
  price: ''
});

export default function SalesEntryForm({ onSaleAdded, token, currency = '$' }) {
  // General transaction metadata
  const [transactionTitle, setTransactionTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toTimeString().split(' ')[0].substring(0, 5);
  });
  const [notes, setNotes] = useState('');
  
  // Itemized List / Table
  const [items, setItems] = useState([DEFAULT_ITEM()]);

  // Receipt & OCR
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Compute grand total from all item rows
  const grandTotal = items.reduce((sum, it) => {
    const qty = parseFloat(it.qty) || 0;
    const price = parseFloat(it.price) || 0;
    return sum + (qty * price);
  }, 0);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, DEFAULT_ITEM()]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) {
      // Clear row instead of removing the last one
      setItems([DEFAULT_ITEM()]);
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
    setError(null);

    await triggerOcr(file);
  };

  const triggerOcr = async (file) => {
    setOcrLoading(true);
    setOcrMessage('Scanning receipt image with OCR...');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('scan', 'true');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process receipt');

      setUploadedReceiptUrl(data.fileUrl);

      if (data.ocr && data.ocr.extracted) {
        const { amount: ocrAmt, date: ocrDate, description: ocrDesc } = data.ocr.extracted;
        let detected = [];

        if (ocrDate) {
          setDate(ocrDate);
          detected.push(`Date: ${ocrDate}`);
        }
        if (ocrDesc) {
          setTransactionTitle(ocrDesc);
          detected.push(`Merchant: "${ocrDesc}"`);
        }
        if (ocrAmt) {
          // Pre-populate first row with extracted total
          setItems([
            {
              id: Date.now(),
              name: ocrDesc || 'Scanned Receipt Item',
              category: 'Retail',
              qty: 1,
              price: String(ocrAmt)
            }
          ]);
          detected.push(`Total: ${currency}${ocrAmt}`);
        }

        if (detected.length > 0) {
          setOcrMessage(`Receipt OCR Extracted: ${detected.join(', ')}`);
        } else {
          setOcrMessage('Receipt uploaded and attached.');
        }
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setOcrMessage('Receipt attached. Please verify or enter item rows manually.');
    } finally {
      setOcrLoading(false);
    }
  };

  const clearReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setUploadedReceiptUrl(null);
    setOcrMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter valid items
    const validItems = items.filter(it => it.name.trim() !== '' || (parseFloat(it.price) > 0));
    if (validItems.length === 0 && grandTotal <= 0) {
      setError('Please add at least one item with a name or price');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let finalReceiptUrl = uploadedReceiptUrl;

      if (receiptFile && !finalReceiptUrl) {
        const formData = new FormData();
        formData.append('receipt', receiptFile);
        formData.append('scan', 'false');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          finalReceiptUrl = uploadData.fileUrl;
        }
      }

      // Generate description title if not set
      let finalTitle = transactionTitle.trim();
      if (!finalTitle) {
        if (validItems.length > 0) {
          finalTitle = validItems[0].name || 'Sales Transaction';
          if (validItems.length > 1) {
            finalTitle += ` (+${validItems.length - 1} more items)`;
          }
        } else {
          finalTitle = 'Sales Transaction';
        }
      }

      // Main category (take category of first item or General)
      const primaryCategory = validItems.length > 0 ? validItems[0].category : 'Retail';

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(grandTotal.toFixed(2)),
          currency,
          description: finalTitle,
          category: primaryCategory,
          date,
          time,
          receipt_url: finalReceiptUrl,
          notes: notes.trim(),
          items: validItems.map(it => ({
            name: it.name.trim() || 'Item',
            category: it.category,
            qty: parseFloat(it.qty) || 1,
            price: parseFloat(it.price) || 0,
            total: Number(((parseFloat(it.qty) || 1) * (parseFloat(it.price) || 0)).toFixed(2))
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record sales entry');

      // Success
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reset
      setTransactionTitle('');
      setNotes('');
      setItems([DEFAULT_ITEM()]);
      clearReceipt();

      onSaleAdded(data.sale);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 mb-8">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ListPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Record Sales Entry (Itemized Table)</h2>
            <p className="text-xs text-slate-500">Add multiple items per sale, calculate totals, and attach receipts</p>
          </div>
        </div>

        {success && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 animate-in fade-in">
            <CheckCircle className="w-4 h-4" /> Entry Saved!
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top Metadata Row: Transaction Title, Date, Time, Receipt Upload */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Title / Customer / Merchant (Optional)
            </label>
            <div className="relative">
              <Receipt className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={transactionTitle}
                onChange={(e) => setTransactionTitle(e.target.value)}
                placeholder="e.g. Afternoon Retail Batch, Client Invoice #102"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="md:col-span-3">
            {!receiptPreview ? (
              <label className="cursor-pointer border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs text-slate-600 transition h-[38px]">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Scan / Attach Receipt</span>
              </label>
            ) : (
              <div className="flex items-center gap-2 p-1.5 border border-slate-200 rounded-xl bg-slate-50 h-[38px]">
                <img
                  src={receiptPreview}
                  alt="Receipt Preview"
                  className="w-7 h-7 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <span className="text-[11px] text-slate-700 truncate flex-1 font-medium">
                  {receiptFile?.name || 'receipt.jpg'}
                </span>
                <button
                  type="button"
                  onClick={clearReceipt}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* OCR Result Banner */}
        {ocrMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex-1">{ocrMessage}</span>
          </div>
        )}

        {/* The Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Item / Description</th>
                <th className="py-2.5 px-3 w-36">Category</th>
                <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                <th className="py-2.5 px-3 w-28 text-right">Line Total</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.map((it, idx) => {
                const lineTotal = (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0);

                return (
                  <tr key={it.id || idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    {/* Item Description */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={it.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Wireless Mouse, Consultation, Coffee"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>

                    {/* Category */}
                    <td className="py-2 px-3">
                      <select
                        value={it.category}
                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:border-emerald-500"
                      >
                        <option value="Retail">Retail</option>
                        <option value="Services">Services</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Online">Online</option>
                        <option value="General">General</option>
                      </select>
                    </td>

                    {/* Quantity */}
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={it.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center outline-none focus:border-emerald-500"
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="py-2 px-3">
                      <div className="relative">
                        <span className="absolute left-2 top-1.5 text-slate-400 text-xs font-semibold">
                          {currency}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={it.price}
                          onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right font-medium outline-none focus:border-emerald-500"
                        />
                      </div>
                    </td>

                    {/* Line Total */}
                    <td className="py-2 px-3 text-right font-bold text-slate-800">
                      {currency}{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Delete Row */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-md transition"
                        title="Remove row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer with Add Row Button and Grand Total */}
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200">
                <td colSpan={4} className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item Row</span>
                  </button>
                </td>
                <td className="py-2.5 px-3 text-right text-xs font-bold text-slate-600 uppercase">
                  Grand Total:
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-base text-emerald-700">
                  {currency}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes & Save Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add general transaction note (optional)..."
            className="w-full sm:w-1/2 px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={submitting || ocrLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Entry...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Save Sales Entry ({currency}{grandTotal.toFixed(2)})
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
