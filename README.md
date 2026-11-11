# Daily Sales Tracker & Receipt Management System

A simple, fast, and responsive web application designed for daily sales logging, receipt photo conversion (OCR), immutable audit trails, public read-only sharing, and automated cloud backups.

---

## 🚀 Quick Start

### 1. Start the Website
From the project folder, run:
```bash
npm start
```
The application will launch at: **`http://localhost:5000`**

*(Optional for frontend development mode: `npm run dev:client`)*

### 2. Default Login
- **Username:** `admin`
- **Password:** `admin`

---

## ✨ Features Implemented

### 1. Daily Login (Multiple times per day)
- Persistent authentication with secure JWT tokens.
- Stay signed in throughout the day on mobile or desktop for quick access anytime a sale occurs.

### 2. Rapid Sales Entry
- Record Amount, Description, Category, Date, and Time.
- Supports attaching receipt photos with a live preview.
- Keyboard shortcuts for rapid data entry.

### 3. Immutable Upload Timestamps & Full Audit Trail
- **Server-Enforced `created_at`**: Recorded by the server clock at the exact millisecond of upload; cannot be altered or falsified.
- **Audit History**: Any subsequent update or edit logs who made the change, the exact time, the old values, and the new values. Click the **Shield / Timestamp** badge on any row to inspect its proof of record.

### 4. Receipt Photo Scanning & OCR Conversion
- Upload receipt or take a camera snap.
- Built-in OCR engine scans the image and automatically extracts:
  - Total purchase amount
  - Purchase date
  - Store / Merchant name
- Pre-fills the form for 1-click confirmation while archiving the receipt photo.
- Click **"View Photo"** to open a high-res lightbox of the receipt.

### 5. Read-Only Public Sharing
- Click **"Share Link"** in the top navigation to copy a tokenized viewer link (e.g. `http://localhost:5000/?token=...`).
- Anyone with the link can view live sales records, inspect receipts, and sort/filter data.
- **Strictly read-only**: Viewers cannot edit, delete, or alter records.

### 6. Dynamic Date Sorting & Analytics
- Filter pills: **Today**, **This Week**, **This Month**, **All Time**, or **Custom Date Range**.
- Sort by Date (newest/oldest), Amount (highest/lowest), or Description.
- Summary Cards: Total Revenue, Transactions Count, Average Sale, and Top Categories breakdown.
- **Export to CSV**: Download sales sheets directly into Excel/Google Sheets.

### 7. Automated Cloud & Local Backups
- Automatic background schedule (configurable: Hourly, Every 6 Hours, Daily at Midnight, or Weekly).
- **Instant Backup**: One-click download of a `.zip` archive containing the SQLite database, full CSV spreadsheet, and all receipt images.
- **Cloud Sync Support**:
  - **Local Dropbox / Google Drive Folder**: Specify your Dropbox or Google Drive desktop folder path, and all backups automatically duplicate there.
  - **Dropbox API**: Option to input a Dropbox Access Token for direct cloud API uploads.

### 8. Aesthetic, Responsive Design
- Built with Tailwind CSS, Lucide icons, and modern design principles.
- Fully responsive on smartphones, tablets, and desktop displays.

