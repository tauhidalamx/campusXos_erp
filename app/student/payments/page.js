'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Upload, 
  QrCode, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  Printer, 
  Download, 
  DollarSign,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Bell
} from 'lucide-react';

const FEE_TYPES = [
  { value: 'TUITION', label: 'Tuition Fee', amount: 4500 },
  { value: 'HOSTEL_FEE', label: 'Hostel Fee', amount: 1500 },
  { value: 'MESS_FEE', label: 'Mess Fee', amount: 800 },
  { value: 'TRANSPORT_FEE', label: 'Transport Fee', amount: 400 },
  { value: 'EXAM_FEE', label: 'Examination Fee', amount: 150 },
  { value: 'LIBRARY_FINE', label: 'Library Fine / Dues', amount: 25 },
  { value: 'SPORTS_FEE', label: 'Sports & Athletics', amount: 100 },
  { value: 'OTHER_FEE', label: 'Other Activity Fees', amount: 50 }
];

export default function StudentPaymentsPortal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Payment flow state
  const [selectedFee, setSelectedFee] = useState(FEE_TYPES[0]);
  const [semester, setSemester] = useState('Spring 2026');
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedQr, setSelectedQr] = useState(null);

  // Form Fields
  const [transactionId, setTransactionId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [proofFile, setProofFile] = useState(null);
  
  // Modals & Receipt Viewer
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundPaymentId, setRefundPaymentId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = sessionStorage.getItem('campusx_erp_session');
      if (session) {
        const user = JSON.parse(session);
        setCurrentUser(user);
        loadStudentData(user.id || 'STU001');
      } else {
        // Fallback for demo
        const fallbackUser = { id: 'STU001', name: 'Jackson Cole', role: 'student', email: 'student@campusx.edu' };
        setCurrentUser(fallbackUser);
        loadStudentData(fallbackUser.id);
      }
    }
  }, []);

  const loadStudentData = async (studentId) => {
    setLoading(true);
    try {
      // 1. Fetch past payments
      const payRes = await fetch(`/api/payments?student_id=${studentId}`);
      const payData = await payRes.json();
      setPayments(payData);

      // 2. Fetch active bank accounts
      const bankRes = await fetch('/api/bank-accounts');
      const bankData = await bankRes.json();
      setBankAccounts(bankData);
      const primaryBank = bankData.find(b => b.is_primary === 1) || bankData[0];
      setSelectedBank(primaryBank);

      // 3. Fetch QR codes
      const qrRes = await fetch('/api/qr-codes');
      const qrData = await qrRes.json();
      setQrCodes(qrData);
      const primaryQr = qrData.find(q => q.type === 'UPI_QR') || qrData[0];
      setSelectedQr(primaryQr);

      // 4. Fetch scholarships
      const scholRes = await fetch(`/api/scholarships?student_id=${studentId}`);
      const scholData = await scholRes.json();
      setScholarships(scholData);

      // 5. Fetch installments
      const instRes = await fetch(`/api/installments?student_id=${studentId}`);
      const instData = await instRes.json();
      setInstallments(instData);

      // 6. Fetch recent payment notifications
      const notifRes = await fetch(`/api/payments/notifications?user_id=${studentId}`);
      const notifData = await notifRes.json();
      setNotifications(notifData);

      // Preset current date
      setPaymentDate(new Date().toISOString().substring(0, 10));
    } catch (err) {
      console.error('Error fetching student finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const activeScholarship = scholarships.find(s => s.status === 'ACTIVE');
  const scholarshipDiscount = activeScholarship 
    ? (activeScholarship.discount_percentage > 0 
        ? selectedFee.amount * (activeScholarship.discount_percentage / 100) 
        : activeScholarship.amount)
    : 0;
  const netPayable = Math.max(selectedFee.amount - scholarshipDiscount, 0);

  // Auto-fill fee amount when selection changes
  useEffect(() => {
    setAmountPaid(netPayable.toString());
  }, [selectedFee, scholarships]);

  // Handle uploader
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  // Submit Payment Proof
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!amountPaid || parseFloat(amountPaid) <= 0) {
      alert('Please enter a valid amount paid.');
      return;
    }
    if (!utrNumber && !transactionId) {
      alert('Please enter at least a UTR Number or Transaction ID for payment tracking.');
      return;
    }

    setBtnLoading(true);

    try {
      const studentId = currentUser?.id || 'STU001';
      
      // We first create a payment request, then upload proof
      const initRes = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          fee_type: selectedFee.value,
          semester,
          amount: parseFloat(amountPaid),
          payment_method: selectedMethod,
          installment_id: selectedFee.value === 'TUITION' ? 'inst_1' : ''
        })
      });
      const initData = await initRes.json();

      if (!initData.success) {
        alert('Failed to initialize payment request.');
        setBtnLoading(false);
        return;
      }

      const payment_id = initData.payment_id;

      // Now create FormData for proof upload
      const formData = new FormData();
      formData.append('payment_id', payment_id);
      formData.append('student_id', studentId);
      formData.append('fee_type', selectedFee.value);
      formData.append('semester', semester);
      formData.append('amount', parseFloat(amountPaid));
      formData.append('payment_method', selectedMethod);
      formData.append('transaction_id', transactionId);
      formData.append('utr_number', utrNumber);
      formData.append('reference_number', utrNumber || transactionId);
      formData.append('bank_name', bankName);
      formData.append('account_number', accountNumber);
      formData.append('ifsc', ifscCode);
      formData.append('remarks', remarks);
      formData.append('payment_date', paymentDate);
      if (proofFile) {
        formData.append('proof', proofFile);
      }

      const uploadRes = await fetch('/api/payments/upload-proof', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (uploadData.success) {
        alert('Payment proof successfully uploaded! Awaiting finance officer verification.');
        // Reset form
        setTransactionId('');
        setUtrNumber('');
        setBankName('');
        setAccountNumber('');
        setIfscCode('');
        setRemarks('');
        setProofFile(null);
        // Refresh past logs
        loadStudentData(studentId);
      } else {
        alert('Failed to upload payment proof.');
      }
    } catch (err) {
      console.error('Error submitting payment:', err);
      alert('Error submitting payment.');
    } finally {
      setBtnLoading(false);
    }
  };

  // Submit Refund Request
  const handleRequestRefund = async (e) => {
    e.preventDefault();
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      alert('Please enter a valid refund amount.');
      return;
    }
    if (!refundReason) {
      alert('Please specify a reason for refund.');
      return;
    }

    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: refundPaymentId,
          amount: parseFloat(refundAmount),
          reason: refundReason
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Refund request submitted successfully.');
        setShowRefundModal(false);
        loadStudentData(currentUser?.id || 'STU001');
      } else {
        alert('Failed to submit refund request.');
      }
    } catch (err) {
      console.error('Error requesting refund:', err);
    }
  };

  // View Receipt Modal
  const handleViewReceipt = async (payId) => {
    try {
      const res = await fetch(`/api/payments/${payId}`);
      const data = await res.json();
      setActiveReceipt(data);
      setShowReceiptModal(true);
    } catch (err) {
      console.error('Error viewing receipt:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="ml-3 font-semibold">Loading Financial Terminal...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 fade-in text-white animate-fade-in">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-4 border-b border-brand-border/40">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-brand-primary" />
            Student Payment Portal
          </h1>
          <p className="text-brand-text-muted text-sm mt-1">
            Reconcile semester tuition fees, select installments, apply active scholarships, and upload manual transaction proofs.
          </p>
        </div>
      </div>

      {/* Overview stats & announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Outstanding Fees</span>
          <span className="block text-2xl font-bold font-display text-white mt-1">
            ${payments.length > 0
              ? Math.max(4500 - payments.filter(p => p.status === 'APPROVED' || p.status === 'VERIFIED').reduce((sum, p) => sum + p.amount, 0), 0).toLocaleString()
              : '4,500'}
          </span>
          <span className="text-[10px] text-brand-accent-cyan mt-1 block">Spring 2026 Academic Term</span>
        </div>

        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl">
          <span className="text-brand-text-muted text-xs font-semibold">Active Scholarships</span>
          <span className="block text-lg font-bold font-display text-brand-accent-emerald mt-1">
            {activeScholarship ? activeScholarship.name : 'No Active Scholarship'}
          </span>
          <span className="text-[10px] text-brand-text-muted mt-1 block">
            {activeScholarship 
              ? (activeScholarship.discount_percentage > 0 
                  ? `${activeScholarship.discount_percentage}% Concession` 
                  : `$${activeScholarship.amount.toLocaleString()} Deduction`)
              : 'Apply at Registrar desk'}
          </span>
        </div>

        {/* Notifications Widget */}
        <div className="card p-5 bg-brand-bg-secondary border border-brand-border rounded-2xl lg:col-span-2 flex flex-col gap-2">
          <span className="text-brand-text-muted text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-accent-amber" />
            Fin-Ops Notification Channel
          </span>
          <div className="overflow-y-auto max-h-[60px] flex flex-col gap-1.5 pr-2">
            {notifications.length === 0 ? (
              <span className="text-[10px] text-brand-text-muted">Awaiting transaction notifications...</span>
            ) : (
              notifications.map((notif, idx) => (
                <div key={idx} className="text-[10px] bg-brand-bg-tertiary/60 p-1.5 rounded border border-brand-border/40 flex justify-between">
                  <span className="font-semibold text-white">{notif.message}</span>
                  <span className="text-[9px] text-brand-text-muted font-mono">{notif.created_at.substring(5, 10)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Payment Ingestion & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ingestion Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-lg font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <QrCode className="w-5 h-5 text-brand-primary" />
              Manual Payment Ingestion Terminal
            </h3>

            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Fee Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Fee Type / Category</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white outline-none focus:border-brand-primary"
                    value={selectedFee.value}
                    onChange={(e) => {
                      const selected = FEE_TYPES.find(f => f.value === e.target.value);
                      setSelectedFee(selected);
                    }}
                  >
                    {FEE_TYPES.map(f => (
                      <option key={f.value} value={f.value}>{f.label} (${f.amount})</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Academic Semester</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white outline-none focus:border-brand-primary"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="Spring 2026">Spring 2026 (Current)</option>
                    <option value="Monsoon 2026">Monsoon 2026</option>
                    <option value="Winter 2025">Winter 2025</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Payment Transfer Method</label>
                  <select 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2.5 text-white outline-none focus:border-brand-primary"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
                    <option value="Cash">Cash Submission</option>
                    <option value="Cheque">Cheque Deposit</option>
                    <option value="Demand Draft">Demand Draft (DD)</option>
                    <option value="International Transfer">International Swift Transfer</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Ledger and Scholarship Reduction Output */}
              <div className="bg-brand-bg-tertiary/60 border border-brand-border/40 p-4 rounded-xl flex flex-col gap-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Standard Fee Amount:</span>
                  <span>${selectedFee.amount.toFixed(2)}</span>
                </div>
                {scholarshipDiscount > 0 && (
                  <div className="flex justify-between text-brand-accent-emerald">
                    <span>Waiver Deduction ({activeScholarship?.name}):</span>
                    <span>-${scholarshipDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-brand-border/20 pt-2 font-bold text-sm text-white">
                  <span>Net Payable Amount:</span>
                  <span className="text-brand-accent-cyan">${netPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* Dynamic Bank / UPI Details Display */}
              <div className="bg-brand-bg-tertiary/40 border border-brand-border/20 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                {selectedMethod === 'UPI' ? (
                  <>
                    <div className="flex-1 flex flex-col gap-1">
                      <span className="font-bold text-white text-sm">Transfer via UPI QR Code</span>
                      <span className="text-brand-text-muted text-[10px]">Scan the QR code below or copy the official UPI ID.</span>
                      <div className="bg-brand-bg-secondary p-2.5 rounded-lg border border-brand-border mt-2 font-mono flex items-center justify-between">
                        <span className="text-brand-accent-cyan font-bold">{selectedQr?.upi_id || 'campusxbank@upi'}</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedQr?.upi_id || 'campusxbank@upi');
                            alert('UPI ID copied to clipboard!');
                          }}
                          className="hover:text-white text-brand-primary font-bold ml-2 cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="w-28 h-28 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 border border-brand-border">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${selectedQr?.upi_id || 'campusxbank@upi'}&pn=CampusX%20University&am=${netPayable}&cu=USD`} 
                        alt="UPI QR Code" 
                        className="w-full h-full"
                      />
                    </div>
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-2">
                    <span className="font-bold text-white text-sm">Official Bank Account Details</span>
                    <span className="text-brand-text-muted text-[10px]">Perform a direct bank wire / NEFT / IMPS transfer to this primary account:</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-[11px] font-mono bg-brand-bg-secondary p-3 rounded-xl border border-brand-border">
                      <div>
                        <span className="text-brand-text-muted block">Account Holder:</span>
                        <span className="text-white font-semibold text-sm">{selectedBank?.account_holder || 'CampusX University Central'}</span>
                      </div>
                      <div>
                        <span className="text-brand-text-muted block">Account Number:</span>
                        <span className="text-brand-accent-cyan font-bold">{selectedBank?.account_number || '1122334455'}</span>
                      </div>
                      <div>
                        <span className="text-brand-text-muted block">Bank IFSC Code:</span>
                        <span className="text-white font-semibold">{selectedBank?.ifsc || 'CAMPUSX000123'}</span>
                      </div>
                      <div>
                        <span className="text-brand-text-muted block">Branch / SWIFT Code:</span>
                        <span className="text-white font-semibold">{selectedBank?.branch || 'Main Campus'} {selectedBank?.swift ? `(${selectedBank.swift})` : ''}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">UTR Number (NEFT/RTGS/UPI)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 518392019482" 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none focus:border-brand-primary font-mono"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Transaction Reference ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. TXN99882211" 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none focus:border-brand-primary font-mono"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Amount Paid ($)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 3000" 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none focus:border-brand-primary font-mono"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Payment Date</label>
                  <input 
                    type="date" 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none focus:border-brand-primary"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Sender Bank Details (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Chase Bank, Account No: ...5566" 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none focus:border-brand-primary"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-brand-text-muted font-semibold">Payment Remarks / Reference Notes</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Semester Fee first installment" 
                    className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none focus:border-brand-primary"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>

              {/* Upload screenshot */}
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">Upload Payment Receipt Screenshot (Max 5MB)</label>
                <div className="border-2 border-dashed border-brand-border rounded-xl p-6 text-center hover:border-brand-primary transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-brand-text-muted" />
                    {proofFile ? (
                      <span className="text-brand-accent-emerald font-semibold font-mono">{proofFile.name}</span>
                    ) : (
                      <>
                        <span className="text-brand-text-muted">Drag & drop or click to upload JPEG/PNG</span>
                        <span className="text-[10px] text-brand-text-muted/60">Ensure transaction summary and UTR code are visible.</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={btnLoading}
                className="btn btn-primary w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover font-display transition-all cursor-pointer"
              >
                {btnLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Submit Manual Proof to Finance Office</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Payment History sidebar */}
        <div className="flex flex-col gap-6">
          <div className="card bg-brand-bg-secondary border border-brand-border rounded-2xl p-5 flex flex-col gap-4 text-xs">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Clock className="w-4 h-4 text-brand-accent-cyan" />
              My Manual Transaction History
            </h3>

            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {payments.length === 0 ? (
                <div className="p-6 text-center text-brand-text-muted font-mono">
                  No payment records found.
                </div>
              ) : (
                payments.map(pay => {
                  let statusColor = 'text-brand-text-muted bg-white/[0.04] border-white/10';
                  if (pay.status === 'APPROVED' || pay.status === 'VERIFIED') statusColor = 'text-brand-accent-emerald bg-brand-accent-emerald/10 border-brand-accent-emerald/30';
                  else if (pay.status === 'VERIFICATION_PENDING') statusColor = 'text-brand-accent-cyan bg-brand-accent-cyan/10 border-brand-accent-cyan/30 animate-pulse';
                  else if (pay.status === 'REJECTED') statusColor = 'text-brand-accent-red bg-brand-accent-red/10 border-brand-accent-red/30';
                  else if (pay.status === 'REFUND_REQUESTED') statusColor = 'text-brand-accent-amber bg-brand-accent-amber/10 border-brand-accent-amber/30';

                  return (
                    <div key={pay.id} className="p-3 bg-brand-bg-tertiary/60 border border-brand-border/40 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white uppercase text-[10px]">{pay.fee_type}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${statusColor}`}>{pay.status}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-brand-text-subtle">
                        <span>Amount:</span>
                        <span className="text-white font-bold">${pay.amount.toLocaleString()}</span>
                      </div>
                      <div className="text-[9px] text-brand-text-muted font-mono leading-tight">
                        <div>UTR: {pay.utr_number || 'N/A'}</div>
                        <div>Date: {pay.payment_date ? pay.payment_date.substring(0, 10) : 'N/A'}</div>
                        {pay.rejection_reason && (
                          <div className="text-brand-accent-orange font-sans mt-1 bg-brand-accent-orange/5 p-1 rounded border border-brand-accent-orange/20">
                            Rejection Note: {pay.rejection_reason}
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-end gap-2 border-t border-brand-border/20 pt-2 mt-1">
                        {(pay.status === 'APPROVED' || pay.status === 'VERIFIED') && (
                          <button 
                            onClick={() => handleViewReceipt(pay.id)}
                            className="text-[9px] px-2 py-1 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20 rounded flex items-center gap-1 cursor-pointer font-bold font-display"
                          >
                            <FileText className="w-3 h-3" />
                            View Receipt
                          </button>
                        )}
                        {(pay.status === 'APPROVED' || pay.status === 'VERIFIED') && (
                          <button 
                            onClick={() => {
                              setRefundPaymentId(pay.id);
                              setRefundAmount(pay.amount.toString());
                              setShowRefundModal(true);
                            }}
                            className="text-[9px] px-2 py-1 bg-brand-accent-ruby/10 border border-brand-accent-ruby/30 text-brand-accent-ruby hover:bg-brand-accent-ruby/20 rounded flex items-center gap-1 cursor-pointer font-bold font-display"
                          >
                            Request Refund
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[450px] overflow-hidden">
            <div className="p-5 px-6 border-b border-brand-border flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">Request Fee Refund</h3>
              <button onClick={() => setShowRefundModal(false)} className="bg-transparent border-none text-brand-text-muted hover:text-white cursor-pointer text-xl">&times;</button>
            </div>
            <form onSubmit={handleRequestRefund} className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-brand-text-muted">Refund Payment ID:</span>
                <span className="font-mono text-white font-bold">{refundPaymentId}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">Refund Amount ($)</label>
                <input 
                  type="number" 
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-brand-text-muted font-semibold">Reason for Refund</label>
                <textarea 
                  rows="3"
                  className="bg-brand-bg-tertiary border border-brand-border rounded-lg p-2 text-white outline-none resize-none"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Duplicate transfer or scholarship approved post-payment"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowRefundModal(false)} className="btn btn-secondary cursor-pointer py-1.5 px-4 bg-brand-bg-tertiary rounded-lg border border-brand-border font-semibold">Cancel</button>
                <button type="submit" className="btn btn-primary cursor-pointer py-1.5 px-4 bg-brand-accent-ruby text-white rounded-lg font-semibold">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal Viewer */}
      {showReceiptModal && activeReceipt && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-brand-bg-secondary border border-brand-border rounded-[20px] w-full max-w-[600px] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 px-6 border-b border-brand-border flex items-center justify-between bg-brand-bg-tertiary">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-primary" />
                University Fee Receipt
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="bg-brand-bg-secondary border border-brand-border hover:bg-white/[0.04] p-1.5 rounded-lg text-brand-text-muted hover:text-white cursor-pointer"
                  title="Print Receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setShowReceiptModal(false)} className="bg-transparent border-none text-brand-text-muted hover:text-white cursor-pointer text-xl">&times;</button>
              </div>
            </div>
            
            {/* Receipt Content */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-xs text-white printable-area">
              
              {/* Receipt Header logo & invoice number */}
              <div className="flex justify-between items-start border-b border-brand-border/40 pb-4">
                <div className="flex flex-col gap-1">
                  <span className="font-display text-xl font-bold tracking-wider text-brand-primary">CAMPUSX UNIVERSITY</span>
                  <span className="text-[9px] text-brand-text-muted">Office of the Treasury, Global Administration</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-text-muted block">Receipt Number:</span>
                  <span className="font-mono text-sm font-bold text-brand-accent-cyan">{activeReceipt.receipt_number || 'REC-2026-MOCK'}</span>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 gap-4 bg-brand-bg-tertiary/50 p-4 rounded-xl border border-brand-border/40 font-mono text-[10px]">
                <div>
                  <span className="text-brand-text-muted block">Student Name:</span>
                  <span className="text-white font-semibold text-sm">{activeReceipt.student_name}</span>
                </div>
                <div>
                  <span className="text-brand-text-muted block">Enrollment ID:</span>
                  <span className="text-white font-semibold text-sm">{activeReceipt.student_id}</span>
                </div>
                <div>
                  <span className="text-brand-text-muted block">Department:</span>
                  <span className="text-white font-semibold">{activeReceipt.student_dept || 'Computer Science'}</span>
                </div>
                <div>
                  <span className="text-brand-text-muted block">Academic Term:</span>
                  <span className="text-white font-semibold">{activeReceipt.semester}</span>
                </div>
              </div>

              {/* Breakdown Ledger Table */}
              <div className="flex flex-col gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-brand-text-muted">Payment Ledger Description</span>
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-brand-border/60 text-brand-text-muted font-mono font-semibold">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Base Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-brand-border/20">
                      <td className="py-2.5">
                        <span className="font-bold text-white">{activeReceipt.fee_category} Fee Clearance</span>
                        <span className="block text-[9px] text-brand-text-muted mt-0.5">Payment Method: {activeReceipt.payment_method} | UTR: {activeReceipt.utr_number || 'N/A'}</span>
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold">${activeReceipt.amount.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-brand-border/20 text-brand-text-muted">
                      <td className="py-2">GST Integration (18%)</td>
                      <td className="py-2 text-right font-mono">${(activeReceipt.amount * 0.18).toFixed(2)}</td>
                    </tr>
                    <tr className="border-b border-brand-border/40 text-brand-text-muted">
                      <td className="py-2">Scholarships & Discounts</td>
                      <td className="py-2 text-right font-mono">-$0.00</td>
                    </tr>
                    <tr className="text-white font-bold text-xs bg-brand-bg-tertiary/20 font-mono">
                      <td className="p-2">Total Amount Received (Reconciled)</td>
                      <td className="p-2 text-right text-brand-accent-emerald">${activeReceipt.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Digital Anchors */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-brand-border/40 pt-4 mt-2">
                {/* Barcode & Signature */}
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-32 bg-white flex items-center justify-center text-black font-mono font-bold tracking-widest text-[9px] border border-brand-border">
                    |||||||| {activeReceipt.id.substring(3, 9).toUpperCase()} ||||||||
                  </div>
                  <span className="text-[8px] text-brand-text-muted font-mono">Ledger Block Anchor: {activeReceipt.transaction_id || '0xchain_hash'}</span>
                </div>
                
                {/* Digital Stamp */}
                <div className="flex flex-col items-center gap-1 text-[8px] font-mono text-brand-text-muted">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-primary flex items-center justify-center text-brand-primary font-bold text-[9px] select-none transform rotate-12">
                    CAMPUSX
                  </div>
                  <span>Treasury Digitally Signed</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
