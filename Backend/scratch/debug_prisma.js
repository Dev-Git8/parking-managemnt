const { connectDB } = require('../src/config/prisma');

async function main() {
  console.log('Testing Prisma connection...');
  await connectDB();
  console.log('Verification successful!');
  process.exit(0);
}

main();
