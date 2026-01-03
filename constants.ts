
import { 
  MarketType, ProductCategory, VehicleCategory, PaymentType, 
  TicketContext, TicketPriority, UserRole, Vendor, Market, 
  Product, Transaction, Bid, Requisition, Ticket, GateToken, Supplier 
} from "./types";

export const MARKETS: Market[] = [
  { 
    id: 'm1', 
    cityId: 'c1', 
    name: 'Nakasero Fresh Hub', 
    type: MarketType.FARMERS, 
    ownership: 'PUBLIC', 
    establishmentDate: '1927-01-01',
    capacity: 1200,
    primaryProducts: ['Matooke', 'Vegetables', 'Fruits', 'Poultry'],
    latitude: 0.3136,
    longitude: 32.5811
  },
  { 
    id: 'm2', 
    cityId: 'c1', 
    name: 'Owino Wholesale', 
    type: MarketType.WHOLESALE, 
    ownership: 'PUBLIC', 
    establishmentDate: '1971-06-15',
    capacity: 50000,
    primaryProducts: ['Textiles', 'Electronics', 'Footwear', 'Hardware'],
    latitude: 0.3102,
    longitude: 32.5768
  },
  { 
    id: 'm3', 
    cityId: 'c2', 
    name: 'Mbarara Specialized', 
    type: MarketType.SPECIALIZED, 
    ownership: 'PPP', 
    establishmentDate: '2010-03-20',
    capacity: 5000,
    primaryProducts: ['Dairy Products', 'Beef', 'Grains'],
    latitude: -0.6071,
    longitude: 30.6545
  },
  { 
    id: 'm4', 
    cityId: 'c1', 
    name: 'Wandegeya Multi-Node', 
    type: MarketType.MIXED, 
    ownership: 'PUBLIC', 
    establishmentDate: '2014-01-10',
    capacity: 800,
    primaryProducts: ['Groceries', 'Cooked Food', 'Services'],
    latitude: 0.3325,
    longitude: 32.5744
  },
];

export const CITIES = [
  { id: 'c1', name: 'Kampala' },
  { id: 'c2', name: 'Mbarara' },
  { id: 'c3', name: 'Gulu' },
  { id: 'c4', name: 'Jinja' },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Alice Namatovu', shopNumber: 'A-101', marketId: 'm1', status: 'ACTIVE', rentDue: 0, rentDueDate: '2024-07-01', productsCount: 120, kycVerified: true, email: 'alice.n@mmis.ug', phone: '+256 772 123 456', storeType: ProductCategory.GROCERIES, age: 34, gender: 'FEMALE', section: 'FRESH_PRODUCE' },
  { id: 'v2', name: 'John Okello', shopNumber: 'B-005', marketId: 'm1', status: 'SUSPENDED', rentDue: 750000, rentDueDate: '2024-05-15', productsCount: 50, kycVerified: true, email: 'john.ok@mmis.ug', phone: '+256 701 987 654', storeType: ProductCategory.ELECTRONICS, age: 45, gender: 'MALE', section: 'DIGITAL_ZONE' },
  { id: 'v3', name: 'Sarah Akello', shopNumber: 'C-202', marketId: 'm2', status: 'ACTIVE', rentDue: 150000, rentDueDate: '2024-06-20', productsCount: 300, kycVerified: false, email: 'sarah.ak@mmis.ug', phone: '+256 753 555 444', storeType: ProductCategory.TEXTILES, age: 28, gender: 'FEMALE', section: 'APPAREL_HUB' },
  { id: 'v4', name: 'Kabuye Moses', shopNumber: 'D-102', marketId: 'm1', status: 'ACTIVE', rentDue: 2000000, rentDueDate: '2024-04-01', productsCount: 85, kycVerified: true, email: 'kabuye.m@mmis.ug', phone: '+256 782 111 222', storeType: ProductCategory.HARDWARE, age: 52, gender: 'MALE', section: 'CONSTRUCTION_ROW' },
  { id: 'v5', name: 'Nakato Mary', shopNumber: 'A-210', marketId: 'm2', status: 'ACTIVE', rentDue: 0, rentDueDate: '2024-06-30', productsCount: 210, kycVerified: true, email: 'mary.n@mmis.ug', phone: '+256 700 333 444', storeType: ProductCategory.GROCERIES, age: 31, gender: 'FEMALE', section: 'SPICE_ALLEY' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Premium Matooke', category: ProductCategory.GROCERIES, stock: 45, price: 25000, sku: 'MTK-001' },
  { id: 'p2', name: 'LED Smart Bulb', category: ProductCategory.ELECTRONICS, stock: 120, price: 15000, sku: 'LIT-44' },
  { id: 'p3', name: 'Heavy Duty Shovel', category: ProductCategory.HARDWARE, stock: 15, price: 45000, sku: 'TLS-HD' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // History for Alice (v1) - Paid
  { id: 'tx-v1-1', entityId: 'v1', marketId: 'm1', date: '2024-05-01', amount: 500000, type: PaymentType.RENT, status: 'PAID', method: 'MTN_MOMO', reference: 'RENT-MAY-V1', description: 'Monthly Shop Rent' },
  { id: 'tx-v1-2', entityId: 'v1', marketId: 'm1', date: '2024-05-01', amount: 90000, type: PaymentType.URA_VAT, status: 'PAID', method: 'MTN_MOMO', reference: 'VAT-MAY-V1', description: 'URA VAT Compliance' },
  { id: 'tx-v1-3', entityId: 'v1', marketId: 'm1', date: '2024-04-02', amount: 500000, type: PaymentType.RENT, status: 'PAID', method: 'BANK', reference: 'RENT-APR-V1' },
  
  // History for John (v2) - Pending/Overdue
  { id: 'tx-v2-1', entityId: 'v2', marketId: 'm1', date: '2024-05-15', amount: 750000, type: PaymentType.RENT, status: 'OVERDUE', method: 'CASH', reference: 'RENT-MAY-V2' },
  { id: 'tx-v2-2', entityId: 'v2', marketId: 'm1', date: '2024-05-15', amount: 135000, type: PaymentType.URA_VAT, status: 'PENDING', method: 'AIRTEL_MONEY', reference: 'VAT-MAY-V2' },
  
  // History for Sarah (v3) - Pending
  { id: 'tx-v3-1', entityId: 'v3', marketId: 'm2', date: '2024-05-20', amount: 150000, type: PaymentType.RENT, status: 'PENDING', method: 'AIRTEL_MONEY', reference: 'RENT-MAY-V3' },
  
  // System/Gate Transactions
  { id: 'tx-g1', entityId: 'gate-01', marketId: 'm1', date: '2024-05-18', amount: 15000, type: PaymentType.GATE_FEE, status: 'PAID', method: 'CASH', reference: 'GATE-ENTRY-001' },
  { id: 'tx-g2', entityId: 'gate-01', marketId: 'm1', date: '2024-05-18', amount: 2000, type: PaymentType.GATE_FEE, status: 'PAID', method: 'MTN_MOMO', reference: 'GATE-ENTRY-002' },
  
  // Supplier Transactions
  { id: 'tx-s1', entityId: 's1', marketId: 'm1', date: '2024-05-19', amount: 2500000, type: PaymentType.SUPPLY_ESCROW, status: 'ESCROW', method: 'BANK', reference: 'SUPPLY-REQ-99' },
  { id: 'tx-s2', entityId: 's1', marketId: 'm1', date: '2024-05-10', amount: 50000, type: PaymentType.SERVICE_CHARGE, status: 'PAID', method: 'MTN_MOMO', reference: 'SVC-CHG-101' },
];

export const MOCK_BIDS: Bid[] = [
  { id: 'b1', requisitionId: 'req1', supplierId: 's2', supplierName: 'Tech Supplies East', amount: 1200000, deliveryDate: '2024-05-20', status: 'ACCEPTED', aiTrustScore: 88 },
];

export const MOCK_REQUISITIONS: Requisition[] = [
  { id: 'req1', vendorId: 'v1', vendorName: 'Alice Namatovu', items: [{ name: 'Onions', qty: 50, unit: 'Sacks' }], status: 'OPEN', createdAt: '2024-05-01T08:00:00Z', deadline: '2024-05-10T17:00:00Z', marketId: 'm1' },
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
  { label: 'Vendor Node', email: 'vendor@shop.com', password: '123', role: UserRole.VENDOR, id: 'v1', marketId: 'm1' },
  { label: 'Supplier Node', email: 'supplier@agro.com', password: '123', role: UserRole.SUPPLIER, id: 's1' },
  { label: 'Gate Security', email: 'gate@mmis.tevas.ug', password: '123', role: UserRole.GATE_STAFF, marketId: 'm1' },
];
