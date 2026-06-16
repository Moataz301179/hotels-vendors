const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
p.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message))
  .finally(() => p.$disconnect());
