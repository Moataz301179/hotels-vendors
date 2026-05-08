/**
 * Product Image Resolver
 * Maps product names to relevant Unsplash images.
 * Falls back to deterministic gradient placeholders for unmatched products.
 */

// Keyword → specific Unsplash photo ID (reliable, curated)
const KEYWORD_MAP: Record<string, string> = {
  // MEATS
  beef: "https://images.unsplash.com/photo-1607623814075-e51df1bd656c?w=600&q=80",
  steak: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80",
  sausage: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=600&q=80",
  veal: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
  lamb: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80",
  chicken: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  turkey: "https://picsum.photos/seed/hv158/600/400",
  duck: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  meat: "https://picsum.photos/seed/hv140/600/400",
  mince: "https://picsum.photos/seed/hv200/600/400",

  // SEAFOOD
  fish: "https://picsum.photos/seed/hv142/600/400",
  salmon: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&q=80",
  shrimp: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80",
  prawn: "https://picsum.photos/seed/hv148/600/400",
  seafood: "https://picsum.photos/seed/hv201/600/400",
  tuna: "https://picsum.photos/seed/hv202/600/400",

  // PRODUCE
  cucumber: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&q=80",
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
  carrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80",
  lettuce: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80",
  pepper: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80",
  capsicum: "https://picsum.photos/seed/hv105/600/400",
  garlic: "https://images.unsplash.com/photo-1615477083313-2db8845f4ade?w=600&q=80",
  lemon: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&q=80",
  lime: "https://picsum.photos/seed/hv115/600/400",
  orange: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5f?w=600&q=80",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
  grape: "https://images.unsplash.com/photo-1537640538965-1756cd580d0f?w=600&q=80",
  watermelon: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80",
  mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80",
  pineapple: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80",
  avocado: "https://images.unsplash.com/photo-1523049673856-606ae93a9c9d?w=600&q=80",
  broccoli: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&q=80",
  cauliflower: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&q=80",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
  zucchini: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=600&q=80",
  eggplant: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&q=80",
  mushroom: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600&q=80",
  date: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
  fig: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=600&q=80",
  pomegranate: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",

  // DRY GOODS
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
  pasta: "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=600&q=80",
  flour: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=600&q=80",
  sugar: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&q=80",
  oil: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
  olive: "https://picsum.photos/seed/hv108/600/400",
  vinegar: "https://images.unsplash.com/photo-1626202378383-2413957d7785?w=600&q=80",
  spice: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&q=80",
  herb: "https://picsum.photos/seed/hv156/600/400",
  salt: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&q=80",
  honey: "https://picsum.photos/seed/hv162/600/400",
  jam: "https://picsum.photos/seed/hv152/600/400",
  nut: "https://images.unsplash.com/photo-1536591375315-1988d6960544?w=600&q=80",
  almond: "https://picsum.photos/seed/hv109/600/400",
  cashew: "https://picsum.photos/seed/hv203/600/400",
  peanut: "https://picsum.photos/seed/hv204/600/400",
  seed: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&q=80",
  sesame: "https://picsum.photos/seed/hv130/600/400",
  lentil: "https://images.unsplash.com/photo-1515543904379-3d757afe72e3?w=600&q=80",
  bean: "https://picsum.photos/seed/hv159/600/400",
  chickpea: "https://picsum.photos/seed/hv205/600/400",
  couscous: "https://picsum.photos/seed/hv112/600/400",

  // BEVERAGES
  juice: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
  water: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80",
  soda: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
  soft: "https://picsum.photos/seed/hv153/600/400",
  coffee: "https://images.unsplash.com/photo-1497515114889-1c6a5e7cda9d?w=600&q=80",
  tea: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
  milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80",
  wine: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
  beer: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80",
  spirit: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&q=80",
  whiskey: "https://picsum.photos/seed/hv133/600/400",
  vodka: "https://picsum.photos/seed/hv206/600/400",
  champagne: "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=600&q=80",
  cocktail: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
  energy: "https://picsum.photos/seed/hv207/600/400",

  // DAIRY & BAKERY
  cheese: "https://images.unsplash.com/photo-1486297678749-94173255258f?w=600&q=80",
  butter: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80",
  yogurt: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
  cream: "https://picsum.photos/seed/hv125/600/400",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  bun: "https://picsum.photos/seed/hv126/600/400",
  roll: "https://picsum.photos/seed/hv208/600/400",
  croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&q=80",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
  pastry: "https://picsum.photos/seed/hv135/600/400",
  biscuit: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
  cookie: "https://picsum.photos/seed/hv139/600/400",
  chocolate: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&q=80",
  cocoa: "https://picsum.photos/seed/hv154/600/400",
  vanilla: "https://picsum.photos/seed/hv209/600/400",

  // HOUSEKEEPING
  clean: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&q=80",
  detergent: "https://picsum.photos/seed/hv129/600/400",
  bleach: "https://images.unsplash.com/photo-1602607203195-a0a565fc4e71?w=600&q=80",
  disinfectant: "https://picsum.photos/seed/hv210/600/400",
  sanitizer: "https://picsum.photos/seed/hv211/600/400",
  soap: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&q=80",
  hand: "https://picsum.photos/seed/hv137/600/400",
  towel: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&q=80",
  tissue: "https://picsum.photos/seed/hv212/600/400",
  napkin: "https://picsum.photos/seed/hv134/600/400",
  wipe: "https://picsum.photos/seed/hv213/600/400",
  broom: "https://picsum.photos/seed/hv214/600/400",
  mop: "https://picsum.photos/seed/hv215/600/400",
  vacuum: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80",
  bin: "https://picsum.photos/seed/hv118/600/400",
  bag: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
  glove: "https://picsum.photos/seed/hv216/600/400",
  brush: "https://picsum.photos/seed/hv217/600/400",
  polish: "https://picsum.photos/seed/hv218/600/400",
  wax: "https://picsum.photos/seed/hv219/600/400",
  freshener: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&q=80",
  deodorizer: "https://picsum.photos/seed/hv110/600/400",

  // LINENS & TEXTILES
  sheet: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
  bedding: "https://picsum.photos/seed/hv138/600/400",
  pillow: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=600&q=80",
  cushion: "https://picsum.photos/seed/hv122/600/400",
  blanket: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  duvet: "https://picsum.photos/seed/hv136/600/400",
  comforter: "https://picsum.photos/seed/hv220/600/400",
  quilt: "https://picsum.photos/seed/hv221/600/400",
  curtain: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
  drape: "https://picsum.photos/seed/hv131/600/400",
  uniform: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  apron: "https://picsum.photos/seed/hv123/600/400",
  tablecloth: "https://picsum.photos/seed/hv222/600/400",
  runner: "https://picsum.photos/seed/hv223/600/400",
  placemat: "https://picsum.photos/seed/hv224/600/400",
  fabric: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  cotton: "https://picsum.photos/seed/hv102/600/400",
  linen: "https://picsum.photos/seed/hv225/600/400",
  silk: "https://picsum.photos/seed/hv226/600/400",
  satin: "https://picsum.photos/seed/hv227/600/400",
  terry: "https://picsum.photos/seed/hv228/600/400",
  bathrobe: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
  robe: "https://picsum.photos/seed/hv149/600/400",

  // ENGINEERING & MAINTENANCE
  hvac: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600&q=80",
  filter: "https://picsum.photos/seed/hv132/600/400",
  pump: "https://picsum.photos/seed/hv229/600/400",
  motor: "https://picsum.photos/seed/hv230/600/400",
  valve: "https://picsum.photos/seed/hv231/600/400",
  pipe: "https://picsum.photos/seed/hv232/600/400",
  fitting: "https://picsum.photos/seed/hv233/600/400",
  wire: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
  cable: "https://picsum.photos/seed/hv106/600/400",
  bulb: "https://picsum.photos/seed/hv234/600/400",
  light: "https://picsum.photos/seed/hv235/600/400",
  led: "https://picsum.photos/seed/hv236/600/400",
  battery: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80",
  tool: "https://picsum.photos/seed/hv237/600/400",
  ladder: "https://picsum.photos/seed/hv238/600/400",
  drill: "https://picsum.photos/seed/hv239/600/400",
  saw: "https://picsum.photos/seed/hv240/600/400",
  wrench: "https://picsum.photos/seed/hv241/600/400",
  screw: "https://picsum.photos/seed/hv242/600/400",
  bolt: "https://picsum.photos/seed/hv243/600/400",
  nut_hardware: "https://picsum.photos/seed/hv244/600/400",
  tape: "https://picsum.photos/seed/hv245/600/400",
  glue: "https://picsum.photos/seed/hv246/600/400",
  sealant: "https://picsum.photos/seed/hv247/600/400",
  paint: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80",
  roller: "https://picsum.photos/seed/hv163/600/400",
  breaker: "https://picsum.photos/seed/hv248/600/400",
  fuse: "https://picsum.photos/seed/hv249/600/400",
  switch: "https://picsum.photos/seed/hv250/600/400",
  socket: "https://picsum.photos/seed/hv251/600/400",
  outlet: "https://picsum.photos/seed/hv252/600/400",
  thermostat: "https://picsum.photos/seed/hv253/600/400",
  gauge: "https://picsum.photos/seed/hv254/600/400",
  meter: "https://picsum.photos/seed/hv255/600/400",
  compressor: "https://picsum.photos/seed/hv256/600/400",
  fan: "https://picsum.photos/seed/hv257/600/400",
  belt: "https://picsum.photos/seed/hv258/600/400",
  chain: "https://picsum.photos/seed/hv259/600/400",
  bearing: "https://picsum.photos/seed/hv260/600/400",
  gasket: "https://picsum.photos/seed/hv261/600/400",
  lubricant: "https://picsum.photos/seed/hv262/600/400",
  grease: "https://picsum.photos/seed/hv263/600/400",
  solvent: "https://picsum.photos/seed/hv264/600/400",
  thinner: "https://picsum.photos/seed/hv265/600/400",

  // POOL
  pool: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80",
  chlorine: "https://picsum.photos/seed/hv157/600/400",
  ph: "https://picsum.photos/seed/hv266/600/400",
  algaecide: "https://picsum.photos/seed/hv267/600/400",
  skimmer: "https://picsum.photos/seed/hv268/600/400",
  net: "https://picsum.photos/seed/hv269/600/400",
  hose: "https://picsum.photos/seed/hv270/600/400",

  // ROOM AMENITIES
  shampoo: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  lotion: "https://picsum.photos/seed/hv128/600/400",
  conditioner: "https://picsum.photos/seed/hv271/600/400",
  gel: "https://picsum.photos/seed/hv272/600/400",
  body: "https://picsum.photos/seed/hv273/600/400",
  shower: "https://picsum.photos/seed/hv274/600/400",
  bath: "https://picsum.photos/seed/hv275/600/400",
  toothbrush: "https://picsum.photos/seed/hv276/600/400",
  paste: "https://picsum.photos/seed/hv277/600/400",
  dental: "https://picsum.photos/seed/hv278/600/400",
  razor: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80",
  shave: "https://picsum.photos/seed/hv146/600/400",
  slipper: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80",
  shoe: "https://picsum.photos/seed/hv150/600/400",
  sewing: "https://picsum.photos/seed/hv279/600/400",
  kit: "https://picsum.photos/seed/hv280/600/400",
  vanity: "https://picsum.photos/seed/hv281/600/400",
  mirror: "https://picsum.photos/seed/hv282/600/400",
  tray: "https://picsum.photos/seed/hv283/600/400",
  welcome: "https://picsum.photos/seed/hv284/600/400",
  fruit: "https://picsum.photos/seed/hv120/600/400",
  basket: "https://picsum.photos/seed/hv285/600/400",
  gift: "https://picsum.photos/seed/hv286/600/400",
  candle: "https://picsum.photos/seed/hv287/600/400",
  incense: "https://picsum.photos/seed/hv288/600/400",
  sachet: "https://picsum.photos/seed/hv289/600/400",

  // MINIBAR
  minibar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  snack: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80",
  chip: "https://picsum.photos/seed/hv143/600/400",
  nutmix: "https://picsum.photos/seed/hv290/600/400",
  candy: "https://picsum.photos/seed/hv291/600/400",
  cracker: "https://picsum.photos/seed/hv292/600/400",
  canape: "https://images.unsplash.com/photo-1544025162-d76690b68f11?w=600&q=80",

  // IT & TECHNOLOGY
  router: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
  modem: "https://picsum.photos/seed/hv151/600/400",
  network: "https://picsum.photos/seed/hv293/600/400",
  wifi: "https://picsum.photos/seed/hv294/600/400",
  access: "https://picsum.photos/seed/hv295/600/400",
  point: "https://picsum.photos/seed/hv296/600/400",
  camera: "https://picsum.photos/seed/hv297/600/400",
  cctv: "https://picsum.photos/seed/hv298/600/400",
  printer: "https://images.unsplash.com/photo-1612815154858-60aa4c43e64e?w=600&q=80",
  scanner: "https://picsum.photos/seed/hv117/600/400",
  pos: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  terminal: "https://picsum.photos/seed/hv155/600/400",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4babbff29?w=600&q=80",
  ipad: "https://picsum.photos/seed/hv127/600/400",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
  computer: "https://picsum.photos/seed/hv160/600/400",
  server: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
  rack: "https://picsum.photos/seed/hv141/600/400",
  ups: "https://picsum.photos/seed/hv119/600/400",
  fire: "https://picsum.photos/seed/hv299/600/400",
  alarm: "https://picsum.photos/seed/hv300/600/400",
  sensor: "https://picsum.photos/seed/hv301/600/400",
  smart: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80",
  hub: "https://picsum.photos/seed/hv114/600/400",
  voice: "https://picsum.photos/seed/hv302/600/400",
  display: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80",
  screen: "https://picsum.photos/seed/hv111/600/400",
  monitor: "https://picsum.photos/seed/hv303/600/400",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
  mouse: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
  headset: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
  phone: "https://images.unsplash.com/photo-1520923642038-b4259c1465b3?w=600&q=80",
  intercom: "https://picsum.photos/seed/hv103/600/400",
  projector: "https://picsum.photos/seed/hv304/600/400",
  speaker: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80",
  sound: "https://picsum.photos/seed/hv107/600/400",
  microphone: "https://picsum.photos/seed/hv305/600/400",

  // SECURITY
  safe: "https://picsum.photos/seed/hv306/600/400",
  lock: "https://picsum.photos/seed/hv307/600/400",
  key: "https://picsum.photos/seed/hv308/600/400",
  card: "https://picsum.photos/seed/hv309/600/400",
  rfid: "https://picsum.photos/seed/hv310/600/400",

  // ADDITIONAL PRODUCTS FROM CATALOG
  egg: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80",
  lobster: "https://images.unsplash.com/photo-1553659971-f01207815844?w=600&q=80",
  frozen: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600&q=80",
  dough: "https://picsum.photos/seed/hv311/600/400",
  pickle: "https://images.unsplash.com/photo-1634731111880-0865173c4891?w=600&q=80",
  saffron: "https://images.unsplash.com/photo-1590590467198-602e24263b9b?w=600&q=80",
  prosciutto: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80",
  laundry: "https://picsum.photos/seed/hv312/600/400",
  steam: "https://picsum.photos/seed/hv313/600/400",
  biohazard: "https://picsum.photos/seed/hv124/600/400",
  compactor: "https://picsum.photos/seed/hv314/600/400",
  waste: "https://picsum.photos/seed/hv315/600/400",
  transformer: "https://picsum.photos/seed/hv316/600/400",
  panel: "https://picsum.photos/seed/hv317/600/400",
  toilet: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=600&q=80",
  drainage: "https://picsum.photos/seed/hv318/600/400",
  welding: "https://picsum.photos/seed/hv319/600/400",
  safety: "https://picsum.photos/seed/hv320/600/400",
  face: "https://picsum.photos/seed/hv321/600/400",
  massage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  scrub: "https://picsum.photos/seed/hv322/600/400",
  swab: "https://picsum.photos/seed/hv323/600/400",
  diffuser: "https://picsum.photos/seed/hv324/600/400",
  dishwasher: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
  dryer: "https://images.unsplash.com/photo-1626806775351-538068a21838?w=600&q=80",
  washer: "https://picsum.photos/seed/hv100/600/400",
  cooler: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80",
  ice: "https://picsum.photos/seed/hv147/600/400",
  mixer: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80",
  blender: "https://picsum.photos/seed/hv121/600/400",
  steel: "https://picsum.photos/seed/hv325/600/400",
  shelf: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80",
  fabrication: "https://picsum.photos/seed/hv326/600/400",
  film: "https://picsum.photos/seed/hv161/600/400",
  foil: "https://picsum.photos/seed/hv327/600/400",
  fountain: "https://picsum.photos/seed/hv328/600/400",
  softener: "https://picsum.photos/seed/hv329/600/400",
  filtration: "https://picsum.photos/seed/hv330/600/400",
  smoke: "https://picsum.photos/seed/hv331/600/400",
  ceramic: "https://images.unsplash.com/photo-1612196808214-b7e239e5bbae?w=600&q=80",
  vase: "https://picsum.photos/seed/hv144/600/400",
  throw: "https://picsum.photos/seed/hv332/600/400",
  countertop: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  tile: "https://picsum.photos/seed/hv116/600/400",
  finger: "https://picsum.photos/seed/hv333/600/400",
  herbal: "https://picsum.photos/seed/hv104/600/400",
  organic: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  bran: "https://picsum.photos/seed/hv334/600/400",
  cap: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
  molasses: "https://picsum.photos/seed/hv101/600/400",
  walnut: "https://picsum.photos/seed/hv335/600/400",
  sardine: "https://picsum.photos/seed/hv336/600/400",
  carpentry: "https://picsum.photos/seed/hv337/600/400",
  desk: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
  chair: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=600&q=80",
  jasmine: "https://picsum.photos/seed/hv338/600/400",
  chamomile: "https://picsum.photos/seed/hv339/600/400",
  rental: "https://picsum.photos/seed/hv340/600/400",
  plumbing: "https://picsum.photos/seed/hv341/600/400",
  maintenance: "https://picsum.photos/seed/hv342/600/400",
  repair: "https://picsum.photos/seed/hv343/600/400",
  microgreen: "https://picsum.photos/seed/hv113/600/400",
  outdoor: "https://picsum.photos/seed/hv145/600/400",
  marine: "https://picsum.photos/seed/hv344/600/400",
  boat: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80",
  cleaner: "https://picsum.photos/seed/hv345/600/400",
  carpet: "https://picsum.photos/seed/hv346/600/400",
  waterproof: "https://picsum.photos/seed/hv347/600/400",
};

// Category defaults when no keyword matches
const CATEGORY_DEFAULTS: Record<string, string> = {
  fb: "https://images.unsplash.com/photo-1544025162-d76690b68f11?w=600&q=80",
  hk: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",
  lin: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
  eng: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=600&q=80",
  gra: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  ffe: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  ose: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  it: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  sec: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
};

// Deterministic gradient colors derived from product name
const GRADIENT_PALETTE = [
  ["#1a1a2e", "#16213e", "#0f3460"],
  ["#2d132c", "#801336", "#c72c41"],
  ["#1b262c", "#0f4c75", "#3282b8"],
  ["#2c003e", "#512b58", "#fe346e"],
  ["#1e212d", "#383e56", "#6e7c7c"],
  ["#0f0f0f", "#232323", "#3a3a3a"],
  ["#1a1a1a", "#2d2d2d", "#404040"],
  ["#1e1e2f", "#2d2d44", "#3e3e5e"],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export function getProductImage(product: { name: string; category: string }): { type: "url"; src: string } | { type: "gradient"; colors: string[]; initials: string } {
  const name = product.name.toLowerCase();
  const category = product.category as string;

  // Try keyword match
  for (const [keyword, url] of Object.entries(KEYWORD_MAP)) {
    if (name.includes(keyword)) {
      return { type: "url", src: url };
    }
  }

  // Try category default
  const catDefault = CATEGORY_DEFAULTS[category];
  if (catDefault) {
    return { type: "url", src: catDefault };
  }

  // Fallback: deterministic gradient with initials
  const hash = hashString(product.name);
  const palette = GRADIENT_PALETTE[hash % GRADIENT_PALETTE.length];
  const initials = product.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return { type: "gradient", colors: palette, initials };
}

export function getCategoryImage(categoryId: string): string {
  return CATEGORY_DEFAULTS[categoryId] || CATEGORY_DEFAULTS.fb;
}
