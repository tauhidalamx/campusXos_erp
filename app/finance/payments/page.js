'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Loader2, 
  TrendingUp, 
  PieChart, 
  Layers, 
  ShieldAlert,
  Building,
  QrCode,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminPaymentsControl() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState({});
  const [dashboardData, setDashboardData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('VERIFICATION_PENDING');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeTab, setActiveTab] = useState('verification'); // 'verification', 'refunds', 'accounts', 'reports', 'audit'

  // Modal / Verification Details
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Bank & QR Form states
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [accHolder, setAccHolder] = useState('');
  const [accNum, setAccNum] = useState('');
  const [accIfsc, setAccIfsc] = useState('');
  const [accSwift, setAccSwift] = useState('');
  const [accBranch, setAccBranch] = useState('');
  const [accUpi, setAccUpi] = useState('');
  const [accCategory, setAccCategory] = useState('PRIMARY');
  const [accIsPrimary, setAccIsPrimary] = useState(false);

  const [showQrForm, setShowQrForm] = useState(false);
  const [qrName, setQrName] = useState('');
  const [qrType, setQrType] = useState('UPI_QR');
  const [qrUpi, setQrUpi] = useState('');
  const [qrAccountId, setQrAccountId] = useState('');

  // Chart canvas refs
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        setCurrentUser(JSON.parse(session));
      } else {
        setCurrentUser({ id: 'USR_DEAN', name: 'Dr. Evelyn Sterling', role: 'admin' });
      }
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Dashboard analytics
      const dashRes = await fetch('/api/payments/dashboard');
      const dashData = await dashRes.json();
      if (dashData && !dashData.error) {
        setDashboardData(dashData);
      }

      // 2. Fetch payments list
      const payRes = await fetch('/api/payments');
      const payData = await payRes.json();
      if (Array.isArray(payData)) {
        setPayments(payData);
      } else {
        setPayments([]);
      }

      // 3. Fetch refunds list
      const refRes = await fetch('/api/refunds');
      const refData = await refRes.json();
      if (Array.isArray(refData)) {
        setRefunds(refData);
      } else {
        setRefunds([]);
      }

      // 4. Fetch bank accounts
      const bankRes = await fetch('/api/bank-accounts');
      const bankData = await bankRes.json();
      if (Array.isArray(bankData)) {
        setBankAccounts(bankData);
      } else {
        setBankAccounts([]);
      }

      // 5. Fetch QR codes
      const qrRes = await fetch('/api/qr-codes');
      const qrData = await qrRes.json();
      if (Array.isArray(qrData)) {
        setQrCodes(qrData);
      } else {
        setQrCodes([]);
      }

      // 6. Fetch payment audit logs
      const auditRes = await fetch('/api/payments/audit-logs');
      const auditData = await auditRes.json();
      if (Array.isArray(auditData)) {
        setAuditLogs(auditData);
      } else {
        setAuditLogs([]);
      }

    } catch (err) {
      console.error('Error fetching admin finance dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render Chart.js analytics when dashboard data changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Chart || !chartRef.current || !dashboardData) return;
    const Chart = window.Chart;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const categories = dashboardData.charts.categoryRevenue || [];
    const labels = categories.map(c => c.fee_type);
    const totals = categories.map(c => c.total);

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['TUITION', 'HOSTEL', 'MESS', 'TRANSPORT'],
        datasets: [{
          label: 'Fee Ingestions ($)',
          data: totals.length > 0 ? totals : [4500, 1500, 800, 400],
          backgroundColor: [
            'rgba(99, 102, 241, 0.65)',
            'rgba(16, 185, 129, 0.65)',
            'rgba(245, 158, 11, 0.65)',
            'rgba(239, 68, 68, 0.65)',
          ],
          borderColor: [
            'rgb(99, 102, 241)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 1.5,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dashboardData, activeTab]);

  // Payment filtering
  const filteredPayments = payments.filter(pay => {
    const matchesSearch = searchTerm === '' || 
      (pay.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pay.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pay.utr_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pay.transaction_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || pay.status === statusFilter;
    const matchesCategory = categoryFilter === '' || pay.fee_type === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Reconcile and Approve Payment
  const handleApprovePayment = async (paymentId) => {
    setBtnLoading(prev => ({ ...prev, [paymentId]: 'approve' }));
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: paymentId,
          admin_id: currentUser?.id || 'USR_DEAN',
          remarks: 'Manually verified via treasury dashboard'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Payment approved! Receipt issued: ${data.receipt_number}`);
        setSelectedPayment(null);
        loadAdminData();
      }
    } catch (err) {
      console.error('Error approving payment:', err);
    } finally {
      setBtnLoading(prev => ({ ...prev, [paymentId]: null }));
    }
  };

  // Reject / Flag Payment
  const handleRejectPayment = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Please state a reason for rejection.');
      return;
    }
    const paymentId = selectedPayment.id;
    setBtnLoading(prev => ({ ...prev, [paymentId]: 'reject' }));
    try {
      const res = await fetch('/api/payments/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: paymentId,
          admin_id: currentUser?.id || 'USR_DEAN',
          rejection_reason: rejectionReason
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Payment rejected and student notified.');
        setSelectedPayment(null);
        setShowRejectForm(false);
        setRejectionReason('');
        loadAdminData();
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
    } finally {
      setBtnLoading(prev => ({ ...prev, [paymentId]: null }));
    }
  };

  // Approve Refund
  const handleProcessRefund = async (refundId, status) => {
    setBtnLoading(prev => ({ ...prev, [refundId]: 'refund' }));
    try {
      const res = await fetch('/api/payments/refund/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refund_id: refundId,
          admin_id: currentUser?.id || 'USR_DEAN',
          status, // APPROVED or REJECTED or COMPLETED
          tx_hash: '0xref_tx_' + Math.random().toString(16).substring(2, 10)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Refund request marked as ${status}.`);
        loadAdminData();
      }
    } catch (err) {
      console.error('Error processing refund:', err);
    } finally {
      setBtnLoading(prev => ({ ...prev, [refundId]: null }));
    }
  };

  // Add Bank Account
  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bank-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_holder: accHolder,
          account_number: accNum,
          ifsc: accIfsc,
          swift: accSwift,
          branch: accBranch,
          upi_id: accUpi,
          category: accCategory,
          is_primary: accIsPrimary ? 1 : 0
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Bank account successfully saved.');
        setShowAccountForm(false);
        // Reset fields
        setAccHolder('');
        setAccNum('');
        setAccIfsc('');
        setAccSwift('');
        setAccBranch('');
        setAccUpi('');
        setAccIsPrimary(false);
        loadAdminData();
      }
    } catch (err) {
      console.error('Error adding bank account:', err);
    }
  };

  // Add QR Code
  const handleAddQr = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: qrName,
          type: qrType,
          upi_id: qrUpi,
          bank_account_id: qrAccountId
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('QR code configuration successfully saved.');
        setShowQrForm(false);
        setQrName('');
        setQrUpi('');
        setQrAccountId('');
        loadAdminData();
      }
    } catch (err) {
      console.error('Error adding QR code:', err);
    }
  };

  // Export Daily Collections to CSV
  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/payments/reports');
      const data = await res.json();
      
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Payment ID,Student ID,Student Name,Department,Category,Semester,Amount ($),Status,Method,UTR Number,Payment Date\n";
      
      data.forEach(p => {
        csvContent += `${p.id},${p.student_id},${p.student_name},${p.department},${p.fee_type},${p.semester},${p.amount},${p.status},${p.payment_method},${p.utr_number || 'N/A'},${p.payment_date}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `collections_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting collections report:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="ml-3 font-semibold">Loading Treasury Terminal...</span>
      </div>
    );
  }

  const { stats } = dashboardData;

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white animate-fade-in">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-brand-primary" />
            Treasury & Manual Payment Reconciliation
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            Validate manual bank slips, UPI screenshots, process student refund requests, and audit ledger balances.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="btn btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand-bg-tertiary border border-brand-border rounded-xl font-bold font-display cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-accent-emerald" />
            Export Collections CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Cumulative Reconciled Revenue</span>
          <span className="block text-2xl font-bold font-display text-white mt-1">
            ${stats.totalRevenue.toLocaleString()}
          </span>
          <span className="text-[10px] text-brand-accent-emerald mt-1 block">✓ All approved bank/UPI ledgers</span>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Verification Pending Queue</span>
          <span className="block text-2xl font-bold font-display text-brand-accent-amber mt-1">
            {stats.verificationPending} Payments
          </span>
          <span className="text-[10px] text-brand-text-muted mt-1 block">Awaiting receipt check</span>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Today's Collections</span>
          <span className="block text-2xl font-bold font-display text-brand-accent-cyan mt-1">
            ${stats.todayCollection.toLocaleString()}
          </span>
          <span className="text-[10px] text-brand-text-muted mt-1 block">Hourly bank reconciliation logs</span>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Refund Queue</span>
          <span className="block text-2xl font-bold font-display text-brand-accent-ruby mt-1">
            {stats.refundRequested} Requests
          </span>
          <span className="text-[10px] text-brand-text-muted mt-1 block">Awaiting HOD/Dean review</span>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex border-b border-brand-border/40 gap-6 text-sm font-semibold">
        <button 
          onClick={() => setActiveTab('verification')}
          className={`pb-3 cursor-pointer ${activeTab === 'verification' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-muted hover:text-white'}`}
        >
          Verification Desk ({filteredPayments.length})
        </button>
        <button 
          onClick={() => setActiveTab('refunds')}
          className={`pb-3 cursor-pointer ${activeTab === 'refunds' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-muted hover:text-white'}`}
        >
          Refund Requests ({refunds.filter(r => r.status === 'REQUESTED').length})
        </button>
        <button 
          onClick={() => setActiveTab('accounts')}
          className={`pb-3 cursor-pointer ${activeTab === 'accounts' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-muted hover:text-white'}`}
        >
          Bank Accounts & QRs
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`pb-3 cursor-pointer ${activeTab === 'audit' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-muted hover:text-white'}`}
        >
          Compliance Audit Log
        </button>
      </div>

      {/* Main Workspace Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verification & General Tabs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {activeTab === 'verification' && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold font-display flex items-center justify-between border-b border-brand-border/40 pb-3">
                <span>Fee Ingestion Receipts Verification Register</span>
                
                {/* Advanced Filters */}
                <div className="flex gap-2 text-xs">
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg px-2.5 py-1 text-white outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="VERIFICATION_PENDING">Pending Verification</option>
                    <option value="APPROVED">Approved / Reconciled</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="REFUND_REQUESTED">Refund Requested</option>
                  </select>
                  
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg px-2.5 py-1 text-white outline-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="TUITION">Tuition Fee</option>
                    <option value="HOSTEL_FEE">Hostel Fee</option>
                    <option value="MESS_FEE">Mess Fee</option>
                    <option value="TRANSPORT_FEE">Transport Fee</option>
                    <option value="LIBRARY_FINE">Library Fine</option>
                  </select>
                </div>
              </h3>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search by student name, enrollment ID, UTR code, or transaction number..."
                  className="w-full bg-brand-bg-tertiary border border-brand-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-brand-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Queue Table */}
              <div className="table-container border border-brand-border/50 max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg-tertiary/40 text-brand-text-muted font-bold font-display">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 font-mono">UTR / Reference</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-brand-text-muted font-mono">
                          No pending verification requests found.
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map(pay => (
                        <tr 
                          key={pay.id} 
                          onClick={() => setSelectedPayment(pay)}
                          className="border-b border-brand-border/40 hover:bg-brand-bg-tertiary/30 cursor-pointer transition-all"
                        >
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm">{pay.student_name || 'CampusX Student'}</span>
                              <span className="text-[10px] text-brand-text-muted mt-0.5">{pay.student_id} | {pay.student_dept || 'CS'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="badge px-2 py-0.5 rounded bg-brand-bg-tertiary border border-brand-border/60 font-semibold">{pay.fee_type}</span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-brand-accent-cyan font-semibold">
                            {pay.utr_number || pay.transaction_id || 'N/A'}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-white">
                            ${pay.amount.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`badge text-[9px] px-2 py-0.5 rounded font-bold ${
                              pay.status === 'APPROVED' 
                                ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' 
                                : (pay.status === 'REJECTED' 
                                    ? 'bg-brand-accent-red/20 text-brand-accent-red'
                                    : 'bg-brand-accent-cyan/20 text-brand-accent-cyan animate-pulse')
                            }`}>
                              {pay.status === 'VERIFICATION_PENDING' ? 'PENDING CHECK' : pay.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold font-display border-b border-brand-border/40 pb-3">Refund Ingestion Queue</h3>
              <div className="table-container border border-brand-border/50">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg-tertiary/40 text-brand-text-muted font-bold font-display">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Refund Reason</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-6 text-center text-brand-text-muted font-mono">No refund requests in queue.</td>
                      </tr>
                    ) : (
                      refunds.map(ref => (
                        <tr key={ref.id} className="border-b border-brand-border/40 hover:bg-brand-bg-tertiary/20">
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm">{ref.student_name}</span>
                              <span className="text-[10px] text-brand-text-muted mt-0.5">{ref.student_id} | {ref.fee_type}</span>
                            </div>
                          </td>
                          <td className="p-3 leading-relaxed text-brand-text-subtle">{ref.reason}</td>
                          <td className="p-3 text-right font-mono font-bold text-white">${ref.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className={`badge text-[9px] px-2 py-0.5 rounded font-bold ${
                              ref.status === 'COMPLETED' 
                                ? 'bg-brand-accent-emerald/20 text-brand-accent-emerald' 
                                : (ref.status === 'REJECTED' 
                                    ? 'bg-brand-accent-red/20 text-brand-accent-red'
                                    : 'bg-brand-accent-amber/20 text-brand-accent-amber animate-pulse')
                            }`}>{ref.status}</span>
                          </td>
                          <td className="p-3 text-right shrink-0">
                            {ref.status === 'REQUESTED' && (
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => handleProcessRefund(ref.id, 'COMPLETED')}
                                  className="px-2.5 py-1 bg-brand-accent-emerald text-white rounded text-[10px] font-bold font-display cursor-pointer hover:bg-brand-accent-emerald/80"
                                >
                                  Disburse Refund
                                </button>
                                <button 
                                  onClick={() => handleProcessRefund(ref.id, 'REJECTED')}
                                  className="px-2.5 py-1 bg-brand-accent-red text-white rounded text-[10px] font-bold font-display cursor-pointer hover:bg-brand-accent-red/80"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="flex flex-col gap-6">
              {/* Accounts management */}
              <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
                  <h3 className="text-lg font-bold font-display">Treasury Bank Accounts Registry</h3>
                  <button 
                    onClick={() => setShowAccountForm(!showAccountForm)}
                    className="btn btn-primary px-3 py-1.5 text-xs bg-brand-primary rounded-xl font-bold font-display text-white cursor-pointer"
                  >
                    {showAccountForm ? 'Cancel' : 'Add Bank Account'}
                  </button>
                </div>

                {showAccountForm && (
                  <form onSubmit={handleAddAccount} className="bg-brand-bg-tertiary/60 border border-brand-border/40 p-5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">Account Holder Name</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={accHolder} onChange={(e)=>setAccHolder(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">Account Number</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={accNum} onChange={(e)=>setAccNum(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">IFSC Code</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={accIfsc} onChange={(e)=>setAccIfsc(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">SWIFT Code (International)</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={accSwift} onChange={(e)=>setAccSwift(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">Branch Location</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={accBranch} onChange={(e)=>setAccBranch(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">UPI ID</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={accUpi} onChange={(e)=>setAccUpi(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">Account Category</label>
                      <select className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={accCategory} onChange={(e)=>setAccCategory(e.target.value)}>
                        <option value="PRIMARY">Primary Operations</option>
                        <option value="SECONDARY">Secondary Operations</option>
                        <option value="DEPARTMENT">Department Specific</option>
                        <option value="SCHOLARSHIP">Scholarship Escrow</option>
                        <option value="INTERNATIONAL">International Swift Escrow</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <input type="checkbox" id="accIsPrimary" checked={accIsPrimary} onChange={(e)=>setAccIsPrimary(e.target.checked)} />
                      <label htmlFor="accIsPrimary" className="text-brand-text-muted cursor-pointer">Set as Primary Central Account</label>
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                      <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-bold font-display rounded-lg cursor-pointer">Save Account</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bankAccounts.map(acc => (
                    <div key={acc.id} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex flex-col gap-1 font-mono relative">
                      {acc.is_primary === 1 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-brand-accent-emerald/20 text-brand-accent-emerald font-bold text-[8px]">PRIMARY</span>
                      )}
                      <div className="font-bold text-white text-sm font-sans mb-1">{acc.account_holder}</div>
                      <div>Account: <span className="text-brand-accent-cyan font-bold">{acc.account_number}</span></div>
                      <div>IFSC: {acc.ifsc}</div>
                      <div>SWIFT: {acc.swift || 'N/A'}</div>
                      <div>UPI: {acc.upi_id || 'N/A'}</div>
                      <div className="text-[10px] text-brand-text-muted font-sans mt-2">Category: {acc.category}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Management */}
              <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
                  <h3 className="text-lg font-bold font-display">Ingestion QR Code Matrix</h3>
                  <button 
                    onClick={() => setShowQrForm(!showQrForm)}
                    className="btn btn-primary px-3 py-1.5 text-xs bg-brand-primary rounded-xl font-bold font-display text-white cursor-pointer"
                  >
                    {showQrForm ? 'Cancel' : 'Configure QR Code'}
                  </button>
                </div>

                {showQrForm && (
                  <form onSubmit={handleAddQr} className="bg-brand-bg-tertiary/60 border border-brand-border/40 p-5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">QR Name / Display Label</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={qrName} onChange={(e)=>setQrName(e.target.value)} placeholder="e.g. Hostels UPI Pay" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">UPI ID / Address</label>
                      <input type="text" className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={qrUpi} onChange={(e)=>setQrUpi(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">QR Category Type</label>
                      <select className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={qrType} onChange={(e)=>setQrType(e.target.value)}>
                        <option value="UPI_QR">Universal UPI QR</option>
                        <option value="SEMESTER_QR">Semester Registration</option>
                        <option value="HOSTEL_QR">Hostel Accommodation</option>
                        <option value="MESS_QR">Mess Catering</option>
                        <option value="LIBRARY_QR">Library fine dues</option>
                        <option value="TRANSPORT_QR">Transportation fee</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-brand-text-muted">Link to Bank Account (Optional)</label>
                      <select className="bg-brand-bg-secondary border border-brand-border rounded-lg p-2 text-white outline-none" value={qrAccountId} onChange={(e)=>setQrAccountId(e.target.value)}>
                        <option value="">Default Central Account</option>
                        {bankAccounts.map(b => (
                          <option key={b.id} value={b.id}>{b.account_holder} ({b.account_number.substring(b.account_number.length - 4)})</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                      <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-bold font-display rounded-lg cursor-pointer">Save QR Config</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {qrCodes.map(qr => (
                    <div key={qr.id} className="p-4 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl text-xs flex justify-between items-center font-mono">
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="font-bold text-white text-sm font-sans">{qr.name}</div>
                        <div className="text-[10px] text-brand-text-muted mt-0.5">UPI: {qr.upi_id}</div>
                        <div className="text-[9px] px-2 py-0.5 rounded bg-brand-bg-secondary border border-brand-border/60 w-fit font-sans mt-2">{qr.type}</div>
                      </div>
                      <div className="w-14 h-14 bg-white p-0.5 rounded-lg flex items-center justify-center shrink-0 ml-3 border border-brand-border">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=upi://pay?pa=${qr.upi_id}&pn=CampusX%20University`} 
                          alt="QR Code" 
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-4 text-xs">
              <h3 className="text-lg font-bold font-display border-b border-brand-border/40 pb-3">Financial Transaction Compliance Audit Trail</h3>
              <div className="table-container border border-brand-border/50 max-h-[450px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg-tertiary/40 text-brand-text-muted font-bold">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor / ID</th>
                      <th className="p-3">Action Type</th>
                      <th className="p-3 font-mono">Metadata Payload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-brand-border/40 hover:bg-brand-bg-tertiary/10">
                        <td className="p-3 font-mono text-brand-text-muted">{log.created_at.replace('T', ' ').substring(0, 19)}</td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-white">{log.user_id}</span>
                            <span className="text-[9px] text-brand-text-muted uppercase font-bold">{log.role}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${
                            log.action_type.includes('APPROVED') 
                              ? 'text-brand-accent-emerald bg-brand-accent-emerald/10 border-brand-accent-emerald/30' 
                              : (log.action_type.includes('REJECTED')
                                  ? 'text-brand-accent-red bg-brand-accent-red/10 border-brand-accent-red/30'
                                  : 'text-brand-accent-cyan bg-brand-accent-cyan/10 border-brand-accent-cyan/30')
                          }`}>{log.action_type}</span>
                        </td>
                        <td className="p-3 font-mono text-[9px] text-brand-text-subtle leading-tight whitespace-normal break-all max-w-[200px]">
                          {log.payload}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Analytics & Verification Drawer sidebar */}
        <div className="flex flex-col gap-6">
          
          {/* Revenue distribution chart widget */}
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <PieChart className="w-4 h-4 text-brand-primary" />
              Fee Categories Collections
            </h3>
            <canvas ref={chartRef} className="w-full aspect-square max-h-[220px]" />
          </div>

          {/* Verification Modal Panel (When payment is selected) */}
          {selectedPayment ? (
            <div className="card bg-brand-bg-secondary border-2 border-brand-primary rounded-2xl p-5 flex flex-col gap-4 text-xs animate-scale-up">
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                <h3 className="text-sm font-bold font-display text-white">Manual Verification Drawer</h3>
                <button 
                  onClick={() => {
                    setSelectedPayment(null);
                    setShowRejectForm(false);
                  }} 
                  className="bg-transparent border-none text-brand-text-muted hover:text-white cursor-pointer text-base font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Uploaded screenshot proof view */}
              <div className="flex flex-col gap-1.5">
                <span className="text-brand-text-muted font-bold text-[9px] uppercase tracking-wider">Uploaded Screenshot Proof:</span>
                <div className="relative aspect-[1.4] w-full rounded-xl overflow-hidden border border-brand-border bg-brand-bg-tertiary flex items-center justify-center">
                  {selectedPayment.screenshot_path ? (
                    <img 
                      src={selectedPayment.screenshot_path} 
                      alt="Uploaded screenshot receipt" 
                      className="w-full h-full object-contain cursor-zoom-in"
                      onClick={() => window.open(selectedPayment.screenshot_path, '_blank')}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-brand-text-muted">
                      <AlertTriangle className="w-6 h-6 text-brand-accent-amber" />
                      <span>No slip screenshot uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data fields */}
              <div className="flex flex-col gap-2 font-mono text-[10px] bg-brand-bg-tertiary/60 p-3.5 rounded-xl border border-brand-border/40">
                <div className="flex justify-between border-b border-brand-border/20 pb-1.5">
                  <span className="text-brand-text-muted font-sans font-semibold">Student Name:</span>
                  <span className="text-white font-sans font-bold">{selectedPayment.student_name}</span>
                </div>
                <div className="flex justify-between border-b border-brand-border/20 py-1.5">
                  <span className="text-brand-text-muted font-sans font-semibold">Enrollment ID:</span>
                  <span className="text-white font-bold">{selectedPayment.student_id}</span>
                </div>
                <div className="flex justify-between border-b border-brand-border/20 py-1.5">
                  <span className="text-brand-text-muted font-sans font-semibold">UTR Number:</span>
                  <span className="text-brand-accent-cyan font-bold">{selectedPayment.utr_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-brand-border/20 py-1.5">
                  <span className="text-brand-text-muted font-sans font-semibold">Reference ID:</span>
                  <span className="text-brand-accent-cyan font-bold">{selectedPayment.transaction_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-brand-border/20 py-1.5">
                  <span className="text-brand-text-muted font-sans font-semibold">Amount Paid:</span>
                  <span className="text-white font-bold text-xs">${selectedPayment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-brand-border/20 py-1.5">
                  <span className="text-brand-text-muted font-sans font-semibold">Transfer Date:</span>
                  <span className="text-white">{selectedPayment.payment_date ? selectedPayment.payment_date.substring(0, 10) : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-brand-text-muted font-sans font-semibold">Remarks:</span>
                  <span className="text-white text-right max-w-[140px] whitespace-normal break-all font-sans">{selectedPayment.remarks || 'None'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedPayment.status === 'VERIFICATION_PENDING' && (
                <div className="flex flex-col gap-2 mt-2">
                  <button 
                    onClick={() => handleApprovePayment(selectedPayment.id)}
                    disabled={btnLoading[selectedPayment.id] === 'approve'}
                    className="w-full py-2.5 bg-brand-accent-emerald hover:bg-brand-accent-emerald/85 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-display transition-all"
                  >
                    {btnLoading[selectedPayment.id] === 'approve' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Reconcile Payment
                  </button>

                  <button 
                    onClick={() => setShowRejectForm(true)}
                    className="w-full py-2 bg-brand-accent-red hover:bg-brand-accent-red/85 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-display transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject / Flag Payment
                  </button>
                </div>
              )}

              {/* Rejection Remarks Form */}
              {showRejectForm && (
                <form onSubmit={handleRejectPayment} className="flex flex-col gap-2.5 border-t border-brand-border/30 pt-3.5 mt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-brand-accent-red font-bold font-sans text-[10px]">REJECTION REASON / FLAG NOTE:</label>
                    <textarea 
                      rows="3"
                      className="bg-brand-bg-tertiary border border-brand-accent-red/40 rounded-lg p-2 text-white outline-none resize-none focus:border-brand-accent-red"
                      placeholder="e.g. Uploaded slip does not show correct UTR. Please upload official receipt PDF."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end text-[10px]">
                    <button type="button" onClick={() => setShowRejectForm(false)} className="px-3 py-1.5 bg-brand-bg-tertiary border border-brand-border rounded font-bold cursor-pointer">Cancel</button>
                    <button type="submit" disabled={btnLoading[selectedPayment.id] === 'reject'} className="px-3 py-1.5 bg-brand-accent-red text-white font-bold rounded cursor-pointer flex items-center gap-1">
                      {btnLoading[selectedPayment.id] === 'reject' && <Loader2 className="w-3 animate-spin" />}
                      Confirm Reject
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs text-brand-text-muted justify-center items-center py-12">
              <ShieldAlert className="w-8 h-8 text-brand-text-muted/60" />
              <span className="text-center font-mono">Select a payment request in the list to review verification screenshot details.</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
