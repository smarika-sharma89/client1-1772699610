# Approvals — Varicon Prototype

Generated from a Varicon discovery session.

## What this demonstrates
The prototype should focus on the highest-priority item identified in next steps: the three-phase bill approval visibility feature. It should display a bills list view with enhanced status indicators that clearly show which approval phase each bill is currently in (e.g. 'Awaiting Approval', 'Partially Approved – Pending 2nd Approver', 'Awaiting Final Approval', 'Fully Approved'). Each bill row should show the names of assigned approvers and visually indicate which have approved and which are pending. A working filter panel should allow users to filter bills by a specific approver and their pending status. Clicking into a bill should show an approval timeline or audit trail panel displaying each approver, their status, and timestamps. The prototype should be interactive enough for Jess to validate the status labelling and filter behaviour before development begins.

## Features shown
- Additional approval status (e.g. 'final approval') to distinguish approval phases in multi-step approval workflows
- Fix approval filter to correctly filter bills by individual pending approver when multiple approvers are assigned
- Ability to directly adjust the GST figure on a bill so subtotal and GST match the physical invoice
- Fix bill sync reliability with Xero to prevent errors and eliminate need for manual sync intervention
- Ability to add internal notes or audit log entries to submitted Day Works dockets without reopening the docket or affecting the docket itself
- Ability for users to view, upload, and amend Day Works charge rates directly within Varicon
- WBS copy/duplicate functionality to apply the same Work Breakdown Structure assignment across all lines of a bill
- In-application approval status visibility to replace or supplement ineffective email notifications

## Running locally
```
npm install
npm run dev
```

## Note
This is a prototype with mock data. No real API calls are made.
