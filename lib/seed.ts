import { prisma } from "./prisma";
import { hashPassword } from "./auth";

async function seed() {
  console.log("🌱 Seeding database...");

  const defaultPassword = await hashPassword("password123");

  // --- Hotels ---
  const nilePalace = await prisma.hotel.create({
    data: {
      name: "Nile Palace Hotel",
      legalName: "Nile Palace Hotels SAE",
      taxId: "100-234-567",
      commercialReg: "CR-2020-001",
      address: "12 Nile Corniche, Maadi",
      city: "Cairo",
      governorate: "Cairo",
      phone: "+20 2 2520 3000",
      email: "procurement@nilepalace.com",
      starRating: 5,
      roomCount: 350,
      tier: "PREMIER",
      creditLimit: 2500000,
      creditUsed: 450000,
    },
  });

  const alexResort = await prisma.hotel.create({
    data: {
      name: "Alexandria Coastal Resort",
      legalName: "Alexandria Coastal Resorts SAE",
      taxId: "100-345-678",
      commercialReg: "CR-2019-002",
      address: "45 Corniche Road",
      city: "Alexandria",
      governorate: "Alexandria",
      phone: "+20 3 5480 1000",
      email: "procurement@alexresort.com",
      starRating: 4,
      roomCount: 180,
      tier: "COASTAL",
      creditLimit: 1200000,
      creditUsed: 180000,
    },
  });

  // --- Properties ---
  await prisma.property.createMany({
    data: [
      {
        hotelId: nilePalace.id,
        name: "Nile Palace - Downtown",
        city: "Cairo",
        governorate: "Cairo",
        address: "12 Nile Corniche",
        roomCount: 200,
      },
      {
        hotelId: nilePalace.id,
        name: "Nile Palace - 6th of October",
        city: "6th of October",
        governorate: "Giza",
        address: "Industrial Zone B",
        roomCount: 150,
      },
      {
        hotelId: alexResort.id,
        name: "Alexandria Coastal - Main",
        city: "Alexandria",
        governorate: "Alexandria",
        address: "45 Corniche Road",
        roomCount: 180,
      },
    ],
  });

  // --- Suppliers ---
  const foodSupply = await prisma.supplier.create({
    data: {
      name: "Al-Gomhouria Food Supply",
      legalName: "Al-Gomhouria Food Supply Co.",
      taxId: "200-123-456",
      commercialReg: "CR-2018-050",
      address: "15 Salah Salem Street",
      city: "Cairo",
      governorate: "Cairo",
      phone: "+20 2 2400 5500",
      email: "orders@gomhouria-food.com",
      certifications: "ISO 22000, HACCP",
      bankAccount: "1234567890",
      bankName: "National Bank of Egypt",
    },
  });

  const linenCo = await prisma.supplier.create({
    data: {
      name: "Cotton House Linens",
      legalName: "Cotton House for Textiles SAE",
      taxId: "200-234-567",
      commercialReg: "CR-2017-021",
      address: "8 Industrial Zone, 10th of Ramadan",
      city: "10th of Ramadan",
      governorate: "Sharqia",
      phone: "+20 15 555 7890",
      email: "sales@cottonhouse-eg.com",
      certifications: "OEKO-TEX, ISO 9001",
      bankAccount: "2345678901",
      bankName: "Banque du Caire",
    },
  });

  const cleaningSupplies = await prisma.supplier.create({
    data: {
      name: "CleanMax Professional",
      legalName: "CleanMax Chemicals SAE",
      taxId: "200-345-678",
      commercialReg: "CR-2019-033",
      address: "42 Industrial Area, 6th of October",
      city: "6th of October",
      governorate: "Giza",
      phone: "+20 2 3830 4400",
      email: "b2b@cleanmax-eg.com",
      bankAccount: "3456789012",
      bankName: "Commercial International Bank",
    },
  });

  const poolSupply = await prisma.supplier.create({
    data: {
      name: "AquaPro Pool & Spa",
      legalName: "AquaPro Chemicals SAE",
      taxId: "200-456-789",
      commercialReg: "CR-2021-044",
      address: "7 Industrial Zone, Alexandria",
      city: "Alexandria",
      governorate: "Alexandria",
      phone: "+20 3 5520 8800",
      email: "orders@aquapro-eg.com",
      bankAccount: "4567890123",
      bankName: "Alexandria Bank",
    },
  });

  const ffeSupplier = await prisma.supplier.create({
    data: {
      name: "El-Nasr Furniture & Fixtures",
      legalName: "El-Nasr for Furniture SAE",
      taxId: "200-567-890",
      commercialReg: "CR-2016-055",
      address: "55 Furniture District, Damietta",
      city: "Damietta",
      governorate: "Damietta",
      phone: "+20 50 2345 678",
      email: "b2b@elnasr-ffe.com",
      bankAccount: "5678901234",
      bankName: "Misr Bank",
    },
  });

  const serviceSupplier = await prisma.supplier.create({
    data: {
      name: "Hospitality Services Egypt",
      legalName: "HSE Training & Services SAE",
      taxId: "200-678-901",
      commercialReg: "CR-2020-066",
      address: "18 Smart Village, Cairo-Alex Road",
      city: "6th of October",
      governorate: "Giza",
      phone: "+20 2 3539 1000",
      email: "contracts@hse-eg.com",
      bankAccount: "6789012345",
      bankName: "Ahli United Bank",
    },
  });

  // --- Products ---
  await prisma.product.createMany({
    data: [
      // F&B
      {
        sku: "FOOD-RICE-001",
        name: "Premium Egyptian Rice (5kg)",
        description: "High-quality Egyptian rice, 5kg bags",
        category: "F_AND_B",
        unitPrice: 85,
        stockQuantity: 500,
        minOrderQty: 20,
        leadTimeDays: 2,
        unitOfMeasure: "bag",
        images: JSON.stringify(["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"]),
        supplierId: foodSupply.id,
      },
      {
        sku: "FOOD-CHKN-002",
        name: "Fresh Chicken Breast (bulk)",
        description: "Halal chicken breast, 10kg boxes",
        category: "F_AND_B",
        unitPrice: 320,
        stockQuantity: 200,
        minOrderQty: 5,
        leadTimeDays: 1,
        unitOfMeasure: "box",
        images: JSON.stringify(["https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop"]),
        supplierId: foodSupply.id,
      },
      {
        sku: "FOOD-DAIRY-003",
        name: "Full Cream Milk (1L)",
        description: "Pasteurized milk, 1L cartons",
        category: "F_AND_B",
        unitPrice: 28,
        stockQuantity: 1000,
        minOrderQty: 50,
        leadTimeDays: 1,
        unitOfMeasure: "carton",
        images: JSON.stringify(["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop"]),
        supplierId: foodSupply.id,
      },
      {
        sku: "FOOD-BEV-004",
        name: "Mineral Water (500ml, 24-pack)",
        category: "F_AND_B",
        unitPrice: 95,
        stockQuantity: 800,
        minOrderQty: 20,
        leadTimeDays: 1,
        unitOfMeasure: "case",
        images: JSON.stringify(["https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop"]),
        supplierId: foodSupply.id,
      },
      {
        sku: "FOOD-OLIVE-005",
        name: "Extra Virgin Olive Oil 5L",
        description: "Cold-pressed extra virgin olive oil, 5L tin",
        category: "F_AND_B",
        unitPrice: 450,
        stockQuantity: 150,
        minOrderQty: 6,
        leadTimeDays: 3,
        unitOfMeasure: "tin",
        images: JSON.stringify(["https://images.unsplash.com/photo-1474979266404-7cadd259c308?w=400&h=400&fit=crop"]),
        supplierId: foodSupply.id,
      },
      // Consumables
      {
        sku: "LINEN-TWL-001",
        name: "Premium Bath Towel Set",
        description: "100% cotton, 70x140cm, white",
        category: "CONSUMABLES",
        unitPrice: 145,
        stockQuantity: 300,
        minOrderQty: 10,
        leadTimeDays: 5,
        unitOfMeasure: "set",
        images: JSON.stringify(["https://images.unsplash.com/photo-1616627547584-59579cb16f5a?w=400&h=400&fit=crop"]),
        supplierId: linenCo.id,
      },
      {
        sku: "LINEN-BED-002",
        name: "King Size Bed Sheet Set",
        description: "400TC Egyptian cotton, white",
        category: "CONSUMABLES",
        unitPrice: 650,
        stockQuantity: 150,
        minOrderQty: 5,
        leadTimeDays: 7,
        unitOfMeasure: "set",
        images: JSON.stringify(["https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=400&fit=crop"]),
        supplierId: linenCo.id,
      },
      {
        sku: "CLEAN-DET-001",
        name: "Multi-Surface Disinfectant (5L)",
        description: "Hospital-grade disinfectant concentrate",
        category: "CONSUMABLES",
        unitPrice: 220,
        stockQuantity: 400,
        minOrderQty: 10,
        leadTimeDays: 3,
        unitOfMeasure: "canister",
        images: JSON.stringify(["https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop"]),
        supplierId: cleaningSupplies.id,
      },
      {
        sku: "CLEAN-SOAP-002",
        name: "Liquid Hand Soap Refill (20L)",
        description: "Antibacterial hand soap, bulk refill",
        category: "CONSUMABLES",
        unitPrice: 380,
        stockQuantity: 250,
        minOrderQty: 5,
        leadTimeDays: 3,
        unitOfMeasure: "drum",
        images: JSON.stringify(["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop"]),
        supplierId: cleaningSupplies.id,
      },
      {
        sku: "CLEAN-TISS-003",
        name: "Facial Tissue Box (48-pack)",
        description: "Premium 2-ply facial tissues",
        category: "CONSUMABLES",
        unitPrice: 180,
        stockQuantity: 600,
        minOrderQty: 12,
        leadTimeDays: 2,
        unitOfMeasure: "case",
        images: JSON.stringify(["https://images.unsplash.com/photo-1583947581924-860b93e6a626?w=400&h=400&fit=crop"]),
        supplierId: cleaningSupplies.id,
      },
      // Guest Supplies
      {
        sku: "GUEST-SHAM-001",
        name: "Guest Room Shampoo 30ml",
        description: "Premium shampoo, 30ml sachets",
        category: "GUEST_SUPPLIES",
        unitPrice: 3.5,
        stockQuantity: 5000,
        minOrderQty: 500,
        leadTimeDays: 5,
        unitOfMeasure: "sachet",
        images: JSON.stringify(["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"]),
        supplierId: linenCo.id,
      },
      {
        sku: "GUEST-SLIP-002",
        name: "Disposable Slippers (pair)",
        description: "White terry disposable slippers",
        category: "GUEST_SUPPLIES",
        unitPrice: 12,
        stockQuantity: 2000,
        minOrderQty: 200,
        leadTimeDays: 4,
        unitOfMeasure: "pair",
        images: JSON.stringify(["https://images.unsplash.com/photo-1603251578711-3290ca1a0187?w=400&h=400&fit=crop"]),
        supplierId: linenCo.id,
      },
      {
        sku: "GUEST-DENT-003",
        name: "Dental Kit (toothbrush + paste)",
        description: "Individually wrapped dental kit",
        category: "GUEST_SUPPLIES",
        unitPrice: 8,
        stockQuantity: 3000,
        minOrderQty: 300,
        leadTimeDays: 4,
        unitOfMeasure: "kit",
        images: JSON.stringify(["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop"]),
        supplierId: cleaningSupplies.id,
      },
      {
        sku: "GUEST-SEW-004",
        name: "Sewing Kit",
        description: "Compact emergency sewing kit",
        category: "GUEST_SUPPLIES",
        unitPrice: 5,
        stockQuantity: 2500,
        minOrderQty: 250,
        leadTimeDays: 5,
        unitOfMeasure: "kit",
        images: JSON.stringify(["https://images.unsplash.com/photo-1619250907669-27f72f14c22e?w=400&h=400&fit=crop"]),
        supplierId: linenCo.id,
      },
      // FF&E
      {
        sku: "FFE-CHAIR-001",
        name: "Dining Chair - Upholstered",
        description: "Solid wood frame with fabric upholstery",
        category: "FFE",
        unitPrice: 1850,
        stockQuantity: 80,
        minOrderQty: 4,
        leadTimeDays: 14,
        unitOfMeasure: "piece",
        images: JSON.stringify(["https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=400&fit=crop"]),
        specs: JSON.stringify({ material: "Oak Wood + Fabric", weight: "8kg", dimensions: "50x55x90cm" }),
        supplierId: ffeSupplier.id,
      },
      {
        sku: "FFE-TABLE-002",
        name: "Round Banquet Table 180cm",
        description: "Foldable banquet table with plywood top",
        category: "FFE",
        unitPrice: 3200,
        stockQuantity: 40,
        minOrderQty: 2,
        leadTimeDays: 10,
        unitOfMeasure: "piece",
        images: JSON.stringify(["https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400&h=400&fit=crop"]),
        specs: JSON.stringify({ material: "Plywood + Steel", weight: "22kg", dimensions: "180x74cm" }),
        supplierId: ffeSupplier.id,
      },
      {
        sku: "FFE-LAMP-003",
        name: "Bedside LED Lamp",
        description: "Modern bedside lamp with USB charging port",
        category: "FFE",
        unitPrice: 420,
        stockQuantity: 120,
        minOrderQty: 10,
        leadTimeDays: 7,
        unitOfMeasure: "piece",
        images: JSON.stringify(["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop"]),
        specs: JSON.stringify({ material: "Metal + Glass", wattage: "9W", voltage: "220V" }),
        supplierId: ffeSupplier.id,
      },
      // Services
      {
        sku: "SERV-STAFF-001",
        name: "Housekeeping Staff Training",
        description: "2-day certified housekeeping training program",
        category: "SERVICES",
        unitPrice: 2500,
        stockQuantity: 100,
        minOrderQty: 1,
        leadTimeDays: 7,
        unitOfMeasure: "session",
        images: JSON.stringify(["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=400&fit=crop"]),
        supplierId: serviceSupplier.id,
      },
      {
        sku: "SERV-HACCP-002",
        name: "HACCP Certification Audit",
        description: "Full HACCP audit and certification support",
        category: "SERVICES",
        unitPrice: 8500,
        stockQuantity: 50,
        minOrderQty: 1,
        leadTimeDays: 14,
        unitOfMeasure: "audit",
        images: JSON.stringify(["https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=400&fit=crop"]),
        supplierId: serviceSupplier.id,
      },
      {
        sku: "SERV-PEST-003",
        name: "Monthly Pest Control Service",
        description: "Comprehensive pest control for hotel premises",
        category: "SERVICES",
        unitPrice: 1800,
        stockQuantity: 200,
        minOrderQty: 1,
        leadTimeDays: 3,
        unitOfMeasure: "month",
        images: JSON.stringify(["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop"]),
        supplierId: serviceSupplier.id,
      },
      // Pool / Chemicals (Consumables)
      {
        sku: "POOL-CHLO-001",
        name: "Pool Chlorine Tablets 50kg",
        description: "Slow-dissolving 3-inch chlorine tablets",
        category: "CONSUMABLES",
        unitPrice: 950,
        stockQuantity: 100,
        minOrderQty: 2,
        leadTimeDays: 3,
        unitOfMeasure: "drum",
        images: JSON.stringify(["https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=400&fit=crop"]),
        supplierId: poolSupply.id,
      },
      {
        sku: "POOL-PH-002",
        name: "pH Minus Granules 25kg",
        description: "Sodium bisulfate for pH reduction",
        category: "CONSUMABLES",
        unitPrice: 380,
        stockQuantity: 80,
        minOrderQty: 2,
        leadTimeDays: 3,
        unitOfMeasure: "bag",
        images: JSON.stringify(["https://images.unsplash.com/photo-1575425186775-b8de9a427e67?w=400&h=400&fit=crop"]),
        supplierId: poolSupply.id,
      },
      {
        sku: "FOOD-SUGR-006",
        name: "Granulated Sugar (50kg)",
        description: "Refined white sugar, 50kg bags",
        category: "F_AND_B",
        unitPrice: 65,
        stockQuantity: 400,
        minOrderQty: 10,
        leadTimeDays: 2,
        unitOfMeasure: "bag",
        images: JSON.stringify(["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop"]),
        supplierId: foodSupply.id,
      },
      {
        sku: "GUEST-SOAP-005",
        name: "Guest Soap Bar 20g",
        description: "Pleat-wrapped soap bar, floral scent",
        category: "GUEST_SUPPLIES",
        unitPrice: 2.5,
        stockQuantity: 8000,
        minOrderQty: 1000,
        leadTimeDays: 5,
        unitOfMeasure: "bar",
        images: JSON.stringify(["https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400&h=400&fit=crop"]),
        supplierId: cleaningSupplies.id,
      },
      {
        sku: "FFE-MIRR-004",
        name: "LED Backlit Bathroom Mirror",
        description: "Anti-fog mirror with touch sensor",
        category: "FFE",
        unitPrice: 2800,
        stockQuantity: 30,
        minOrderQty: 2,
        leadTimeDays: 10,
        unitOfMeasure: "piece",
        images: JSON.stringify(["https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=400&fit=crop"]),
        specs: JSON.stringify({ material: "Glass + Aluminum", wattage: "18W", dimensions: "80x60cm" }),
        supplierId: ffeSupplier.id,
      },
      {
        sku: "SERV-LAUN-004",
        name: "Outsourced Laundry Service",
        description: "Per-kilo laundry service with pickup",
        category: "SERVICES",
        unitPrice: 12,
        stockQuantity: 10000,
        minOrderQty: 100,
        leadTimeDays: 1,
        unitOfMeasure: "kg",
        images: JSON.stringify(["https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop"]),
        supplierId: serviceSupplier.id,
      },
    ],
  });

  // --- Users ---
  const owner = await prisma.user.create({
    data: {
      email: "owner@nilepalace.com",
      name: "Ahmed Hassan",
      phone: "+20 10 1234 5678",
      role: "OWNER",
      platformRole: "HOTEL",
      hotelId: nilePalace.id,
      canOverride: true,
      passwordHash: defaultPassword,
    },
  });

  const gm = await prisma.user.create({
    data: {
      email: "gm@nilepalace.com",
      name: "Sarah El-Masry",
      phone: "+20 11 2345 6789",
      role: "GM",
      platformRole: "HOTEL",
      hotelId: nilePalace.id,
      canOverride: true,
      passwordHash: defaultPassword,
    },
  });

  const controller = await prisma.user.create({
    data: {
      email: "finance@nilepalace.com",
      name: "Mohamed Farouk",
      phone: "+20 12 3456 7890",
      role: "FINANCIAL_CONTROLLER",
      platformRole: "HOTEL",
      hotelId: nilePalace.id,
      passwordHash: defaultPassword,
    },
  });

  const deptHead = await prisma.user.create({
    data: {
      email: "fnb@nilepalace.com",
      name: "Laila Ibrahim",
      phone: "+20 10 9876 5432",
      role: "DEPARTMENT_HEAD",
      platformRole: "HOTEL",
      hotelId: nilePalace.id,
      passwordHash: defaultPassword,
    },
  });

  // Demo users for other platform roles
  await prisma.user.createMany({
    data: [
      { email: "supplier@gomhouria-food.com", name: "Omar Gomhouria", role: "CLERK", platformRole: "SUPPLIER", hotelId: nilePalace.id, passwordHash: defaultPassword },
      { email: "factoring@fintech-eg.com", name: "Hana Factoring", role: "CLERK", platformRole: "FACTORING", hotelId: nilePalace.id, passwordHash: defaultPassword },
      { email: "shipping@sharkbreaker.com", name: "Tarek Shipping", role: "CLERK", platformRole: "SHIPPING", hotelId: nilePalace.id, passwordHash: defaultPassword },
      { email: "admin@hotelsvendors.com", name: "Super Admin", role: "OWNER", platformRole: "ADMIN", hotelId: nilePalace.id, canOverride: true, passwordHash: defaultPassword },
    ],
  });

  // --- Authority Matrix Rules ---
  await prisma.authorityRule.createMany({
    data: [
      {
        hotelId: nilePalace.id,
        name: "Department Head - Standard",
        description: "Dept head can approve up to 50k EGP on standard categories",
        role: "DEPARTMENT_HEAD",
        minValue: 0,
        maxValue: 50000,
        category: "F_AND_B",
        supplierTier: "CORE",
        action: "APPROVE",
        priority: 10,
      },
      {
        hotelId: nilePalace.id,
        name: "Controller - Medium Orders",
        description: "Controller can approve up to 250k EGP",
        role: "FINANCIAL_CONTROLLER",
        minValue: 50000,
        maxValue: 250000,
        category: "F_AND_B",
        supplierTier: "CORE",
        action: "APPROVE",
        routeToRole: "GM",
        priority: 20,
      },
      {
        hotelId: nilePalace.id,
        name: "GM - Large Orders",
        description: "GM can approve up to 1M EGP",
        role: "GM",
        minValue: 250000,
        maxValue: 1000000,
        category: "F_AND_B",
        supplierTier: "CORE",
        action: "APPROVE",
        routeToRole: "OWNER",
        priority: 30,
      },
      {
        hotelId: nilePalace.id,
        name: "Owner - Unlimited",
        description: "Owner has unlimited approval authority",
        role: "OWNER",
        minValue: 0,
        maxValue: 999999999,
        category: "F_AND_B",
        supplierTier: "CORE",
        action: "APPROVE",
        priority: 100,
      },
      {
        hotelId: nilePalace.id,
        name: "Linen - Dept Head",
        description: "Dept head can approve linen up to 30k",
        role: "DEPARTMENT_HEAD",
        minValue: 0,
        maxValue: 30000,
        category: "CONSUMABLES",
        supplierTier: "CORE",
        action: "APPROVE",
        priority: 10,
      },
    ],
  });

  // --- Orders ---
  const products = await prisma.product.findMany();
  const riceProduct = products.find((p) => p.sku === "FOOD-RICE-001")!;
  const chickenProduct = products.find((p) => p.sku === "FOOD-CHKN-002")!;
  const dairyProduct = products.find((p) => p.sku === "FOOD-DAIRY-003")!;
  const towelProduct = products.find((p) => p.sku === "LINEN-TWL-001")!;
  const bedProduct = products.find((p) => p.sku === "LINEN-BED-002")!;
  const detProduct = products.find((p) => p.sku === "CLEAN-DET-001")!;
  const soapProduct = products.find((p) => p.sku === "CLEAN-SOAP-002")!;

  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-0001",
      hotelId: nilePalace.id,
      supplierId: foodSupply.id,
      requesterId: deptHead.id,
      status: "DELIVERED",
      subtotal: 85000,
      vatAmount: 11900,
      total: 96900,
      deliveryDate: new Date("2026-04-15"),
      items: {
        create: [
          { productId: riceProduct.id, quantity: 50, unitPrice: 85, total: 4250 },
          { productId: chickenProduct.id, quantity: 20, unitPrice: 320, total: 6400 },
          { productId: dairyProduct.id, quantity: 200, unitPrice: 28, total: 5600 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-0002",
      hotelId: nilePalace.id,
      supplierId: linenCo.id,
      requesterId: deptHead.id,
      status: "DELIVERED",
      subtotal: 125000,
      vatAmount: 17500,
      total: 142500,
      items: {
        create: [
          { productId: towelProduct.id, quantity: 100, unitPrice: 145, total: 14500 },
          { productId: bedProduct.id, quantity: 50, unitPrice: 650, total: 32500 },
        ],
      },
    },
  });

  const alexUser = await prisma.user.create({
    data: {
      email: "ops@alexresort.com",
      name: "Karim Fathy",
      role: "DEPARTMENT_HEAD",
      platformRole: "HOTEL",
      hotelId: alexResort.id,
      passwordHash: defaultPassword,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: "ORD-2026-0003",
      hotelId: alexResort.id,
      supplierId: cleaningSupplies.id,
      requesterId: alexUser.id,
      status: "PENDING_APPROVAL",
      subtotal: 42000,
      vatAmount: 5880,
      total: 47880,
      items: {
        create: [
          { productId: detProduct.id, quantity: 30, unitPrice: 220, total: 6600 },
          { productId: soapProduct.id, quantity: 15, unitPrice: 380, total: 5700 },
        ],
      },
    },
  });

  // --- Order Approvals ---
  await prisma.orderApproval.create({
    data: {
      orderId: order1.id,
      approverId: controller.id,
      action: "APPROVED",
    },
  });

  await prisma.orderApproval.create({
    data: {
      orderId: order2.id,
      approverId: gm.id,
      action: "APPROVED",
    },
  });

  // --- Invoices ---
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0001",
      orderId: order1.id,
      hotelId: nilePalace.id,
      supplierId: foodSupply.id,
      subtotal: 85000,
      vatRate: 14,
      vatAmount: 11900,
      total: 96900,
      etaStatus: "ACCEPTED",
      etaUuid: "eta-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      digitalSignature: "a".repeat(64),
      status: "VALIDATED",
      issueDate: new Date("2026-04-15"),
      dueDate: new Date("2026-05-15"),
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0002",
      orderId: order2.id,
      hotelId: nilePalace.id,
      supplierId: linenCo.id,
      subtotal: 125000,
      vatRate: 14,
      vatAmount: 17500,
      total: 142500,
      etaStatus: "ACCEPTED",
      etaUuid: "eta-b2c3d4e5-f6g7-8901-bcde-f12345678901",
      digitalSignature: "b".repeat(64),
      status: "VALIDATED",
      issueDate: new Date("2026-04-17"),
      dueDate: new Date("2026-05-17"),
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0003",
      orderId: order3.id,
      hotelId: alexResort.id,
      supplierId: cleaningSupplies.id,
      subtotal: 42000,
      vatRate: 14,
      vatAmount: 5880,
      total: 47880,
      etaStatus: "PENDING",
      status: "DRAFT",
      issueDate: new Date("2026-04-20"),
    },
  });

  // --- Audit Logs ---
  await prisma.auditLog.createMany({
    data: [
      {
        entityType: "ORDER",
        entityId: order1.id,
        action: "ORDER_CREATED",
        actorId: deptHead.id,
        afterState: JSON.stringify({ orderNumber: "ORD-2026-0001", total: 96900 }),
      },
      {
        entityType: "ORDER",
        entityId: order1.id,
        action: "ORDER_APPROVED",
        actorId: controller.id,
        afterState: JSON.stringify({ approver: "Mohamed Farouk" }),
      },
      {
        entityType: "ORDER",
        entityId: order2.id,
        action: "ORDER_CREATED",
        actorId: deptHead.id,
        afterState: JSON.stringify({ orderNumber: "ORD-2026-0002", total: 142500 }),
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log(`   Hotels: 2`);
  console.log(`   Properties: 3`);
  console.log(`   Suppliers: 6`);
  console.log(`   Products: 24`);
  console.log(`   Users: 5`);
  console.log(`   Orders: 3`);
  console.log(`   Invoices: 3`);
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
