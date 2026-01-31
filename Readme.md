# Smart Reconciliation & Audit System

A full-stack MERN-based system to upload transaction data, reconcile it against system records, detect mismatches and duplicates, and maintain a complete immutable audit trail.

This project is designed with scalability, auditability, and real-world enterprise requirements in mind.

---

## 🚀 Tech Stack

- **Frontend**: React (planned)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Architecture**: MVC + Service-style Controllers
- **Async Processing**: Non-blocking background processing
- **Auth**: JWT + Role-Based Access (Admin, Analyst, Viewer)

---

## 🧠 System Architecture Overview

```text
Client
  ↓
Routes (Express)
  ↓
Controllers (Business Logic)
  ↓
Models (MongoDB)
  ↓
Audit Logs (Immutable)

backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── app.js
├── server.js
└── .env

🔁 Core Features
1️⃣ File Upload & Ingestion

Supports CSV uploads

Stream-based parsing (memory efficient)

Handles large files (50k+ rows)

Idempotent uploads using file hash

2️⃣ Reconciliation Engine

Records are classified as:

Matched (Transaction ID + Amount)

Partially Matched (Reference Number + configurable amount variance)

Duplicate (Same Transaction ID)

Unmatched

🔧 Matching rules are database-driven, not hard-coded.

3️⃣ Configurable Matching Rules

Matching behavior is stored in MongoDB:

Exact match fields

Partial match reference field

Amount variance percentage

Rules can be changed without redeploying code.

4️⃣ Audit Logs (Immutable)

All system and manual actions are logged

Each audit entry captures:

Entity type & ID

Old value

New value

User

Timestamp

Source (system/manual)

Logs are append-only (never updated or deleted)

5️⃣ Dashboard Statistics

Provides:

Total records

Matched / Partial / Unmatched / Duplicate counts

Reconciliation accuracy percentage

Uses MongoDB aggregation for performance.

6️⃣ Timeline View (Backend Logic)

Each record exposes a chronological audit timeline

Powered by immutable audit logs

Enables visual timeline rendering in UI

7️⃣ Manual Correction + Auto Reconciliation

Analysts/Admins can manually correct records

Changes are audited immutably

Reconciliation is automatically re-run after correction

🔐 Authentication & Authorization

Roles:

Admin → full access

Analyst → upload & reconcile

Viewer → read-only

Role enforcement exists at both route and controller level.

(Auth testing enabled at final stage)

⚙️ Non-Functional Design Decisions

Non-blocking processing: Uploads return immediately

Scalable reconciliation: Rules and logic decoupled

High auditability: Immutable logs for compliance

Clean separation of concerns: MVC-based design

⚠️ Assumptions & Limitations

CSV format assumed for ingestion (Excel can be added)

Reconciliation currently runs per upload job

Optimizations like record-level reconciliation can be added later

Frontend UI planned but not required for backend evaluation

📌 Future Enhancements

Excel file support

UI dashboard with charts

Rule management UI

Real-time job progress tracking

Optimized reconciliation for very large datasets

👤 Author

Ayush Abhinandan
B.Tech Graduate | Aspiring Backend / Full Stack Developer

BACKEND LIVE LINK - https://smart-reconciliation-sysytem.onrender.com/


github repo link - https://github.com/ayushabhinandan269-png/SMART-RECONCILIATION-SYSYTEM.git