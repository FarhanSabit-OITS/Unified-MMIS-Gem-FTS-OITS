export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MARKET_ADMIN = 'MARKET_ADMIN',
  VENDOR = 'VENDOR',
  SUPPLIER = 'SUPPLIER',
  GATE_STAFF = 'GATE_STAFF',
  USER = 'USER'
}

// Alias for compatibility with new Auth components
export type Role = UserRole;

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
  marketId?: string; // RBAC: Links admin/staff to a specific market
}

// Extended interface for the new App.tsx logic
export interface UserProfile extends User {
  isVerified?: boolean;
  mfaEnabled?: boolean;
  profileImage?: string;
  settings?: {
    lowStockThreshold?: number;
    criticalStockThreshold?: number;
    notifications?: {
      email: boolean;
      browser: boolean;
      sms: boolean;
    }
  };
}

export interface Market {
  id: string;
  name: string;
  cityId: string;
  type: 'WHOLESALE' | 'RETAIL' | 'MIXED';
  ownership: 'PUBLIC' | 'PRIVATE' | 'PPP';
  establishmentDate: string; // ISO Date string
  capacity?: number;
  primaryProducts?: string[];
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
  vatDue?: number;
  gender: 'MALE' | 'FEMALE';
  age: number;
  productsCount: number;
  kycVerified: boolean;
  notes?: string;
  joinedDate?: string;
  city?: string;
  market?: string;
  level?: string;
  section?: string;
  storeType?: string;
  ownershipType?: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  rating: number; // 0-5
  totalRatings: number;
  kycVerified: boolean;
  categories: string[];
  trustScore?: number; // AI Generated
  email?: string;
  status?: string;
  warehouseLocation?: string;
  suppliedItemsCount?: number;
  walletBalance?: number;
  totalRevenue?: number;
  pendingPayouts?: number;
  showcase?: SupplierShowcaseItem[];
}

export interface SupplierShowcaseItem {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  category: string;
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
  budget?: number;
  description?: string;
  bids?: Bid[];
  itemName?: string; // For compatibility
  quantity?: number; // For compatibility
  unit?: string; // For compatibility
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
  creatorId?: string;
  creatorName?: string;
  marketId?: string; // RBAC: Ticket belongs to a market context
  attachmentUrl?: string;
  assetType?: string;
  assignedToId?: string;
  assignedToName?: string;
}

export interface Transaction {
  id: string;
  entityId?: string; // Link to Vendor or Supplier ID
  date: string;
  amount: number;
  taxAmount?: number; // VAT or Levy portion
  netAmount?: number; // Amount without tax
  type: 'RENT' | 'VAT' | 'TAX' | 'SUPPLY_PAYMENT' | 'INCOME' | 'GATE_FEE' | 'EXPENDITURE' | 'WITHDRAWAL' | 'SALE_REVENUE' | 'SERVICE_CHARGE' | 'FINE' | 'UTILITY' | 'LEVY';
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'ESCROW' | 'SUCCESS' | 'FAILED' | 'FLAGGED' | 'REMITTED';
  method: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'BANK' | 'CASH' | 'WALLET' | 'CARD' | 'VISA';
  reference?: string;
  referenceId?: string;
  direction?: 'IN' | 'OUT';
  verifiedBy?: string;
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
  zone: 'A' | 'B' | 'C' | 'ALPHA' | 'BETA' | 'GAMMA'; // A=Trucks, B=Cars, C=Bikes
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
  description?: string;
  vendor?: string;
  status?: 'HEALTHY' | 'LOW' | 'CRITICAL' | 'PENDING_APPROVAL';
  isFeatured?: boolean;
}

export interface Sale {
  id: string;
  date: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  totalAmount: number;
  taxAmount?: number;
  paymentMethod: 'CASH' | 'MOMO' | 'CARD';
}

export interface GateToken {
  id: string;
  code: string;
  type: 'ENTRY' | 'EXIT';
  entityName: string; // Vehicle Plate or Person Name
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  generatedAt: string;
  exitAt?: string; // For duration calc
  durationMinutes?: number; 
  generatedBy: string;
  associatedFee?: number; // Total Fee
  taxAmount?: number; // Calculated VAT
  overstayFee?: number;
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

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  vendorName: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  type: 'INCOMING' | 'OUTGOING';
  tags?: string[];
}

// --- New Types for Asset Management ---

export interface AssetCCTV {
  id: string;
  name: string;
  location: string;
  marketId: string; // RBAC
  status: 'ONLINE' | 'OFFLINE' | 'RECORDING';
  lastMaintenance: string;
}

export interface PowerZone {
  id: string;
  floor: string;
  marketId: string; // RBAC
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
  marketId: string;
}

export interface StockLog {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  vendor: string;
  type: 'INBOUND' | 'OUTBOUND';
  timestamp: string;
  inspector: string;
  status: 'VERIFIED' | 'FLAGGED' | 'PENDING';
}

export interface ManifestItem {
  id: string;
  vendorId: string;
  vendorName: string;
  itemName: string;
  qty: number;
  estPrice: number;
  paid: boolean;
}

export interface BridgeLogistics {
  id: string;
  dispatchDate: string;
  status: 'PREPARING' | 'EN_ROUTE' | 'COMPLETED';
  capacity: number;
  items: ManifestItem[];
}