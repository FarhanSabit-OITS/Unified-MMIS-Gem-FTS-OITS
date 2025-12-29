export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MARKET_ADMIN = 'MARKET_ADMIN',
  VENDOR = 'VENDOR',
  SUPPLIER = 'SUPPLIER',
  GATE_STAFF = 'GATE_STAFF',
  USER = 'USER'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TicketContext {
  SUPPORT = 'SUPPORT',
  ASSET = 'ASSET',
  SUPPLY = 'SUPPLY',
  COMPLAINT = 'COMPLAINT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  kycStatus?: ApplicationStatus;
}

export interface Market {
  id: string;
  name: string;
  cityId: string;
  type: 'WHOLESALE' | 'RETAIL' | 'MIXED';
  ownership: 'PUBLIC' | 'PRIVATE' | 'PPP';
  establishmentDate: string; // ISO Date string
}

export interface City {
  id: string;
  name: string;
}

export interface Vendor {
  id: string;
  name: string;
  shopNumber: string;
  marketId: string;
  status: 'ACTIVE' | 'SUSPENDED';
  rentDue: number;
  gender: 'MALE' | 'FEMALE';
  age: number;
  productsCount: number;
  kycVerified: boolean;
  notes?: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  rating: number; // 0-5
  totalRatings: number;
  kycVerified: boolean;
  categories: string[];
  trustScore?: number; // AI Generated
}

export interface Requisition {
  id: string;
  vendorId: string;
  vendorName: string;
  marketId: string;
  items: { name: string; qty: number; unit: string }[];
  status: 'OPEN' | 'BIDDING' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
  deadline: string;
}

export interface Bid {
  id: string;
  requisitionId: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  deliveryDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  aiTrustScore: number;
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  context: TicketContext;
  priority: TicketPriority;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  assignedTo?: string;
  summary?: string; // AI Generated summary
  createdAt: string;
  createdByRole?: UserRole; // To filter for non-admins
}

export interface Transaction {
  id: string;
  entityId?: string; // Link to Vendor or Supplier ID
  date: string;
  amount: number;
  type: 'RENT' | 'VAT' | 'TAX' | 'SUPPLY_PAYMENT' | 'INCOME' | 'GATE_FEE' | 'EXPENDITURE' | 'WITHDRAWAL';
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'ESCROW';
  method: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'BANK' | 'CASH' | 'WALLET';
  reference?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: 'REGULAR' | 'VISITOR';
  category: 'TRUCK' | 'VAN' | 'BIKE' | 'CAR';
  ownerName?: string;
  phone?: string;
  status: 'INSIDE' | 'OUTSIDE';
  parkedAt?: string; // Slot ID
  lastEntry?: string;
}

export interface ParkingSlot {
  id: string;
  number: string;
  zone: 'A' | 'B' | 'C'; // A=Trucks, B=Cars, C=Bikes
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  vehiclePlate?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  sku: string;
}

export interface Sale {
  id: string;
  date: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  totalAmount: number;
  paymentMethod: 'CASH' | 'MOMO' | 'CARD';
}

export interface GateToken {
  id: string;
  code: string;
  type: 'ENTRY' | 'EXIT';
  entityName: string; // Vehicle Plate or Person Name
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  generatedAt: string;
  generatedBy: string;
  associatedFee?: number;
  paymentStatus?: 'PAID' | 'PENDING';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  read: boolean;
}

// --- New Types for Asset Management ---

export interface AssetCCTV {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'RECORDING';
  lastMaintenance: string;
}

export interface PowerZone {
  id: string;
  floor: string;
  status: 'STABLE' | 'OUTAGE' | 'FLUCTUATING';
  load: number; // Percentage
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'SECURITY' | 'CLEANER' | 'MAINTENANCE' | 'ADMIN';
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  status: 'ON_DUTY' | 'OFF_DUTY' | 'LEAVE';
  phone: string;
}
