import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AnalyticsCards from './components/AnalyticsCards';
import SalesEntryForm from './components/SalesEntryForm';
import SalesList from './components/SalesList';
import ReceiptModal from './components/ReceiptModal';
import AuditModal from './components/AuditModal';
import BackupModal from './components/BackupModal';
import ShareModal from './components/ShareModal';
import LoginModal from './components/LoginModal';

export default function App() {
  // Auth & View state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sales_tracker_token'));
  const [readOnlyToken, setReadOnlyToken] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Sales Data & Filters
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({ totalAmount: 0, count: 0, averageAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null); // { url, description }
  const [activeAuditSale, setActiveAuditSale] = useState(null);
  const [shareToken, setShareToken] = useState('');

  // 1. Initial URL inspection for share link (`?token=...`)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedTokenParam = urlParams.get('token');

    if (sharedTokenParam) {
      setReadOnlyToken(sharedTokenParam);
      setIsReadOnly(true);
    } else {
      // Check stored user session
      const storedUser = localStorage.getItem('sales_tracker_user');
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    }
  }, []);

  // 2. Fetch Share Token for Admin
  const fetchShareToken = useCallback(async () => {
    if (!token || isReadOnly) return;
    try {
      const res = await fetch('/api/share/token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setShareToken(data.token);
      }
    } catch (err) {
      console.error('Failed to fetch share token:', err);
    }
  }, [token, isReadOnly]);

  useEffect(() => {
    if (token && !isReadOnly) {
      fetchShareToken();
    }
  }, [token, isReadOnly, fetchShareToken]);

  // 3. Fetch Sales Data (either authenticated or read-only)
  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let headers = {};

      const queryParams = new URLSearchParams({
        filter,
        search,
        sortBy,
        sortOrder
      });
      if (filter === 'custom' && customStart && customEnd) {
        queryParams.set('startDate', customStart);
        queryParams.set('endDate', customEnd);
      }

      if (isReadOnly && readOnlyToken) {
        queryParams.set('token', readOnlyToken);
        endpoint = `/api/share/data?${queryParams.toString()}`;
      } else if (token) {
        endpoint = `/api/sales?${queryParams.toString()}`;
        headers = { Authorization: `Bearer ${token}` };
      } else {
        // Not authenticated and no share token: prompt login
        setLoading(false);
        setSales([]);
        setIsLoginOpen(true);
        return;
      }

      const res = await fetch(endpoint, { headers });
      if (res.status === 401 || res.status === 403) {
        if (!isReadOnly) {
          localStorage.removeItem('sales_tracker_token');
          localStorage.removeItem('sales_tracker_user');
          setToken(null);
          setUser(null);
          setIsLoginOpen(true);
        }
        setSales([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSales(data.sales || []);
      setStats(data.stats || { totalAmount: 0, count: 0, averageAmount: 0 });
    } catch (err) {
      console.error('Fetch sales error:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, customStart, customEnd, search, sortBy, sortOrder, isReadOnly, readOnlyToken, token]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Handle Login Success
  const handleLoginSuccess = (loggedInUser, userToken) => {
    setUser(loggedInUser);
    setToken(userToken);
    setIsReadOnly(false);
    // Remove ?token from URL if was in read-only mode
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('sales_tracker_token');
    localStorage.removeItem('sales_tracker_user');
    setToken(null);
    setUser(null);
    setSales([]);
    setIsLoginOpen(true);
  };

  // Handle Delete Sale
  const handleDeleteSale = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sales record? This action will be permanently recorded in the audit log.')) {
      return;
    }
    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSales();
      } else {
        alert('Failed to delete sale');
      }
    } catch (err) {
      alert('Network error deleting sale: ' + err.message);
    }
  };

  // Handle CSV Export
  const handleExportCsv = () => {
    window.location.href = `/api/sales/export/csv?token=${token}`;
  };

  // Handle Regenerate Share Token
  const handleRegenerateShareToken = async () => {
    try {
      const res = await fetch('/api/share/token/regenerate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setShareToken(data.token);
      }
    } catch (err) {
      alert('Failed to regenerate token');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Header
        user={user}
        isReadOnly={isReadOnly}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenBackups={() => setIsBackupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Read-Only Notice Banner if viewing via shared link */}
        {isReadOnly && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>
                You are viewing the <strong>Shared Sales Sheet</strong> in verified Read-Only mode. All numbers, dates, receipts, and summaries are live.
              </span>
            </div>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-amber-800 underline font-semibold hover:text-amber-950 ml-4 shrink-0"
            >
              Sign In with Admin Account
            </button>
          </div>
        )}

        {/* Analytics Summary Cards */}
        <AnalyticsCards stats={stats} sales={sales} currency="$" />

        {/* Sales Input & Receipt OCR Upload Form (Hidden in Read-Only Mode) */}
        {!isReadOnly && token && (
          <SalesEntryForm
            onSaleAdded={() => fetchSales()}
            token={token}
            currency="$"
          />
        )}

        {/* Sales Sheet / Table with Date Filters, Sorting, Search, and Audit Trail */}
        <SalesList
          sales={sales}
          loading={loading}
          filter={filter}
          onFilterChange={(newFilter) => setFilter(newFilter)}
          customStart={customStart}
          customEnd={customEnd}
          onCustomDateChange={(s, e) => {
            setCustomStart(s);
            setCustomEnd(e);
          }}
          search={search}
          onSearchChange={(val) => setSearch(val)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col);
            setSortOrder(order);
          }}
          onDeleteSale={handleDeleteSale}
          onOpenReceipt={(url, desc) => setActiveReceipt({ url, description: desc })}
          onOpenAudit={(s) => setActiveAuditSale(s)}
          isReadOnly={isReadOnly}
          currency="$"
          onExportCsv={handleExportCsv}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>Daily Sales Tracker • Immutable Audit Trails & Cloud Backups</p>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareToken={shareToken}
        onRegenerateToken={handleRegenerateShareToken}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        token={token}
      />

      <ReceiptModal
        imageUrl={activeReceipt?.url}
        description={activeReceipt?.description}
        onClose={() => setActiveReceipt(null)}
      />

      <AuditModal
        sale={activeAuditSale}
        token={token}
        onClose={() => setActiveAuditSale(null)}
      />
    </div>
  );
}

