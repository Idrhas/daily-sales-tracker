import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
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
  Loader2
} from 'lucide-react';

export default function SalesEntryForm({ onSaleAdded, token, currency = '$' }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Retail');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toTimeString().split(' ')[0].substring(0, 5);
  });
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState(null);

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
    setError(null);

    // Auto-run OCR scanning on receipt upload for convenience
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
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process receipt');

      setUploadedReceiptUrl(data.fileUrl);

      if (data.ocr && data.ocr.extracted) {
        const { amount: ocrAmt, date: ocrDate, description: ocrDesc } = data.ocr.extracted;
        let detected = [];

        if (ocrAmt) {
          setAmount(String(ocrAmt));
          detected.push(`Amount: ${currency}${ocrAmt}`);
        }
        if (ocrDate) {
          setDate(ocrDate);
          detected.push(`Date: ${ocrDate}`);
        }
        if (ocrDesc) {
          setDescription(ocrDesc);
          detected.push(`Merchant: "${ocrDesc}"`);
        }

        if (detected.length > 0) {
          setOcrMessage(`Successfully extracted details: ${detected.join(', ')}`);
        } else {
          setOcrMessage('Receipt uploaded. Image text scanned (review details below).');
        }
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setOcrMessage('Receipt uploaded, but automatic text extraction was incomplete. Please verify the amount manually.');
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
    if (!amount || !description) {
      setError('Please provide an amount and description');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let finalReceiptUrl = uploadedReceiptUrl;

      // If a file was selected but not uploaded yet (in case of OCR failure or quick submit)
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

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          description: description.trim(),
          category,
          date,
          time,
          receipt_url: finalReceiptUrl,
          notes: notes.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record sale');

      // Success
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);

      // Reset form
      setAmount('');
      setDescription('');
      setNotes('');
      clearReceipt();

      // Refresh parent sales list
      onSaleAdded(data.sale);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 mb-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Record New Sale</h2>
            <p className="text-xs text-slate-500">Enter numbers, describe sale, or upload receipt photo</p>
          </div>
        </div>

        {success && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 animate-in fade-in">
            <CheckCircle className="w-4 h-4" /> Sale Recorded!
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Amount */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount ({currency}) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-sm font-semibold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Item *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. In-store retail sale, Coffee, Wholesale order"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="Retail">Retail</option>
                <option value="Services">Services</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Online">Online</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Time */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Time
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Receipt Upload & OCR Trigger */}
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Receipt Picture (Auto-converts to sales numbers)</span>
              {receiptPreview && (
                <button
                  type="button"
                  onClick={clearReceipt}
                  className="text-red-500 hover:text-red-700 text-[10px] flex items-center gap-0.5"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
            </label>

            {!receiptPreview ? (
              <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-xl p-2.5 flex items-center justify-center gap-2 text-xs text-slate-600 transition group">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition" />
                <span>Upload receipt photo (auto-extracts amount)</span>
              </label>
            ) : (
              <div className="flex items-center gap-3 p-2 border border-slate-200 rounded-xl bg-slate-50">
                <img
                  src={receiptPreview}
                  alt="Receipt Preview"
                  className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 truncate">
                    {receiptFile?.name || 'receipt-image.jpg'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {ocrLoading ? 'Extracting receipt text...' : 'Receipt attached'}
                  </p>
                </div>
                {ocrLoading && (
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin mr-2" />
                )}
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

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting || ocrLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Recording...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Save Sales Entry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

