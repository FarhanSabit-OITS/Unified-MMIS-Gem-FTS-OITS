
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MARKET_ADMIN = 'MARKET_ADMIN',
  VENDOR = 'VENDOR',
  SUPPLIER = 'SUPPLIER',
  GATE_STAFF = 'GATE_STAFF',
  USER = 'USER'
}

export enum MarketType {
  WHOLESALE = 'WHOLESALE',
  RETAIL = 'RETAIL',
  FARMERS = 'FARMERS',
  FLEA = 'FLEA',
  SPECIALIZED = 'SPECIALIZED',
  MIXED = 'MIXED'
}

export enum ProductCategory {
  GROCERIES = 'GROCERIES',
  TEXTILES = 'TEXTILES',
  ELECTRONICS = 'ELECTRONICS',
  HARDWARE = 'HARDWARE',
  LIVESTOCK = 'LIVESTOCK',
  GENERAL = 'GENERAL'
}

export enum VehicleCategory {
  HEAVY_TRUCK = 'HEAVY_TRUCK',
  LIGHT_VAN = 'LIGHT_VAN',
  MOTORBIKE = 'MOTORBIKE',
  SALOON_CAR = 'SALOON_CAR'
}

export enum PaymentType {
  RENT = 'RENT',
  URA_VAT = 'URA_VAT',
  LOCAL_LEVY = 'LOCAL_LEVY',
  GATE_FEE = 'GATE_FEE',
  UTILITY = 'UTILITY',
  FINE = 'FINE',
  SERVICE_CHARGE = 'SERVICE_CHARGE',
  SUPPLY_ESCROW = 'SUPPLY_ESCROW'
}

export enum TicketContext {
  SUPPORT = 'SUPPORT',
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
  TRADE_DISPUTE = 'TRADE_DISPUTE',
  UTILITY_FAILURE = 'UTILITY_FAILURE',
  ASSET = 'ASSET',
  SUPPLY = 'SUPPLY',
  COMPLAINT = 'COMPLAINT'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  marketId?: string;
  isVerified?: boolean;
}

export interface UserProfile extends User {
  phone?: string;
  avatarUrl?: string;
  kycStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Market {
  id: string;
  name: string;
  cityId: string;
  type: MarketType;
  ownership: 'PUBLIC' | 'PRIVATE' | 'PPP';
  establishmentDate: string;
  capacity: number;
  primaryProducts: string[];
  latitude: number;
  longitude: number;
}

export interface Vendor {
  id: string;
  name: string;
  shopNumber: string;
  marketId: string;
  status: 'ACTIVE' | 'SUSPENDED';
  rentDue: number;
  rentDueDate?: string;
  email?: string;
  phone?: string;
  productsCount: number;
  kycVerified: boolean;
  storeType?: ProductCategory;
  section?: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  lastPaymentDate?: string;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  category: ProductCategory;
  stock: number;
  price: number;
  sku: string;
}

export interface Transaction {
  id: string;
  entityId: string;
  marketId: string; // Added for administrative scoping
  date: string;
  amount: number;
  taxAmount?: number;
  type: PaymentType;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'ESCROW' | 'FLAGGED';
  method: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'BANK' | 'CASH';
  reference?: string;
  description?: string;
}

export interface GateToken {
  id: string;
  code: string;
  type: 'ENTRY' | 'EXIT';
  entityName: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  generatedAt: string;
  vehicleType?: VehicleCategory;
  associatedFee: number;
  taxAmount: number;
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

export interface Requisition {
  id: string;
  vendorId: string;
  vendorName: string;
  items: { name: string; qty: number; unit: string }[];
  status: 'OPEN' | 'BIDDING' | 'FULFILLED';
  createdAt: string;
  deadline: string;
  marketId?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  context: TicketContext;
  priority: TicketPriority;
  status: 'OPEN' | 'ASSIGNED' | 'RESOLVED';
  createdAt: string;
  createdByRole: UserRole;
  marketId: string;
  assignedTo?: string;
  attachmentUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  read: boolean;
}

export interface Supplier {
  id: string;
  companyName: string;
  rating: number;
  totalRatings: number;
  categories: string[];
  trustScore?: number;
  kycVerified: boolean;
}

export interface Sale {
  id: string;
  date: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  totalAmount: number;
  taxAmount: number;
  paymentMethod: 'CASH' | 'MOMO' | 'CARD';
}

export interface Order {
  id: string;
  customerName: string;
  vendorName: string;
  items: any[];
  total: number;
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  type: 'INCOMING' | 'OUTGOING';
  tags?: string[];
}