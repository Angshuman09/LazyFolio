#!/usr/bin/env node

import { existsSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync, spawnSync } from "node:child_process";
import net from "node:net";

const rootDir = process.cwd();
const envPath = resolve(rootDir, ".env");
const envExamplePath = resolve(rootDir, ".env.example");

console.log("\n🚀 Initializing Lazyfolio Development Environment...\n");

// Step 1: Ensure .env exists
if (!existsSync(envPath)) {
  if (existsSync(envExamplePath)) {
    console.log("📝 Creating .env from .env.example with local dev defaults...");
    copyFileSync(envExamplePath, envPath);
  } else {
    console.error("❌ Could not find .env.example to copy.");
    process.exit(1);
  }
} else {
  console.log("✔  .env already exists, keeping existing environment.");
}

// Function to check if a TCP port is open
function checkPortOpen(port, host = "127.0.0.1", timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.once("error", () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

// Step 2: Ensure PostgreSQL is available
async function ensureDatabase() {
  const isPort5432Open = await checkPortOpen(5432);

  if (isPort5432Open) {
    console.log("✔  PostgreSQL detected on port 5432.");
    return;
  }

  console.log("🐳 Port 5432 not currently open. Attempting to start PostgreSQL via Docker Compose...");
  try {
    const result = spawnSync("docker", ["compose", "up", "-d"], { stdio: "inherit" });
    if (result.status === 0) {
      console.log("⏳ Waiting for PostgreSQL container to become ready...");
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        if (await checkPortOpen(5432)) {
          console.log("✔  PostgreSQL container is ready.");
          return;
        }
      }
    }
  } catch {
    // Docker command not found or failed
  }

  console.log("⚠️  Could not automatically verify a running PostgreSQL database on localhost:5432.");
  console.log("   If using an external database or Docker Desktop, make sure your PostgreSQL service is running.");
}

await ensureDatabase();

// Step 3: Synchronize Prisma Schema
console.log("\n📦 Syncing database schema with Prisma...");
try {
  execSync("npx prisma db push", { stdio: "inherit" });
} catch {
  console.error("❌ Failed to push Prisma schema. Check your DATABASE_URL in .env.");
  process.exit(1);
}

// Step 4: Seed Demo Data
console.log("\n🌱 Seeding demo contributor account and profile...");
try {
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
} catch {
  console.error("❌ Database seed encountered an issue (tables were synced).");
}

console.log("\n========================================================================");
console.log("🎉 Lazyfolio is ready for local development!");
console.log("------------------------------------------------------------------------");
console.log("Next steps:");
console.log("  1. Start the development server:");
console.log("     $ npm run dev\n");
console.log("  2. Open the auth page:");
console.log("     http://localhost:3000/auth\n");
console.log("  3. Log in with One-Click Dev Login or credentials:");
console.log("     • Email:    demo@lazyfolio.dev");
console.log("     • Password: password123\n");
console.log("  4. View the demo profile:");
console.log("     http://localhost:3000/demo");
console.log("========================================================================\n");
