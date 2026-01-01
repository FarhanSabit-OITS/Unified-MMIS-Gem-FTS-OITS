import { City, Market, Supplier, Ticket, TicketContext, TicketPriority, Vendor, UserRole, Product, GateToken, ParkingSlot, Requisition, Bid, AssetCCTV, PowerZone, StaffMember, Transaction } from "./types";

export const CITIES: City[] = [
  { id: 'c1', name: 'Kampala' },
  { id: 'c2', name: 'Mbarara' },
  { id: 'c3', name: 'Jinja' },
  { id: 'c4', name: 'Kabale' },
];

export const MARKETS: Market[] = [
  { id: 'm1', cityId: 'c1', name: 'Nakasero Market', type: 'MIXED', ownership: 'PUBLIC', establishmentDate: '1927-01-01' },
  { id: 'm2', cityId: 'c1', name: 'Owino Market', type: 'WHOLESALE', ownership: 'PUBLIC', establishmentDate: '1971-06-15' },
  { id: 'm3', cityId: 'c2', name: 'Mbarara Central', type: 'RETAIL', ownership: 'PPP', establishmentDate: '2010-03-20' },
  { id: 'm4', cityId: 'c3', name: 'Jinja Fresh', type: 'MIXED', ownership: 'PRIVATE', establishmentDate: '2018-11-05' },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Alice Namatovu', shopNumber: 'A-101', marketId: 'm1', status: 'ACTIVE', rentDue: 0, gender: 'FEMALE', age: 34, productsCount: 120, kycVerified: true, notes: 'Reliable tenant. Often requests early delivery of stock.', email: 'alice.n@example.com', phone: '+256 772 123 456' },
  { id: 'v2', name: 'John Okello', shopNumber: 'B-005', marketId: 'm1', status: 'SUSPENDED', rentDue: 500000, gender: 'MALE', age: 45, productsCount: 50, kycVerified: true, notes: 'Pending audit for last month due to missed VAT payment.', email: 'john.ok@example.com', phone: '+256 701 987 654' },
  { id: 'v3', name: 'Sarah Akello', shopNumber: 'C-202', marketId: 'm2', status: 'ACTIVE', rentDue: 150000, gender: 'FEMALE', age: 28, productsCount: 300, kycVerified: false, notes: 'New vendor application in progress for second shop.', email: 'sarah.ak@example.com', phone: '+256 753 555 444' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', companyName: 'AgroConnect Ug Ltd', rating: 4.8, totalRatings: 154, kycVerified: true, categories: ['Cereals', 'Vegetables'], trustScore: 92 },
  { id: 's2', companyName: 'Tech Supplies East', rating: 3.5, totalRatings: 42, kycVerified: true, categories: ['Electronics', 'CCTV'], trustScore: 65 },
  { id: 's3', companyName: 'Kampala Logistics', rating: 4.2, totalRatings: 89, kycVerified: false, categories: ['Transport', 'Packaging'], trustScore: 78 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'tx1', entityId: 'v1', date: '2023-10-25', amount: 500000, type: 'RENT', status: 'PAID', method: 'MTN_MOMO', reference: 'RENT-NOV-V1' },
    { id: 'tx2', entityId: 'gate', date: '2023-10-24', amount: 15000, type: 'GATE_FEE', status: 'PAID', method: 'CASH', reference: 'GATE-001' },
    { id: 'tx3', entityId: 's1', date: '2023-10-23', amount: 2500000, type: 'INCOME', status: 'ESCROW', method: 'BANK', reference: 'SUPPLY-REQ-88' },
    { id: 'tx4', entityId: 'v2', date: '2023-10-22', amount: 18000, type: 'VAT', status: 'PENDING', method: 'AIRTEL_MONEY', reference: 'TAX-OCT' },
    { id: 'tx5', entityId: 's1', date: '2023-10-21', amount: 450000, type: 'INCOME', status: 'PAID', method: 'WALLET', reference: 'SUPPLY-REQ-85' },
    { id: 'tx6', entityId: 'v1', date: '2023-10-20', amount: 120000, type: 'EXPENDITURE', status: 'PAID', method: 'CASH', reference: 'ELEC-BILL' },
    { id: 'tx7', entityId: 'v1', date: '2023-09-25', amount: 500000, type: 'RENT', status: 'PAID', method: 'MTN_MOMO', reference: 'RENT-OCT-V1' },
    { id: 'tx8', entityId: 'v2', date: '2023-10-01', amount: 200000, type: 'RENT', status: 'OVERDUE', method: 'CASH', reference: 'RENT-OCT-V2' },
];

export const MOCK_TICKETS: Ticket[] = [
  { 
    id: 't1', 
    title: 'CCTV Camera 4 Malfunction', 
    description: 'The camera at the North Gate is flickering and goes black every 10 minutes. It needs immediate replacement.',
    context: TicketContext.ASSET, 
    priority: TicketPriority.HIGH, 
    status: 'OPEN', 
    createdAt: '2023-10-25T10:00:00Z',
    createdByRole: UserRole.GATE_STAFF,
    marketId: 'm1'
  },
  { 
    id: 't2', 
    title: 'Rent Payment discrepancy', 
    description: 'Vendor ID v1 claims to have paid rent via Momo but the system shows pending. Transaction ID included in attachments.',
    context: TicketContext.SUPPORT, 
    priority: TicketPriority.MEDIUM, 
    status: 'ASSIGNED', 
    assignedTo: 'Admin Jane', 
    createdAt: '2023-10-24T14:30:00Z',
    createdByRole: UserRole.VENDOR,
    marketId: 'm1'
  },
  { 
    id: 't3', 
    title: 'Delivery truck blocked at Gate B', 
    description: 'A breakdown of a third-party truck is blocking the main supply entrance. Perishables are at risk.',
    context: TicketContext.SUPPLY, 
    priority: TicketPriority.CRITICAL, 
    status: 'RESOLVED', 
    createdAt: '2023-10-26T08:15:00Z',
    createdByRole: UserRole.SUPPLIER,
    marketId: 'm2'
  },
];

export const DUMMY_CREDENTIALS = [
  { label: 'Super Admin', email: 'super@mmis.tevas.ug', password: '123', role: UserRole.SUPER_ADMIN, marketId: null },
  { label: 'Market Admin (Nakasero)', email: 'admin.kla@mmis.tevas.ug', password: '123', role: UserRole.MARKET_ADMIN, marketId: 'm1' },
  { label: 'Vendor (Nakasero)', email: 'vendor@shop.com', password: '123', role: UserRole.VENDOR, marketId: 'm1' },
  { label: 'Supplier', email: 'supplier@agro.com', password: '123', role: UserRole.SUPPLIER },
  { label: 'Gate Staff (Nakasero)', email: 'gate@mmis.tevas.ug', password: '123', role: UserRole.GATE_STAFF, marketId: 'm1' },
  { label: 'General User', email: 'user@public.com', password: '123', role: UserRole.USER },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Organic Matooke', category: 'Food', stock: 45, price: 15000, sku: 'MTK-001' },
  { id: 'p2', name: 'Fresh Tomatoes (Box)', category: 'Food', stock: 12, price: 120000, sku: 'TMT-BOX' },
  { id: 'p3', name: 'Plastic Packaging Bags', category: 'Supplies', stock: 5000, price: 500, sku: 'PKG-SML' },
];

export const MOCK_TOKENS: GateToken[] = [
  { id: 'gt1', code: 'MMIS-ENT-8832', type: 'ENTRY', entityName: 'UBD 453K (Truck)', status: 'ACTIVE', generatedAt: '2023-10-27T08:30:00Z', generatedBy: 'Gate A', associatedFee: 5000, paymentStatus: 'PAID' },
  { id: 'gt2', code: 'MMIS-EXT-9911', type: 'EXIT', entityName: 'UAR 221X (Van)', status: 'USED', generatedAt: '2023-10-27T09:15:00Z', generatedBy: 'Gate B' },
];

export const MOCK_PARKING_SLOTS: ParkingSlot[] = [
  { id: 'ps1', number: 'A-01', zone: 'A', status: 'OCCUPIED', vehiclePlate: 'UBD 453K' },
  { id: 'ps2', number: 'A-02', zone: 'A', status: 'AVAILABLE' },
  { id: 'ps3', number: 'A-03', zone: 'A', status: 'AVAILABLE' },
  { id: 'ps4', number: 'B-01', zone: 'B', status: 'OCCUPIED', vehiclePlate: 'UAR 221X' },
  { id: 'ps5', number: 'B-02', zone: 'B', status: 'AVAILABLE' },
  { id: 'ps6', number: 'B-03', zone: 'B', status: 'RESERVED', vehiclePlate: 'ADMIN-1' },
];

export const MOCK_REQUISITIONS: Requisition[] = [
  {
    id: 'req1',
    vendorId: 'v1',
    vendorName: 'Alice Namatovu',
    marketId: 'm1',
    items: [{ name: 'Fresh Tomatoes', qty: 50, unit: 'Crates' }, { name: 'Onions', qty: 20, unit: 'Sacks' }],
    status: 'OPEN',
    createdAt: '2023-10-26T08:00:00Z',
    deadline: '2023-10-28T17:00:00Z'
  },
  {
    id: 'req2',
    vendorId: 'v3',
    vendorName: 'Sarah Akello',
    marketId: 'm2',
    items: [{ name: 'Plastic Packaging', qty: 1000, unit: 'Pcs' }],
    status: 'BIDDING',
    createdAt: '2023-10-27T09:30:00Z',
    deadline: '2023-10-29T12:00:00Z'
  }
];

export const MOCK_BIDS: Bid[] = [
  {
    id: 'b1',
    requisitionId: 'req1',
    supplierId: 's2',
    supplierName: 'Tech Supplies East',
    amount: 1200000,
    deliveryDate: '2023-10-29',
    status: 'PENDING',
    aiTrustScore: 88
  }
];

// --- Mock Assets & Staff ---

export const MOCK_CCTV: AssetCCTV[] = [
  { id: 'cam1', name: 'Main Gate Cam A', location: 'North Entrance', status: 'ONLINE', lastMaintenance: '2023-10-01', marketId: 'm1' },
  { id: 'cam2', name: 'Loading Bay 1', location: 'Zone A', status: 'RECORDING', lastMaintenance: '2023-10-15', marketId: 'm1' },
  { id: 'cam3', name: 'Perimeter Cam 4', location: 'East Wall', status: 'OFFLINE', lastMaintenance: '2023-09-20', marketId: 'm2' },
  { id: 'cam4', name: 'Market Central Hall', location: 'Center', status: 'ONLINE', lastMaintenance: '2023-10-01', marketId: 'm2' },
];

export const MOCK_POWER: PowerZone[] = [
  { id: 'pz1', floor: 'Ground Floor (Wholesale)', status: 'STABLE', load: 65, marketId: 'm1' },
  { id: 'pz2', floor: 'Level 1 (Retail)', status: 'FLUCTUATING', load: 88, marketId: 'm1' },
  { id: 'pz3', floor: 'Level 2 (Offices)', status: 'STABLE', load: 40, marketId: 'm2' },
];

export const MOCK_STAFF: StaffMember[] = [
  { id: 'st1', name: 'David Kasozi', role: 'SECURITY', shift: 'MORNING', status: 'ON_DUTY', phone: '077000001', marketId: 'm1' },
  { id: 'st2', name: 'Mary A.', role: 'CLEANER', shift: 'MORNING', status: 'ON_DUTY', phone: '077000002', marketId: 'm1' },
  { id: 'st3', name: 'Peter O.', role: 'MAINTENANCE', shift: 'AFTERNOON', status: 'OFF_DUTY', phone: '077000003', marketId: 'm2' },
];