
import { 
  MarketType, ProductCategory, VehicleCategory, PaymentType, 
  TicketContext, TicketPriority, UserRole, Vendor, Market, 
  Product, Transaction, Bid, Requisition, Ticket, GateToken, Supplier 
} from "./types";

export const MARKETS: Market[] = [
  { id: 'm1', cityId: 'c1', name: 'Nakasero Fresh Hub', type: MarketType.FARMERS, ownership: 'PUBLIC', establishmentDate: '1927-01-01' },
  { id: 'm2', cityId: 'c1', name: 'Owino Wholesale', type: MarketType.WHOLESALE, ownership: 'PUBLIC', establishmentDate: '1971-06-15' },
  { id: 'm3', cityId: 'c2', name: 'Mbarara Specialized', type: MarketType.SPECIALIZED, ownership: 'PPP', establishmentDate: '2010-03-20' },
];

export const CITIES = [
  { id: 'c1', name: 'Kampala' },
  { id: 'c2', name: 'Mbarara' },
  { id: 'c3', name: 'Gulu' },
  { id: 'c4', name: 'Jinja' },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Alice Namatovu', shopNumber: 'A-101', marketId: 'm1', status: 'ACTIVE', rentDue: 0, rentDueDate: '2024-06-01', productsCount: 120, kycVerified: true, email: 'alice.n@example.com', phone: '+256 772 123 456', storeType: ProductCategory.GROCERIES, age: 34, gender: 'FEMALE' },
  { id: 'v2', name: 'John Okello', shopNumber: 'B-005', marketId: 'm1', status: 'SUSPENDED', rentDue: 750000, rentDueDate: '2024-05-15', productsCount: 50, kycVerified: true, email: 'john.ok@example.com', phone: '+256 701 987 654', storeType: ProductCategory.ELECTRONICS, age: 45, gender: 'MALE' },
  { id: 'v3', name: 'Sarah Akello', shopNumber: 'C-202', marketId: 'm2', status: 'ACTIVE', rentDue: 150000, rentDueDate: '2024-05-20', productsCount: 300, kycVerified: false, email: 'sarah.ak@example.com', phone: '+256 753 555 444', storeType: ProductCategory.TEXTILES, age: 28, gender: 'FEMALE' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Premium Matooke', category: ProductCategory.GROCERIES, stock: 45, price: 25000, sku: 'MTK-001' },
  { id: 'p2', name: 'LED Smart Bulb', category: ProductCategory.ELECTRONICS, stock: 120, price: 15000, sku: 'LIT-44' },
  { id: 'p3', name: 'Heavy Duty Shovel', category: ProductCategory.HARDWARE, stock: 15, price: 45000, sku: 'TLS-HD' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', entityId: 'v2', date: '2023-11-01', amount: 200000, type: PaymentType.RENT, status: 'PAID', method: 'MTN_MOMO', reference: 'RENT-NOV-V2' },
  { id: 'tx2', entityId: 'gate', date: '2023-11-02', amount: 5000, type: PaymentType.GATE_FEE, status: 'PAID', method: 'CASH' },
  { id: 'tx3', entityId: 'v1', date: '2023-11-03', amount: 18000, type: PaymentType.URA_VAT, status: 'PENDING', method: 'AIRTEL_MONEY' },
  { id: 'tx4', entityId: 'v3', date: '2023-11-04', amount: 45000, type: PaymentType.UTILITY, status: 'PAID', method: 'BANK' },
];

export const MOCK_BIDS: Bid[] = [
  { id: 'b1', requisitionId: 'req1', supplierId: 's2', supplierName: 'Tech Supplies East', amount: 1200000, deliveryDate: '2024-05-20', status: 'ACCEPTED', aiTrustScore: 88 },
];

export const MOCK_REQUISITIONS: Requisition[] = [
  { id: 'req1', vendorId: 'v1', vendorName: 'Alice Namatovu', items: [{ name: 'Onions', qty: 50, unit: 'Sacks' }], status: 'OPEN', createdAt: '2023-11-01T08:00:00Z', deadline: '2023-11-10T17:00:00Z', marketId: 'm1' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', companyName: 'Agro Uganda Ltd', rating: 4.5, totalRatings: 120, categories: ['Groceries', 'Livestock'], trustScore: 92, kycVerified: true },
  { id: 's2', companyName: 'Tech Supplies East', rating: 4.0, totalRatings: 45, categories: ['Electronics', 'Hardware'], trustScore: 88, kycVerified: true },
];

export const MOCK_TICKETS: Ticket[] = [
  { id: 't1', title: 'Leaking Roof Unit A-101', description: 'Major leak during heavy rain.', context: TicketContext.MAINTENANCE, priority: TicketPriority.HIGH, status: 'OPEN', createdAt: '2023-11-01T08:00:00Z', createdByRole: UserRole.VENDOR, marketId: 'm1' },
  { id: 't2', title: 'Power Surge Quadrant B', description: 'Regular surges affecting electronics.', context: TicketContext.UTILITY_FAILURE, priority: TicketPriority.CRITICAL, status: 'OPEN', createdAt: '2023-11-05T14:20:00Z', createdByRole: UserRole.VENDOR, marketId: 'm1' },
];

export const MOCK_STAFF = [
  { id: 'st1', name: 'James Kato', role: 'Security', shift: 'Night', phone: '+256 700 111 222', status: 'ON_DUTY', marketId: 'm1' },
];

export const MOCK_TOKENS: GateToken[] = [
  { id: 'gt1', code: 'MMIS-ENT-1234', type: 'ENTRY', entityName: 'Truck 1', status: 'ACTIVE', generatedAt: new Date().toISOString(), vehicleType: VehicleCategory.HEAVY_TRUCK, associatedFee: 15000, taxAmount: 2700 },
];

export const MOCK_CCTV = [
  { id: 'cam1', name: 'Main Gate Cam 1', location: 'Entrance', status: 'ONLINE', marketId: 'm1', lastMaintenance: '2023-10-15' },
];

export const MOCK_POWER = [
  { id: 'pwr1', floor: 'Ground Floor', status: 'STABLE', load: 45, marketId: 'm1' },
];

export const DUMMY_CREDENTIALS = [
  { label: 'Super Admin', email: 'super@mmis.tevas.ug', password: '123', role: UserRole.SUPER_ADMIN },
  { label: 'Market Admin', email: 'admin@mmis.tevas.ug', password: '123', role: UserRole.MARKET_ADMIN, marketId: 'm1' },
  { label: 'Vendor Node', email: 'vendor@shop.com', password: '123', role: UserRole.VENDOR, marketId: 'm1' },
  { label: 'Supplier Node', email: 'supplier@agro.com', password: '123', role: UserRole.SUPPLIER },
  { label: 'Gate Security', email: 'gate@mmis.tevas.ug', password: '123', role: UserRole.GATE_STAFF, marketId: 'm1' },
];
