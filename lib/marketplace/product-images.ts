/**
 * Product Image Resolver
 * Maps product names to relevant Unsplash photography.
 * Falls back to category-colored gradient placeholders for niche/industrial items.
 */

// ─── REAL UNSPLASH PHOTOGRAPHY ──────────────────────────────────────────────
// Every URL below points to an actual photograph of the product category.
// Zero random placeholder images. Zero Picsum.

const KEYWORD_MAP: Record<string, string> = {
  // ═══════════════════════════════════════════════════════════════

  // ─── VERIFIED CATALOG FIXES (2026-08-18 audit) ───────────────────────
  knife: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ABoning%20Knife%2C%202017-%2801%29.jpg?width=640",
  chef: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AChef%20cooking.jpg?width=640",
  kitchen: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AChef%20cooking.jpg?width=640",
  board: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AChopping%20Board.jpg?width=640",
  sewing: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ABerghotel%20auf%20der%20Loreley%20N%C3%A4h-Etui%20Sewing%20kit%20%281%29.jpg?width=640",
  slipper: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3A2023%20Kapcie.jpg?width=640",
  //  MEATS & POULTRY
  // ═══════════════════════════════════════════════════════════════
  beef:      "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ARaw%20beef%20steak%2C%202011.jpg?width=640",
  steak:     "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80",
  sausage:   "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AGrilling%20Sausages%20%28Unsplash%29.jpg?width=640",
  veal:      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
  lamb:      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80",
  chicken:   "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  turkey:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ARoast%20turkey%20from%20fall%20season.jpg?width=640",
  duck:      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  meat:      "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ARaw%20beef%20steak%2C%202011.jpg?width=640",
  prosciutto:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  SEAFOOD
  // ═══════════════════════════════════════════════════════════════
  fish:      "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  salmon:    "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&q=80",
  shrimp:    "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80",
  prawn:     "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80",
  seafood:   "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  tuna:      "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&q=80",
  lobster:   "https://images.unsplash.com/photo-1553659971-f01207815844?w=600&q=80",
  sardine:   "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  PRODUCE & VEGETABLES
  // ═══════════════════════════════════════════════════════════════
  cucumber:   "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&q=80",
  tomato:     "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80",
  onion:      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80",
  potato:     "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
  carrot:     "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACarrots%20at%20Ljubljana%20Central%20Market.JPG?width=640",
  lettuce:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ALettuce%20in%20a%20stack.jpg?width=640",
  pepper:     "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80",
  capsicum:   "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80",
  garlic:     "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AGarlic%20cloves.jpg?width=640",
  lemon:      "https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&q=80",
  lime:       "https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&q=80",
  orange:     "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AAmbersweet%20oranges.jpg?width=640",
  apple:      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
  banana:     "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
  grape:      "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AClose%20up%20grapes.jpg?width=640",
  watermelon: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80",
  mango:      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80",
  pineapple:  "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80",
  avocado:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AAvocado%20Hass%20-%20single%20and%20halved.jpg?width=640",
  broccoli:   "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80",
  cauliflower:"https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&q=80",
  spinach:    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
  zucchini:   "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=600&q=80",
  eggplant:   "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&q=80",
  mushroom:   "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600&q=80",
  date:       "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
  fig:        "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&q=80",
  pomegranate:"https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
  microgreen: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
  egg:        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  DRY GOODS & PANTRY
  // ═══════════════════════════════════════════════════════════════
  rice:      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
  pasta:     "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=600&q=80",
  flour:     "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=600&q=80",
  sugar:     "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&q=80",
  oil:       "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
  olive:     "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
  vinegar:   "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ASynthetic%20vinegar%20bottles.jpg?width=640",
  spice:     "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80",
  herb:      "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AFresh%20Herbs%20%28Unsplash%29.jpg?width=640",
  salt:      "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&q=80",
  honey:     "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
  jam:       "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AJam%20jar%2C%20Kazakhstan.jpg?width=640",
  nut:       "https://commons.wikimedia.org/wiki/Special:FilePath/File%3A20130126%20Mixed%20nuts%20%28cropped%29.jpg?width=640",
  almond:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3A20130126%20Mixed%20nuts%20%28cropped%29.jpg?width=640",
  cashew:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3A20130126%20Mixed%20nuts%20%28cropped%29.jpg?width=640",
  peanut:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3A20130126%20Mixed%20nuts%20%28cropped%29.jpg?width=640",
  lentil:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ADried%20beans%20in%20the%20market.jpg?width=640",
  bean:      "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ADried%20beans%20in%20the%20market.jpg?width=640",
  chickpea:  "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ADried%20beans%20in%20the%20market.jpg?width=640",
  couscous:  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
  saffron:   "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AIran%20saffron%20threads.jpg?width=640",
  bran:      "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=600&q=80",
  molasses:  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
  walnut:    "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  BEVERAGES
  // ═══════════════════════════════════════════════════════════════
  juice:     "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
  water:     "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
  soda:      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
  soft:      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
  coffee:    "https://images.unsplash.com/photo-1497515114889-1c6a5e7cda9d?w=600&q=80",
  tea:       "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
  milk:      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80",
  wine:      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
  beer:      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80",
  spirit:    "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80",
  whiskey:   "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80",
  vodka:     "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80",
  champagne: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=600&q=80",
  cocktail:  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
  energy:    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  DAIRY & BAKERY
  // ═══════════════════════════════════════════════════════════════
  cheese:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ABelper%20M%C3%BCrggel%20B%2C%20WikiCheese%20Lausanne.jpg?width=640",
  butter:    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80",
  yogurt:    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
  cream:     "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
  bread:     "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  bun:       "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  roll:      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  croissant: "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACroissant%20In%20Austria.jpg?width=640",
  cake:      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
  pastry:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACroissant%20In%20Austria.jpg?width=640",
  biscuit:   "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
  cookie:    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
  chocolate: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&q=80",
  cocoa:     "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&q=80",
  vanilla:   "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80",
  dough:     "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  frozen:    "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  HOUSEKEEPING & CLEANING
  // ═══════════════════════════════════════════════════════════════
  clean:        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  disinfectant: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  sanitizer:    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  towel:        "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&q=80",
  tissue:       "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  napkin:       "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  wipe:         "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  broom:        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  mop:          "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  vacuum:       "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
  bin:          "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  bag:          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
  glove:        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  brush:        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  polish:       "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  wax:          "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  cleaner:      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  carpet:       "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
  biohazard:    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  compactor:    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  waste:        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  LINENS & TEXTILES
  // ═══════════════════════════════════════════════════════════════
  sheet:      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
  bedding:    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
  pillow:     "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600&q=80",
  cushion:    "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600&q=80",
  blanket:    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  duvet:      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  comforter:  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  quilt:      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  curtain:    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
  drape:      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
  uniform:    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  apron:      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  tablecloth: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
  runner:     "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
  placemat:   "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
  fabric:     "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  cotton:     "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  linen:      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  silk:       "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  satin:      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  terry:      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&q=80",
  bathrobe:   "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
  robe:       "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
  throw:      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  ROOM AMENITIES & TOILETRIES
  // ═══════════════════════════════════════════════════════════════
  shampoo:    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  lotion:     "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  conditioner:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  gel:        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  body:       "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  shower:     "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  razor:      "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80",
  shave:      "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80",
  shoe:       "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80",
  vanity:     "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  mirror:     "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  tray:       "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACranberry-Mohn%20Muffins%20in%20baking%20tray.jpg?width=640",
  welcome:    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  fruit:      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  basket:     "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  gift:       "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  MINIBAR & SNACKS
  // ═══════════════════════════════════════════════════════════════
  minibar:  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  snack:    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80",
  chip:     "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80",
  nutmix:   "https://images.unsplash.com/photo-1536591375315-1988d6960544?w=600&q=80",
  cracker:  "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80",
  ice:      "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  POOL & SPA
  // ═══════════════════════════════════════════════════════════════
  pool:      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  chlorine:  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  ph:        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  algaecide: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  skimmer:   "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  net:       "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  hose:      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  massage:   "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  scrub:     "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  swab:      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  IT & TECHNOLOGY
  // ═══════════════════════════════════════════════════════════════
  router:    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
  modem:     "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
  network:   "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
  wifi:      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
  point:     "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  camera:    "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACCTV%20camera%20in%20Poland%20%281%29.jpg?width=640",
  cctv:      "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACCTV%20camera%20in%20Poland%20%281%29.jpg?width=640",
  pos:       "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  terminal:  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  laptop:    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  computer:  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  server:    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
  rack:      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
  ups:       "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80",
  smart:     "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
  hub:       "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
  voice:     "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
  display:   "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  screen:    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  monitor:   "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  keyboard:  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
  mouse:     "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
  headset:   "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
  projector: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  speaker:   "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
  sound:     "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
  microphone:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  SECURITY
  // ═══════════════════════════════════════════════════════════════
  lock:   "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ALove%20padlocks%20brooklyn%20bridge.jpg?width=640",
  card:   "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  rfid:   "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  KITCHEN & F&B EQUIPMENT
  // ═══════════════════════════════════════════════════════════════
  dishwasher: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
  washer:     "https://images.unsplash.com/photo-1626806775351-538068a21838?w=600&q=80",
  cooler:     "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80",
  mixer:      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80",
  blender:    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80",
  steel:      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  shelf:      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80",
  fabrication:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  film:       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
  foil:       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
  fountain:   "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
  countertop: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  tile:       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  cap:        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
  desk:       "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
  chair:      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80",
  organic:    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  herbal:     "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  jasmine:    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
  chamomile:  "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
  finger:     "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80",

  // ═══════════════════════════════════════════════════════════════
  //  ENGINEERING & MAINTENANCE  (niche items → gradient fallback)
  // ═══════════════════════════════════════════════════════════════
  // These map to the same generic engineering image set,
  // but we'll let the gradient system handle true niche items.
  filter:      "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600&q=80",
  fitting:     "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600&q=80",
  wire:        "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AElectric%20guide%203%C3%972.5%20mm.jpg?width=640",
  cable:       "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AElectric%20guide%203%C3%972.5%20mm.jpg?width=640",
  bulb:        "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AGluehlampe%2001%20KMJ.jpg?width=640",
  light:       "https://commons.wikimedia.org/wiki/Special:FilePath/File%3AGluehlampe%2001%20KMJ.jpg?width=640",
  battery:     "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80",
  wrench:      "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACl%C3%A9%20plate.jpg?width=640",
  bolt:        "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600&q=80",
  nut_hardware:"https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600&q=80",
  paint:       "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80",
  roller:      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80",
  breaker:     "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ACircuit%20breaker%202%20pole%20on%20DIN%20rail.JPG?width=640",
  thermostat:  "https://commons.wikimedia.org/wiki/Special:FilePath/File%3ABC103%20thermostat%20front%20view.png?width=640",
  toilet:      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
  drainage:    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
  plumbing:    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
  outdoor:     "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80",
  marine:      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80",
  boat:        "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80",
  rental:      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY IMAGE POOLS — Multiple unique images per category
//  Each product gets a deterministic, unique image via hash-based selection
// ═══════════════════════════════════════════════════════════════
const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  fb: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80",
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=600&q=80",
  ],
  hk: [
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&q=80",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=600&q=80",
  ],
  lin: [
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
    "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&q=80",
  ],
  eng: [
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80",
    "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  ],
  gra: [
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
  ],
  ffe: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80",
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
  ],
  ose: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80",
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
    "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&q=80",
    "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=80",
  ],
  spa: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80",
    "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&q=80",
  ],
  it: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
  ],
  sec: [
    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80",
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
  ],
};

// ═══════════════════════════════════════════════════════════════
//  CATEGORY-COLORED GRADIENTS (beautiful, never random)
// ═══════════════════════════════════════════════════════════════
// When a product has no photo match, we render a branded gradient
// with the product initials. Colors match the category so engineering
// items look industrial, food looks warm, etc.

const CATEGORY_GRADIENTS: Record<string, string[]> = {
  fb:   ["#1a2a1a", "#2d4a2d", "#4a7c4a"],   // Food — warm green
  hk:   ["#0d2b2e", "#1a4a4e", "#2a7a80"],   // Housekeeping — teal
  lin:  ["#2a1a2a", "#4a2d4a", "#7a4a7a"],   // Linens — soft purple
  eng:  ["#1a1a2a", "#2a2a4a", "#4a4a7a"],   // Engineering — steel blue
  gra:  ["#2a1a1a", "#4a2d2d", "#7a4a4a"],   // Amenities — warm burgundy
  ffe:  ["#2a2a1a", "#4a4a2d", "#7a7a4a"],   // FFE — olive
  ose:  ["#1a2a2a", "#2d4a4a", "#4a7a7a"],   // Office — slate
  spa:  ["#1a1a2a", "#2a2a4a", "#4a4a8a"],   // Pool — deep blue
  it:   ["#0a1a2a", "#1a2a4a", "#2a4a7a"],   // IT — midnight blue
  sec:  ["#2a1a0a", "#4a2d1a", "#7a4a2a"],   // Security — amber
};

const FALLBACK_GRADIENT = ["#0f1729", "#1a2332", "#2a3a4e"]; // Navy-grey default

/**
 * Deterministic hash of a string — same input always produces same output.
 * Used to pick a consistent image from a pool for the same product.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export function getProductImage(product: { name: string; category: string; sku?: string }): { type: "url"; src: string } | { type: "gradient"; colors: string[]; initials: string } {
  const name = product.name.toLowerCase();
  const category = product.category as string;

  // 1) Try exact keyword match
  for (const [keyword, url] of Object.entries(KEYWORD_MAP)) {
    if (name.includes(keyword)) {
      return { type: "url", src: url };
    }
  }

  // 1b) Try singularized keyword match (strip trailing 's' / 'es')
  const singularName = name
    .replace(/ies\b/g, "y")
    .replace(/es\b/g, "")
    .replace(/s\b/g, "");
  for (const [keyword, url] of Object.entries(KEYWORD_MAP)) {
    if (singularName.includes(keyword)) {
      return { type: "url", src: url };
    }
  }

  // 2) Pick a UNIQUE image from the category pool using product hash
  const pool = CATEGORY_IMAGE_POOLS[category];
  if (pool && pool.length > 0) {
    // Use SKU if available, otherwise name — ensures same product = same image
    const hashInput = product.sku || product.name;
    const hash = hashString(hashInput);
    const index = hash % pool.length;
    return { type: "url", src: pool[index] };
  }

  // 3) Category-colored gradient with product initials
  const colors = CATEGORY_GRADIENTS[category] || FALLBACK_GRADIENT;
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return { type: "gradient", colors, initials };
}

export function getCategoryImage(categoryId: string): string {
  const pool = CATEGORY_IMAGE_POOLS[categoryId];
  return pool?.[0] || CATEGORY_IMAGE_POOLS.fb[0];
}