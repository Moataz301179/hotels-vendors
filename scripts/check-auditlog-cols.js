const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
p.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'AuditLog' ORDER BY ordinal_position`
  .then(r => console.log(JSON.stringify(r.map(c => c.column_name))))
  .catch(e => console.error(e.message))
  .finally(() => p.$disconnect());
