require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// 1. Defensive Environment Validation
const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET", "REFRESH_TOKEN_SECRET"];
REQUIRED_ENV.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Critical Error: ${key} is not defined in .env`);
    }
});

// 2. Setup Driver Adapter (Prisma 7)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 3. Configuration Object
const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL
};

// 4. Manual Connection Utility
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = prisma;
module.exports.connectDB = connectDB;
module.exports.config = config;
