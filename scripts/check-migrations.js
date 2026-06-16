const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();
p.$queryRaw`SELECT * FROM _prisma_migrations ORDER BY started_at`
  .then(r => console.log(JSON.stringify(r, null, 2)))
  .catch(e => console.error(e.message))
  .finally(() => p.$disconnect());
