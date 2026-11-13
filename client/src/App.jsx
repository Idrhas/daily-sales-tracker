import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AnalyticsCards from './components/AnalyticsCards';
import SalesEntryForm from './components/SalesEntryForm';
import SalesList from './components/SalesList';
import ReceiptModal from './components/ReceiptModal';
import AuditModal from './components/AuditModal';
import BackupModal from './components/BackupModal';
import ShareModal from './components/ShareModal';
import AdminLoginCard from './components/AdminLoginCard';

export default function App() {
  const checkIsAdmin = () => {
    const path = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    return path.includes('admin') || hash.includes('admin') || search.includes('admin');
  };

  // Route state
  const [isAdminView, setIsAdminView] = useState(checkIsAdmin);

  // Auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sales_tracker_token'));

  // Sales Data & Filters
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({ totalAmount: 0, totalCash: 0, totalCard: 0, totalOther: 0, count: 0, averageAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [activeAuditSale, setActiveAuditSale] = useState(null);
  const [shareToken, setShareToken] = useState('');

  // 1. Listen to popstate / hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(checkIsAdmin());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // 2. Check stored session
  useEffect(() => {
    const storedUser = localStorage.getItem('sales_tracker_user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, [token]);

  // 3. Fetch Share Token for Admin
  const fetchShareToken = useCallback(async () => {
    if (!token || !isAdminView) return;
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
  }, [token, isAdminView]);

  useEffect(() => {
    if (token && isAdminView) {
      fetchShareToken();
    }
  }, [token, isAdminView, fetchShareToken]);

  // 4. Fetch Sales Data with Local Cache Merging
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

      if (isAdminView && token) {
        endpoint = `/api/sales?${queryParams.toString()}`;
        headers = { Authorization: `Bearer ${token}` };
      } else {
        endpoint = `/api/sales/public?${queryParams.toString()}`;
      }

      const res = await fetch(endpoint, { headers });
      if (res.status === 401 && isAdminView) {
        localStorage.removeItem('sales_tracker_token');
        localStorage.removeItem('sales_tracker_user');
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSales(data.sales || []);
      setStats(data.stats || { totalAmount: 0, totalCash: 0, totalCard: 0, totalOther: 0, count: 0, averageAmount: 0 });
    } catch (err) {
      console.error('Fetch sales error:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, customStart, customEnd, search, sortBy, sortOrder, isAdminView, token]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleSaleAdded = () => {
    fetchSales();
  };

  // Navigation helpers
  const goToPublic = (e) => {
    if (e) e.preventDefault();
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
  };

  const goToAdmin = (e) => {
    if (e) e.preventDefault();
    window.history.pushState({}, '', '/admin');
    setIsAdminView(true);
  };

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser, userToken) => {
    setUser(loggedInUser);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('sales_tracker_token');
    localStorage.removeItem('sales_tracker_user');
    setToken(null);
    setUser(null);
  };

  const handleDeleteSale = async (id) => {
    if (!window.confirm('Delete this sales record? This will be permanently recorded in the audit log.')) {
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

  const handleExportCsv = () => {
    window.location.href = `/api/sales/export/csv?token=${token}`;
  };

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
        isAdmin={isAdminView && !!token}
        onLogout={handleLogout}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenBackups={() => setIsBackupOpen(true)}
        onGoToPublic={goToPublic}
        onGoToAdmin={goToAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* If user is at /admin but not signed in -> show Admin Login Form */}
        {isAdminView && !token ? (
          <AdminLoginCard
            onLoginSuccess={handleLoginSuccess}
            onGoToPublic={goToPublic}
          />
        ) : (
          <>
            {/* Analytics Summary Cards (Revenue, Cash, Card, Transfers) */}
            <AnalyticsCards stats={stats} sales={sales} currency="$" />

            {/* Sales Input Form: ONLY visible when logged in to /admin */}
            {isAdminView && token && (
              <SalesEntryForm
                onSaleAdded={handleSaleAdded}
                token={token}
                currency="$"
              />
            )}

            {/* Sales Table with Date Filters, Sorting, Search, and Itemized Expanders */}
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
              isReadOnly={!isAdminView || !token}
              currency="$"
              onExportCsv={handleExportCsv}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <span>Daily Sales Tracker • Verified Records & Immutable Audit Trails</span>
          {!isAdminView ? (
            <a
              href="/admin"
              onClick={goToAdmin}
              className="text-slate-400 hover:text-slate-600 transition ml-2"
              title="Admin Portal"
            >
              • Admin Portal
            </a>
          ) : (
            <a
              href="/"
              onClick={goToPublic}
              className="text-slate-400 hover:text-slate-600 transition ml-2"
            >
              • Public View
            </a>
          )}
        </div>
      </footer>

      {/* Modals (Only accessible when logged in as admin) */}
      {isAdminView && token && (
        <>
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

          <AuditModal
            sale={activeAuditSale}
            token={token}
            onClose={() => setActiveAuditSale(null)}
          />
        </>
      )}

      {/* Lightbox for receipt photos (accessible to all) */}
      <ReceiptModal
        imageUrl={activeReceipt?.url}
        description={activeReceipt?.description}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}
