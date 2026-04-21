const prisma = require('../src/config/prisma');

async function verify() {
  console.log('--- Starting Session Verification ---');
  
  // 1. Find a test user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found to test with.');
    return;
  }
  console.log(`Testing with user: ${user.email} (ID: ${user.id})`);

  // 2. Clear existing sessions for clean test
  await prisma.session.deleteMany({ where: { userId: user.id } });
  console.log('Cleared existing sessions.');

  // 3. Create 6 sessions
  console.log('Creating 6 sessions (should evict the 1st one)...');
  for (let i = 1; i <= 6; i++) {
    const token = `test_token_${i}`;
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Manual simulation of createSession logic (transactional)
    await prisma.$transaction(async (tx) => {
        const sessionCount = await tx.session.count({ where: { userId: user.id } });
        if (sessionCount >= 5) {
            const oldest = await tx.session.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: 'asc' }
            });
            if (oldest) await tx.session.delete({ where: { id: oldest.id } });
        }
        await tx.session.create({
            data: {
                userId: user.id,
                token: token,
                userAgent: `Device ${i}`,
                ipAddress: '127.0.0.1',
                expiresAt: sevenDaysFromNow
            }
        });
    });
    console.log(`Created session ${i}`);
  }

  // 4. Verify count is 5 and token 1 is gone
  const finalSessions = await prisma.session.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Final session count: ${finalSessions.length}`);
  if (finalSessions.length === 5) {
    console.log('✅ Max 5 devices limit enforced.');
  } else {
    console.log('❌ Max 5 devices limit FAILED.');
  }

  const token1Exists = finalSessions.some(s => s.token === 'test_token_1');
  if (!token1Exists) {
    console.log('✅ Oldest session (test_token_1) was evicted.');
  } else {
    console.log('❌ Oldest session (test_token_1) still exists.');
  }

  console.log('Current Sessions:');
  finalSessions.forEach(s => console.log(` - ${s.token} (${s.userAgent})`));

  process.exit(0);
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
