import { useState, useEffect } from "react";

const APPROVERS = [
  { id: "a1", name: "Sarah Mitchell" },
  { id: "a2", name: "James Thornton" },
  { id: "a3", name: "Priya Nair" },
  { id: "a4", name: "David Okafor" },
];

const INITIAL_BILLS = [
  {
    id: "BILL-001",
    supplier: "Apex Civil Contractors",
    description: "Earthworks – Stage 2A",
    amount: 48500.0,
    gst: 4850.0,
    subtotal: 43650.0,
    date: "2024-06-01",
    xeroStatus: "Synced",
    approvalPhase: "fully_approved",
    approvers: [
      { id: "a1", name: "Sarah Mitchell", status: "approved", timestamp: "2024-06-03 09:14", notes: "" },
      { id: "a2", name: "James Thornton", status: "approved", timestamp: "2024-06-04 11:32", notes: "Checked against PO-2241" },
      { id: "a3", name: "Priya Nair", status: "approved", timestamp: "2024-06-05 14:05", notes: "" },
    ],
    internalNotes: [
      { author: "Sarah Mitchell", timestamp: "2024-06-03 09:15", text: "Verified site completion report attached." },
    ],
    wbsCode: "WBS-04.2.1",
    dayWorksDocket: null,
  },
  {
    id: "BILL-002",
    supplier: "Ironclad Formwork Pty Ltd",
    description: "Formwork Supply – Retaining Wall",
    amount: 21780.0,
    gst: 1980.0,
    subtotal: 19800.0,
    date: "2024-06-05",
    xeroStatus: "Sync Error",
    approvalPhase: "awaiting_final",
    approvers: [
      { id: "a1", name: "Sarah Mitchell", status: "approved", timestamp: "2024-06-07 08:45", notes: "" },
      { id: "a2", name: "James Thornton", status: "approved", timestamp: "2024-06-08 10:20", notes: "" },
      { id: "a3", name: "Priya Nair", status: "pending", timestamp: null, notes: "" },
    ],
    internalNotes: [],
    wbsCode: "WBS-02.1.3",
    dayWorksDocket: "DW-2024-0089",
  },
  {
    id: "BILL-003",
    supplier: "BlueLine Electrical",
    description: "Temporary Power – Site Office",
    amount: 8250.0,
    gst: 750.0,
    subtotal: 7500.0,
    date: "2024-06-08",
    xeroStatus: "Synced",
    approvalPhase: "partially_approved",
    approvers: [
      { id: "a1", name: "Sarah Mitchell", status: "approved", timestamp: "2024-06-09 13:00", notes: "Matches quote ref Q-4492" },
      { id: "a4", name: "David Okafor", status: "pending", timestamp: null, notes: "" },
      { id: "a3", name: "Priya Nair", status: "pending", timestamp: null, notes: "" },
    ],
    internalNotes: [
      { author: "James Thornton", timestamp: "2024-06-09 15:00", text: "Rate sheet updated for this supplier. Check WBS allocation." },
    ],
    wbsCode: "WBS-01.3.2",
    dayWorksDocket: null,
  },
  {
    id: "BILL-004",
    supplier: "Terrain Geotechnical",
    description: "Soil Testing – Zone C",
    amount: 5500.0,
    gst: 500.0,
    subtotal: 5000.0,
    date: "2024-06-10",
    xeroStatus: "Not Synced",
    approvalPhase: "awaiting_approval",
    approvers: [
      { id: "a2", name: "James Thornton", status: "pending", timestamp: null, notes: "" },
      { id: "a4", name: "David Okafor", status: "pending", timestamp: null, notes: "" },
    ],
    internalNotes: [],
    wbsCode: "WBS-03.1.1",
    dayWorksDocket: "DW-2024-0091",
  },
  {
    id: "BILL-005",
    supplier: "Summit Scaffolding Co.",
    description: "Scaffold Hire – Month 2",
    amount: 14300.0,
    gst: 1300.0,
    subtotal: 13000.0,
    date: "2024-06-12",
    xeroStatus: "Synced",
    approvalPhase: "partially_approved",
    approvers: [
      { id: "a3", name: "Priya Nair", status: "approved", timestamp: "2024-06-13 09:30", notes: "" },
      { id: "a2", name: "James Thornton", status: "pending", timestamp: null, notes: "" },
      { id: "a4", name: "David Okafor", status: "pending", timestamp: null, notes: "" },
    ],
    internalNotes: [],
    wbsCode: "WBS-04.1.2",
    dayWorksDocket: null,
  },
  {
    id: "BILL-006",
    supplier: "Ridgeline Concrete Pumping",
    description: "Concrete Pump – Slab Pour",
    amount: 9900.0,
    gst: 900.0,
    subtotal: 9000.0,
    date: "2024-06-14",
    xeroStatus: "Synced",
    approvalPhase: "awaiting_final",
    approvers: [
      { id: "a4", name: "David Okafor", status: "approved", timestamp: "2024-06-15 10:00", notes: "" },
      { id: "a1", name: "Sarah Mitchell", status: "approved", timestamp: "2024-06-16 11:15", notes: "" },
      { id: "a2", name: "James Thornton", status: "pending", timestamp: null, notes: "" },
    ],
    internalNotes: [],
    wbsCode: "WBS-02.2.1",
    dayWorksDocket: "DW-2024-0095",
  },
];

const PHASE_CONFIG = {
  awaiting_approval: {
    label: "Awaiting Approval",
    color: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    dot: "bg-yellow-500",
    step: 0,
  },
  partially_approved: {
    label: "Partially Approved – Pending 2nd Approver",
    color: "bg-blue-100 text-blue-800 border border-blue-300",
    dot: "bg-blue-500",
    step: 1,
  },
  awaiting_final: {
    label: "Awaiting Final Approval",
    color: "bg-orange-100 text-orange-800 border border-orange-300",
    dot: "bg-orange-500",
    step: 2,
  },
  fully_approved: {
    label: "Fully Approved",
    color: "bg-green-100 text-green-800 border border-green-300",
    dot: "bg-green-500",
    step: 3,
  },
};

const XERO_STATUS_CONFIG = {
  Synced: "bg-green-100 text-green-700 border border-green-200",
  "Sync Error": "bg-red-100 text-red-700 border border-red-200",
  "Not Synced": "bg-gray-100 text-gray-600 border border-gray-200",
};

function formatCurrency(val) {
  return "$" + Number(val).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ApproverPip({ approver }) {
  const isApproved = approver.status === "approved";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        isApproved
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-gray-50 text-gray-500 border-gray-200"
      }`}
      title={`${approver.name}: ${isApproved ? "Approved " + approver.timestamp : "Pending"}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? "bg-green-500" : "bg-gray-300"}`} />
      {approver.name.split(" ")[0]}
    </span>
  );
}

function PhaseBadge({ phase }) {
  const cfg = PHASE_CONFIG[phase];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ApprovalStepper({ approvers, phase }) {
  const steps = [
    { label: "Submitted", done: true },
    { label: "1st Approval", done: phase !== "awaiting_approval" },
    { label: "2nd Approval", done: phase === "awaiting_final" || phase === "fully_approved" },
    { label: "Final Approval", done: phase === "fully_approved" },
  ];
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                s.done
                  ? "bg-[#0ea5e9] border-[#0ea5e9] text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {s.done ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`mt-1 text-[10px] font-medium ${s.done ? "text-[#0ea5e9]" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-12 mx-1 mb-4 ${s.done ? "bg-[#0ea5e9]" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function BillDetailModal({ bill, onClose, onSave }) {
  const [gstValue, setGstValue] = useState(bill.gst.toString());
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState(bill.internalNotes);
  const [wbsCode, setWbsCode] = useState(bill.wbsCode);
  const [wbsApplyAll, setWbsApplyAll] = useState(false);
  const [xeroStatus, setXeroStatus] = useState(bill.xeroStatus);
  const [activeTab, setActiveTab] = useState("timeline");
  const [chargeRates, setChargeRates] = useState([
    { id: 1, code: "LAB-01", description: "General Labourer", rate: 85.0, unit: "hr" },
    { id: 2, code: "EQP-05", description: "Excavator (20T)", rate: 210.0, unit: "hr" },
    { id: 3, code: "MAT-03", description: "Ready Mix Concrete", rate: 185.0, unit: "m³" },
  ]);
  const [editingRate, setEditingRate] = useState(null);

  const computedSubtotal = (parseFloat(gstValue) || 0) > 0
    ? bill.amount - (parseFloat(gstValue) || 0)
    : bill.subtotal;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const entry = {
      author: "Current User",
      timestamp: new Date().toLocaleString("en-AU", { hour12: false }).replace(",", ""),
      text: newNote.trim(),
    };
    setNotes([...notes, entry]);
    setNewNote("");
  };

  const handleSyncXero = () => {
    setXeroStatus("Syncing...");
    setTimeout(() => setXeroStatus("Synced"), 2000);
  };

  const handleSave = () => {
    onSave({
      ...bill,
      gst: parseFloat(gstValue) || bill.gst,
      subtotal: computedSubtotal,
      internalNotes: notes,
      wbsCode,
      xeroStatus,
    });
  };

  const tabs = [
    { id: "timeline", label: "Approval Timeline" },
    { id: "details", label: "Bill Details" },
    { id: "notes", label: `Notes (${notes.length})` },
    { id: "rates", label: "Charge Rates" },
    { id: "wbs", label: "WBS" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{bill.id}</span>
              <PhaseBadge phase={bill.approvalPhase} />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${XERO_STATUS_CONFIG[xeroStatus] || "bg-gray-100 text-gray-500"}`}>
                Xero: {xeroStatus}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{bill.supplier}</h2>
            <p className="text-sm text-gray-500">{bill.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 pt-4 pb-2 bg-gray-50 border-b border-gray-100">
          <ApprovalStepper approvers={bill.approvers} phase={bill.approvalPhase} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 border-b border-gray-100">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === t.id
                  ? "text-[#0ea5e9] border-b-2 border-[#0ea5e9] bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Approval Audit Trail</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-4">
                  {/* Submitted event */}
                  <div className="relative flex gap-4 pl-10">
                    <div className="absolute left-2.5 w-3 h-3 rounded-full bg-[#0ea5e9] border-2 border-white ring-2 ring-[#0ea5e9]/20 mt-1" />
                    <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">Bill Submitted</span>
                        <span className="text-xs text-gray-400">{bill.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Bill created and submitted for approval workflow</p>
                    </div>
                  </div>

                  {bill.approvers.map((approver, idx) => (
                    <div key={approver.id} className="relative flex gap-4 pl-10">
                      <div
                        className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white ring-2 mt-1 ${
                          approver.status === "approved"
                            ? "bg-green-500 ring-green-200"
                            : "bg-gray-300 ring-gray-200"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-lg p-3 border ${
                          approver.status === "approved"
                            ? "bg-green-50 border-green-100"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              {idx === 0 ? "1st" : idx === 1 ? "2nd" : "Final"} Approver
                            </span>
                            <span className="text-sm text-gray-600">— {approver.name}</span>
                            {approver.status === "approved" ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-100 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Pending
                              </span>
                            )}
                          </div>
                          {approver.timestamp && (
                            <span className="text-xs text-gray-400">{approver.timestamp}</span>
                          )}
                        </div>
                        {approver.notes && (
                          <p className="text-xs text-gray-500 italic mt-1">"{approver.notes}"</p>
                        )}
                        {approver.status === "pending" && (
                          <p className="text-xs text-amber-600 mt-1">Awaiting action from {approver.name}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {bill.approvalPhase === "fully_approved" && (
                    <div className="relative flex gap-4 pl-10">
                      <div className="absolute left-2.5 w-3 h-3 rounded-full bg-green-600 border-2 border-white ring-2 ring-green-200 mt-1" />
                      <div className="flex-1 bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-800">✓ Fully Approved</span>
                          <span className="text-xs text-gray-400">{bill.approvers[bill.approvers.length - 1]?.timestamp}</span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">All approvers have signed off. Bill ready for processing.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Amount (inc. GST)</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(bill.amount)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-800">{bill.date}</p>
                  {bill.dayWorksDocket && (
                    <>
                      <p className="text-xs text-gray-500 mt-2 mb-1">Day Works Docket</p>
                      <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{bill.dayWorksDocket}</span>
                    </>
                  )}
                </div>
              </div>

              {/* GST Adjustment */}
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h4 className="text-sm font-semibold text-amber-800">Adjust GST Figure</h4>
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Manual Override</span>
                </div>
                <p className="text-xs text-amber-700 mb-3">Adjust the GST amount to match the physical invoice. Subtotal will recalculate automatically.</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">Subtotal (excl. GST)</label>
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                      {formatCurrency(computedSubtotal)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">GST Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={gstValue}
                        onChange={(e) => setGstValue(e.target.value)}
                        className="w-full border border-amber-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium block mb-1">Total (inc. GST)</label>
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800">
                      {formatCurrency(bill.amount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Xero Sync */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Xero Sync Status</h4>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${XERO_STATUS_CONFIG[xeroStatus] || "bg-gray-100 text-gray-500"}`}>
                    {xeroStatus}
                  </span>
                </div>
                {xeroStatus === "Sync Error" && (
                  <p className="text-xs text-red-600 mb-3">Last sync attempt failed. Click below to retry sync with Xero.</p>
                )}
                {xeroStatus === "Not Synced" && (
                  <p className="text-xs text-gray-500 mb-3">This bill has not been synced to Xero yet.</p>
                )}
                {xeroStatus === "Synced" && (
                  <p className="text-xs text-green-600 mb-3">Bill is successfully synced with Xero.</p>
                )}
                {xeroStatus === "Syncing..." && (
                  <p className="text-xs text-blue-600 mb-3 animate-pulse">Syncing with Xero…</p>
                )}
                <button
                  onClick={handleSyncXero}
                  disabled={xeroStatus === "Synced" || xeroStatus === "Syncing..."}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    xeroStatus === "Synced" || xeroStatus === "Syncing..."
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#0ea5e9] text-white hover:bg-[#0284c7]"
                  }`}
                >
                  {xeroStatus === "Syncing..." ? "Syncing…" : "Retry Sync with Xero"}
                </button>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-700">Internal Notes</h3>
                <span className="text-xs text-gray-400">— added without modifying the docket</span>
              </div>

              {notes.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <p className="text-sm">No internal notes yet</p>
                </div>
              )}

              <div className="space-y-3">
                {notes.map((note, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700">{note.author}</span>
                      <span className="text-xs text-gray-400">{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700">{note.text}</p>
                  </div>
                ))}
              </div>

              <div className="border border-gray-200