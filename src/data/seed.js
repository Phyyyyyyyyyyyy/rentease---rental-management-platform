export const seedUsers = [
  {
    id: 'u-admin',
    name: 'System Administrator',
    email: 'admin@rentease.local',
    password: 'admin123',
    role: 'Admin',
    phone: '0917 000 0001',
    status: 'Active',
    createdAt: '2026-11-01T08:00:00.000Z'
  },
  {
    id: 'u-owner',
    name: 'Maria Santos',
    email: 'owner@rentease.local',
    password: 'owner123',
    role: 'Property Owner',
    phone: '0917 000 0002',
    status: 'Active',
    createdAt: '2026-11-01T08:10:00.000Z'
  },
  {
    id: 'u-tenant',
    name: 'Juan Dela Cruz',
    email: 'tenant@rentease.local',
    password: 'tenant123',
    role: 'Tenant',
    phone: '0917 000 0003',
    status: 'Active',
    createdAt: '2026-11-01T08:20:00.000Z'
  },
  {
    id: 'u-staff',
    name: 'Ana Reyes',
    email: 'staff@rentease.local',
    password: 'staff123',
    role: 'Staff',
    phone: '0917 000 0004',
    status: 'Active',
    createdAt: '2026-11-01T08:30:00.000Z'
  }
];

export const seedProperties = [
  {
    id: 'p-1',
    ownerId: 'u-owner',
    name: 'Cebu City Residences',
    address: 'Salinas Drive, Lahug',
    city: 'Cebu City',
    type: 'Apartment',
    description: 'Accessible apartment property near schools, offices, and public transportation.',
    amenities: ['Wi-Fi Ready', 'Parking', 'CCTV'],
    units: [
      { id: 'un-1', name: 'Unit 101', bedrooms: 1, bathrooms: 1, monthlyRent: 8500, status: 'Vacant', size: 28 },
      { id: 'un-2', name: 'Unit 102', bedrooms: 1, bathrooms: 1, monthlyRent: 8500, status: 'Occupied', size: 28 },
      { id: 'un-3', name: 'Unit 201', bedrooms: 2, bathrooms: 1, monthlyRent: 12000, status: 'Vacant', size: 40 }
    ]
  },
  {
    id: 'p-2',
    ownerId: 'u-owner',
    name: 'Banilad Townhomes',
    address: 'Gov. M. Cuenco Avenue, Banilad',
    city: 'Cebu City',
    type: 'Townhouse',
    description: 'Quiet residential units with practical access to commercial areas and transport routes.',
    amenities: ['Parking', 'Pet Friendly', 'Water Included'],
    units: [
      { id: 'un-4', name: 'Townhome A', bedrooms: 2, bathrooms: 2, monthlyRent: 18000, status: 'Vacant', size: 68 },
      { id: 'un-5', name: 'Townhome B', bedrooms: 2, bathrooms: 2, monthlyRent: 18500, status: 'Vacant', size: 70 }
    ]
  },
  {
    id: 'p-3',
    ownerId: 'u-owner',
    name: 'Mabolo Studio Hub',
    address: 'M.J. Cuenco Avenue, Mabolo',
    city: 'Cebu City',
    type: 'Studio',
    description: 'Compact studio units intended for students and young professionals.',
    amenities: ['Wi-Fi Ready', 'CCTV'],
    units: [
      { id: 'un-6', name: 'Studio 3A', bedrooms: 0, bathrooms: 1, monthlyRent: 7000, status: 'Occupied', size: 20 },
      { id: 'un-7', name: 'Studio 3B', bedrooms: 0, bathrooms: 1, monthlyRent: 7200, status: 'Vacant', size: 21 }
    ]
  }
];

export const seedApplications = [
  {
    id: 'a-1',
    propertyId: 'p-1',
    unitId: 'un-3',
    tenantId: 'u-tenant',
    message: 'I am interested in the two-bedroom unit and can move in next month.',
    status: 'Pending',
    createdAt: '2026-11-02T09:00:00.000Z'
  }
];
