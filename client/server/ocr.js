const { createWorker } = require('tesseract.js');
const fs = require('fs');

async function parseReceiptImage(imagePath) {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const ret = await worker.recognize(imagePath);
    await worker.terminate();

    const text = ret.data.text || '';
    const parsed = extractReceiptData(text);
    return {
      success: true,
      rawText: text,
      extracted: parsed
    };
  } catch (err) {
    if (worker) {
      try {
        await worker.terminate();
      } catch (e) {}
    }
    console.error('OCR Parsing error:', err);
    return {
      success: false,
      error: err.message,
      rawText: '',
      extracted: {
        amount: null,
        date: null,
        description: ''
      }
    };
  }
}

function extractReceiptData(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let amount = null;
  let date = null;
  let description = '';

  // 1. Merchant / Store Description heuristic: first 1-3 non-empty lines usually have the business name
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i];
    // skip lines that look purely like phone numbers or addresses
    if (!/^\d{3,}/.test(line) && line.length > 2 && !/total|receipt|welcome|tax/i.test(line)) {
      description = line.replace(/[^\w\s&'-]/gi, '').trim();
      break;
    }
  }
  if (!description && lines.length > 0) {
    description = lines[0].slice(0, 40);
  }

  // 2. Amount heuristic:
  // Look for lines with 'total', 'subtotal', 'amount', 'balance', 'due', 'charge', 'cash', 'card'
  const totalRegex = /(?:total|amount|due|balance|net|sum|subtotal|charge|paid)[^\d]*([$€£₦¥]?\s*[\d,]+\.\d{2})/i;
  const anyMoneyRegex = /[$€£₦¥]?\s*(\d{1,3}(?:,\d{3})*|\d+)\.(\d{2})\b/g;

  // First check lines explicitly mentioning Total/Amount
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const match = line.match(totalRegex);
    if (match) {
      const cleanNum = match[1].replace(/[$€£₦¥,\s]/g, '');
      const parsedVal = parseFloat(cleanNum);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        amount = parsedVal;
        break;
      }
    }
  }

  // Fallback: search all monetary values and pick the highest one (often the total on a receipt)
  if (amount === null) {
    let maxVal = 0;
    for (const line of lines) {
      let match;
      while ((match = anyMoneyRegex.exec(line)) !== null) {
        const cleanNum = match[0].replace(/[$€£₦¥,\s]/g, '');
        const val = parseFloat(cleanNum);
        if (!isNaN(val) && val > maxVal) {
          maxVal = val;
        }
      }
    }
    if (maxVal > 0) {
      amount = maxVal;
    }
  }

  // 3. Date heuristic:
  // Matches formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, DD-MM-YYYY
  const dateRegex = /\b(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/;
  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      const rawDateStr = match[1];
      const parsedDate = tryNormalizeDate(rawDateStr);
      if (parsedDate) {
        date = parsedDate;
        break;
      }
    }
  }

  // Default date to today if none detected
  if (!date) {
    date = new Date().toISOString().split('T')[0];
  }

  return {
    amount: amount !== null ? amount : '',
    date: date,
    description: description || 'Receipt Purchase'
  };
}

function tryNormalizeDate(str) {
  try {
    const parts = str.split(/[-/.]/);
    if (parts.length === 3) {
      let y, m, d;
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        y = parts[0];
        m = parts[1].padStart(2, '0');
        d = parts[2].padStart(2, '0');
      } else {
        // MM/DD/YYYY or DD/MM/YYYY
        let part3 = parts[2];
        if (part3.length === 2) part3 = '20' + part3;
        y = part3;
        m = parts[0].padStart(2, '0');
        d = parts[1].padStart(2, '0');
      }
      return `${y}-${m}-${d}`;
    }
  } catch (e) {}
  return null;
}

module.exports = {
  parseReceiptImage
};

