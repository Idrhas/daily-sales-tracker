import React, { useState, useRef, useEffect } from 'react';
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
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  AlertCircle
} from 'lucide-react';

const DEFAULT_ITEM = () => ({
  id: Date.now() + Math.random(),
  name: '',
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
  
  // Itemized List
  const [items, setItems] = useState([DEFAULT_ITEM()]);

  // Payment Breakdown
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [otherAmount, setOtherAmount] = useState('');
  const [otherName, setOtherName] = useState('Bank Transfer');

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

  // Compute total paid across payment methods
  const cAmt = parseFloat(cashAmount) || 0;
  const kAmt = parseFloat(cardAmount) || 0;
  const oAmt = parseFloat(otherAmount) || 0;
  const totalPaid = cAmt + kAmt + oAmt;
  const difference = grandTotal - totalPaid;
  const effectiveFinalTotal = grandTotal > 0 ? grandTotal : totalPaid;

  // Auto-sync cash amount if user hasn't typed a custom payment split
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
      setItems([DEFAULT_ITEM()]);
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Payment quick-action buttons
  const setAllCash = () => {
    setCashAmount(grandTotal > 0 ? grandTotal.toFixed(2) : '');
    setCardAmount('');
    setOtherAmount('');
  };

  const setAllCard = () => {
    setCardAmount(grandTotal > 0 ? grandTotal.toFixed(2) : '');
    setCashAmount('');
    setOtherAmount('');
  };

  const setAllOther = () => {
    setOtherAmount(grandTotal > 0 ? grandTotal.toFixed(2) : '');
    setCashAmount('');
    setCardAmount('');
  };

  const setSplitEvenly = () => {
    const half = (grandTotal / 2).toFixed(2);
    setCashAmount(half);
    setCardAmount(half);
    setOtherAmount('');
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
          setItems([
            {
              id: Date.now(),
              name: ocrDesc || 'Scanned Item',
              qty: 1,
              price: String(ocrAmt)
            }
          ]);
          setCashAmount(String(ocrAmt));
          detected.push(`Total: ${currency}${ocrAmt}`);
        }

        if (detected.length > 0) {
          setOcrMessage(`Proof OCR Extracted: ${detected.join(', ')}`);
        } else {
          setOcrMessage('Proof image attached successfully.');
        }
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setOcrMessage('Proof image attached. Please verify or enter item rows manually.');
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

    const validItems = items.filter(it => it.name.trim() !== '' || (parseFloat(it.price) > 0));
    let finalCash = parseFloat(cashAmount) || 0;
    let finalCard = parseFloat(cardAmount) || 0;
    let finalOther = parseFloat(otherAmount) || 0;
    const computedTotal = grandTotal > 0 ? grandTotal : (finalCash + finalCard + finalOther);

    if (validItems.length === 0 && computedTotal <= 0) {
      setError('Please add item details or enter a cash/card payment amount');
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

      // Default category to General as category selection is removed from entry form
      const primaryCategory = 'General';

      // Default payment to full Cash if none entered
      if (finalCash === 0 && finalCard === 0 && finalOther === 0) {
        finalCash = computedTotal;
      }

      let paymentMethod = 'Cash';
      if (finalCard > 0 && finalCash > 0) paymentMethod = 'Split';
      else if (finalCard > 0 && finalOther > 0) paymentMethod = 'Split';
      else if (finalCash > 0 && finalOther > 0) paymentMethod = 'Split';
      else if (finalCard > 0) paymentMethod = 'Card';
      else if (finalOther > 0) paymentMethod = otherName || 'Transfer';
      else paymentMethod = 'Cash';

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(computedTotal.toFixed(2)),
          currency,
          description: finalTitle,
          category: primaryCategory,
          date,
          time,
          receipt_url: finalReceiptUrl,
          proof_url: finalReceiptUrl,
          notes: notes.trim(),
          items: validItems.map(it => ({
            name: it.name.trim() || 'Item',
            category: 'General',
            qty: parseFloat(it.qty) || 1,
            price: parseFloat(it.price) || 0,
            total: Number(((parseFloat(it.qty) || 1) * (parseFloat(it.price) || 0)).toFixed(2))
          })),
          cash_amount: finalCash,
          card_amount: finalCard,
          other_amount: finalOther,
          other_payment_name: otherName,
          payment_method: paymentMethod
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
      setCashAmount('');
      setCardAmount('');
      setOtherAmount('');
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
            <h2 className="text-sm font-bold text-slate-900">Record Sales Entry (Items & Payment Breakdown)</h2>
            <p className="text-xs text-slate-500">Enter itemized sales, upload proof image, and specify Cash, Card, or Transfer</p>
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
        {/* Top Metadata: Title, Date, Time, Receipt */}
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
                placeholder="e.g. Daily Counter Sales, Customer Invoice #104"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Proof Upload (Single Image)</span>
              <span className="text-[10px] text-slate-400 font-normal">JPG, PNG, WEBP</span>
            </label>
            {!receiptPreview ? (
              <label className="cursor-pointer border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs text-slate-600 transition h-[38px] group">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple={false}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate font-medium text-slate-700">Upload Proof Image</span>
              </label>
            ) : (
              <div className="flex items-center gap-2 p-1.5 border border-emerald-300 bg-emerald-50/50 rounded-xl h-[38px]">
                <img
                  src={receiptPreview}
                  alt="Proof Preview"
                  className="w-7 h-7 object-cover rounded-lg border border-emerald-300 shrink-0 cursor-pointer hover:opacity-80 transition"
                  onClick={() => window.open(receiptPreview, '_blank')}
                  title="Click to view full image in new tab"
                />
                <span className="text-[11px] text-slate-800 truncate flex-1 font-medium">
                  {receiptFile?.name || 'proof-image.jpg'}
                </span>
                <button
                  type="button"
                  onClick={() => window.open(receiptPreview, '_blank')}
                  className="text-emerald-700 hover:text-emerald-900 p-1 text-[11px] font-semibold"
                  title="View full proof image"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={clearReceipt}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove proof image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {ocrMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex-1">{ocrMessage}</span>
          </div>
        )}

        {/* The Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Item / Description</th>
                <th className="py-2.5 px-3 w-24 text-center">Qty</th>
                <th className="py-2.5 px-3 w-32 text-right">Unit Price</th>
                <th className="py-2.5 px-3 w-32 text-right">Line Total</th>
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

                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={it.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        placeholder="e.g. Wireless Mouse, Consultation, Coffee"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>

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

                    <td className="py-2 px-3 text-right font-bold text-slate-800">
                      {currency}{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

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
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200">
                <td colSpan={3} className="py-2.5 px-3">
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
                  Sales Grand Total:
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-base text-emerald-700">
                  {currency}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* PAYMENT METHOD BREAKDOWN (CASH, CARD, OTHER) */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/90 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Payment Method Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">
                Specify amounts received in Cash, Card, or Transfers/Other
              </p>
            </div>

            {/* Quick Fill Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400 mr-1 font-medium">Quick Fill:</span>
              <button
                type="button"
                onClick={setAllCash}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-[11px] font-medium transition"
              >
                All Cash
              </button>
              <button
                type="button"
                onClick={setAllCard}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-lg text-[11px] font-medium transition"
              >
                All Card
              </button>
              <button
                type="button"
                onClick={setAllOther}
                className="px-2.5 py-1 bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 border border-slate-200 rounded-lg text-[11px] font-medium transition"
              >
                All Transfer
              </button>
              <button
                type="button"
                onClick={setSplitEvenly}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium transition"
              >
                Split 50/50
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Cash */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Banknote className="w-4 h-4 text-emerald-600" /> Cash Received
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Physical bills</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Card / POS */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-800">
                  <CreditCard className="w-4 h-4 text-blue-600" /> Card / POS
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Debit / Credit</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Other / Transfer */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-purple-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-purple-600" /> Other Payment
                </span>
                <select
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  className="text-[11px] font-medium border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 text-slate-700 outline-none"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Zelle / CashApp">Zelle / CashApp</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Online Portal">Online Portal</option>
                  <option value="Store Credit">Store Credit</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">{currency}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={otherAmount}
                  onChange={(e) => setOtherAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Reconciliation & Final Total Status Bar */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 text-xs gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-600 font-semibold text-[11px] uppercase tracking-wider">Payment Breakdown:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/90 text-emerald-900 font-bold border border-emerald-300">
                <Banknote className="w-3.5 h-3.5 text-emerald-700" /> Cash: {currency}{cAmt.toFixed(2)}
              </span>
              <span className="text-slate-400 font-bold">+</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100/90 text-blue-900 font-bold border border-blue-300">
                <CreditCard className="w-3.5 h-3.5 text-blue-700" /> Card: {currency}{kAmt.toFixed(2)}
              </span>
              {oAmt > 0 && (
                <>
                  <span className="text-slate-400 font-bold">+</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100/80 text-purple-900 font-bold border border-purple-300">
                    <Smartphone className="w-3.5 h-3.5 text-purple-700" /> Other: {currency}{oAmt.toFixed(2)}
                  </span>
                </>
              )}
              <span className="text-slate-400 font-bold">=</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-700 text-white font-extrabold shadow-2xs text-xs">
                Final Total: {currency}{effectiveFinalTotal.toFixed(2)}
              </span>
            </div>

            {grandTotal > 0 && (
              <div>
                {Math.abs(difference) < 0.01 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" /> Balanced with Items Total
                  </span>
                ) : difference > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" /> Remaining: {currency}{difference.toFixed(2)} (or will default to Cash)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    Overallocated: +{currency}{Math.abs(difference).toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transaction Notes & Submit Button */}
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
                <CheckCircle className="w-4 h-4" /> Save Sales Entry (Final Total: {currency}{effectiveFinalTotal.toFixed(2)})
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
