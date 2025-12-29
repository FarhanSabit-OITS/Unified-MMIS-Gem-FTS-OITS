# MMIS (Market Management Information System) - Master Developer Guide & SRS

## 1. Project Overview
**MMIS** is a multi-tenant SaaS application designed to digitize the operations of physical markets. It connects **Market Administrators**, **Vendors**, **Suppliers**, and **Operational Staff** (Gate/Stock) into a unified ecosystem. The system handles identity verification (KYC), financial transactions, supply chain logistics, vehicle tracking, and support ticketing, leveraged by AI for insights and trust scoring.

## 2. Tech Stack & Architecture
*   **Architecture:** BFF (Backend for Frontend) with Tenant Isolation.
*   **Frontend:** React 18+ (Next.js patterns adapted for SPA), Tailwind CSS, Shadcn UI (Conceptual), Lucide React (Icons), Recharts (Analytics).
*   **Backend (Reference):** ExpressJS, Prisma ORM, PostgreSQL.
*   **Authentication:** Server-side JWT, MFA, RBAC.
*   **AI Integration:** Google Gemini API (Trust Scoring, Ticket Summarization, Chatbot).

## 3. User Roles (RBAC)
1.  **Super Admin:** System-wide control, verifies Market Admins, high-level analytics.
2.  **Market Admin:** Manages specific market/city, verifies Vendors, tracks market revenue.
3.  **Vendor:** Rents shops, sells products, raises requisitions, pays dues.
4.  **Supplier:** Bids on requisitions, delivers goods, manages inventory.
5.  **Gate/Stock Staff:** Scans QRs, verifies entry/exit, checks stock.
6.  **User:** Public access, potential applicant.

## 4. Core Modules & User Stories

### A. Onboarding & KYC
*   **Registration:** Email verification link required.
*   **Role Application:** Users apply for Vendor or Admin dashboards from a common user dashboard.
*   **Market Admin Validation:** Emails MUST end in `@mmis.tevas.ug`. If valid, request routes to Super Admin; otherwise, blocked with alert.
*   **Location Logic:** Dropdowns are hierarchical: `City` -> `Market`. Market list is hidden until City is selected.

### B. Vendor Management
*   **List View:** Filter by Status (Active/Suspended), Gender, Rent Due, Age, Location.
*   **Search:** Deep search across vendor profiles.
*   **Details:** Modal with contact info, product count, financial status.
*   **Financials:** Transaction history (Rent, VAT, Taxes) with status toggling (Paid/Unpaid).
*   **QR:** Generate QR codes for Store Profile.

### C. Supplier Ecosystem (New Module)
*   **Network:** Directory of KYC-verified suppliers.
*   **Requisition & Bidding:**
    1.  Vendor requests goods (Requisition).
    2.  Suppliers view requests and Bid.
    3.  **AI Trust Score:** Bids are scored based on Rating, Distance, and History.
    4.  **Escrow:** Funds locked upon acceptance.
*   **Logistics Bridge:** Accepting a bid generates a **Gate Entry Token (QR)** for the supplier.
*   **Ratings:** Vendors rate suppliers (5-star system) after transaction completion.

### D. Vehicle & Gate Management
*   **Classification:** Regular Vehicles (Monthly pass) vs. One-time Visitors.
*   **Entry/Exit:** QR Token scanning at gates.
*   **Payments:** Gate fees (Parking, VAT) via MTN Momo, Airtel Money, Bank, Cash.

### E. Support & Ticketing
*   **Contexts:** General Support, Asset Maintenance (Bulb, CCTV), Supply Conflicts.
*   **Workflow:** Priority (Low -> Critical), Status (Open -> Resolved).
*   **AI Feature:** Contextual summary of long ticket threads using Gemini.

### F. Market Registry
*   **Categorization:** Ownership (Public/PPP), Type (Wholesale/Retail).
*   **Store Mapping:** Levels, Sections, Product Types.

## 5. Developer Instructions
*   **Type Safety:** Strict TypeScript interfaces for all entities (Vendor, Supplier, Ticket, Market).
*   **Validation:** Use Zod schemas for form validation (especially the `@mmis.tevas.ug` check).
*   **Styling:** Mobile-first Tailwind CSS.
*   **Performance:** Optimize list rendering for large datasets (Vendors/Logs).

---
*This document serves as the single source of truth for the MMIS development lifecycle.*
