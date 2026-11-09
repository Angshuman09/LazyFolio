import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "better-auth/crypto";

async function main() {
  console.log("🌱 Starting Lazyfolio database seed...");

  const demoUserId = "demo-user-dev";
  const demoEmail = "demo@lazyfolio.dev";
  const demoPassword = "password123";
  const hashedPassword = await hashPassword(demoPassword);

  // 1. Upsert User
  const user = await prisma.user.upsert({
    where: { id: demoUserId },
    update: {
      email: demoEmail,
      name: "Alex River",
      emailVerified: true,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    create: {
      id: demoUserId,
      name: "Alex River",
      email: demoEmail,
      emailVerified: true,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
  });

  console.log(`✅ User verified: ${user.email} (${user.id})`);

  // 2. Upsert Credential Account for Better Auth
  await prisma.account.deleteMany({
    where: { userId: demoUserId, providerId: "credential" },
  });

  await prisma.account.create({
    data: {
      id: "demo-account-credential",
      accountId: demoUserId,
      providerId: "credential",
      userId: demoUserId,
      password: hashedPassword,
    },
  });
  console.log("✅ Auth credentials created (email: demo@lazyfolio.dev / password: password123)");

  // 3. Upsert Profile
  const profile = await prisma.profile.upsert({
    where: { userId: demoUserId },
    update: {
      username: "demo",
      name: "Alex River",
      email: demoEmail,
      tagline: "Full-Stack Engineer & OSS Contributor",
      quote: "Simplicity is the soul of efficiency.",
      bio: "Crafting modern web tools and clean user experiences with Next.js, TypeScript, and PostgreSQL.",
      skills: ["TypeScript", "Next.js", "React", "PostgreSQL", "Tailwind CSS", "Node.js"],
      skillsIsenable: true,
      themeId: "1",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    create: {
      userId: demoUserId,
      username: "demo",
      name: "Alex River",
      email: demoEmail,
      tagline: "Full-Stack Engineer & OSS Contributor",
      quote: "Simplicity is the soul of efficiency.",
      bio: "Crafting modern web tools and clean user experiences with Next.js, TypeScript, and PostgreSQL.",
      skills: ["TypeScript", "Next.js", "React", "PostgreSQL", "Tailwind CSS", "Node.js"],
      skillsIsenable: true,
      themeId: "1",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
  });

  console.log(`✅ Profile created: /${profile.username}`);

  // 4. Links
  await prisma.links.deleteMany({ where: { profileId: profile.id } });
  await prisma.links.createMany({
    data: [
      {
        profileId: profile.id,
        type: "GITHUB",
        label: "GitHub",
        url: "https://github.com",
        isenable: true,
      },
      {
        profileId: profile.id,
        type: "X",
        label: "X (Twitter)",
        url: "https://x.com",
        isenable: true,
      },
      {
        profileId: profile.id,
        type: "LINKEDIN",
        label: "LinkedIn",
        url: "https://linkedin.com",
        isenable: true,
      },
    ],
  });
  console.log("✅ Social links seeded");

  // 5. Experiences
  await prisma.experience.deleteMany({ where: { profileId: profile.id } });
  await prisma.experience.createMany({
    data: [
      {
        profileId: profile.id,
        companyName: "Acme Labs",
        role: "Senior Software Engineer",
        description: "Led frontend architecture for web applications and real-time collaboration tools.",
        startdate: new Date("2023-01-01"),
        isenable: true,
      },
      {
        profileId: profile.id,
        companyName: "Studio Pulse",
        role: "Full-Stack Developer",
        description: "Built developer platforms, APIs, and dashboard analytics using Next.js and PostgreSQL.",
        startdate: new Date("2021-06-01"),
        enddate: new Date("2022-12-31"),
        isenable: true,
      },
    ],
  });
  console.log("✅ Experience seeded");

  // 6. Projects
  await prisma.project.deleteMany({ where: { profileId: profile.id } });
  await prisma.project.createMany({
    data: [
      {
        profileId: profile.id,
        title: "Lazyfolio",
        description: "A fast, minimalist portfolio and writing platform for developers and creators.",
        techstack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
        githubLink: "https://github.com",
        projectLink: "http://localhost:3000",
        live: true,
        order: 1,
        isenable: true,
      },
      {
        profileId: profile.id,
        title: "Telemetry Kit",
        description: "Lightweight privacy-preserving telemetry and analytics microservice.",
        techstack: ["Hono", "Cloudflare Workers", "ClickHouse"],
        githubLink: "https://github.com",
        live: false,
        order: 2,
        isenable: true,
      },
    ],
  });
  console.log("✅ Projects seeded");

  // 7. Blog
  await prisma.blog.deleteMany({ where: { profileId: profile.id } });
  await prisma.blog.create({
    data: {
      profileId: profile.id,
      title: "Why Minimalist Portfolios Stand Out",
      slug: "why-minimalist-portfolios-stand-out",
      description: "How simple, distraction-free typography and clean layouts elevate personal websites.",
      type: "INTERNAL",
      content: `<p>In an internet flooded with animations and pop-ups, quiet design speaks the loudest.</p><p>When visitors land on your portfolio, they want to understand three things quickly:</p><ul><li>Who you are</li><li>What you build</li><li>How to reach you</li></ul><p>By focusing on typography, whitespace, and speed, you create an effortless reading experience.</p>`,
      isPublished: true,
      isEnabled: true,
    },
  });
  console.log("✅ Sample article seeded");

  // 8. Subscription (Active Pro status for dev)
  await prisma.subscription.upsert({
    where: { userId: demoUserId },
    update: {
      status: "ACTIVE",
      productId: "p_demo_supporter",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    },
    create: {
      userId: demoUserId,
      dodoSubscriptionId: "sub_demo_123",
      dodoCustomerId: "cust_demo_123",
      status: "ACTIVE",
      productId: "p_demo_supporter",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    },
  });
  console.log("✅ Supporter subscription activated for demo user");

  console.log("\n🎉 Database seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Demo user credentials:");
  console.log("  • Email:    demo@lazyfolio.dev");
  console.log("  • Password: password123");
  console.log("  • Profile:  http://localhost:3000/demo");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
