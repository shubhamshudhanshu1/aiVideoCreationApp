import { PrismaClient } from "@prisma/client";
import { Aspect, Visibility, JobState } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      emailVerified: new Date(),
      handle: "demo_user",
      displayName: "Demo User",
      marketingOptIn: false,
    },
  });

  console.log("✅ Created user:", user.handle);

  // Create initial credit ledger entry
  await prisma.creditLedger.create({
    data: {
      userId: user.id,
      delta: 40,
      reason: "initial_credits",
      balanceAfter: 40,
    },
  });

  console.log("✅ Created initial credits");

  // Create 3 demo projects
  const projects = [
    {
      title: "Sunset Over Mountains",
      prompt: "A beautiful sunset over snow-capped mountains with birds flying",
      styles: ["cinematic", "nature"],
      durationS: 30,
      aspect: Aspect.RATIO_16X9,
      coverUrl: "https://picsum.photos/seed/sunset/1280/720",
      mp4Url: "https://www.w3schools.com/html/mov_bbb.mp4",
      publishedAt: new Date(),
    },
    {
      title: "City Night Lights",
      prompt: "Aerial view of a vibrant city at night with neon lights and traffic",
      styles: ["urban", "fast-cut"],
      durationS: 25,
      aspect: Aspect.RATIO_9X16,
      coverUrl: "https://picsum.photos/seed/city/720/1280",
      mp4Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      publishedAt: new Date(Date.now() - 86400000), // Yesterday
    },
    {
      title: "Ocean Waves",
      prompt: "Peaceful ocean waves crashing on a sandy beach at sunrise",
      styles: ["mellow", "nature"],
      durationS: 20,
      aspect: Aspect.RATIO_1X1,
      coverUrl: "https://picsum.photos/seed/ocean/768/768",
      mp4Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      publishedAt: new Date(Date.now() - 172800000), // 2 days ago
    },
  ];

  for (const projectData of projects) {
    const project = await prisma.videoProject.create({
      data: {
        userId: user.id,
        ...projectData,
        exclude: [],
        voiceoff: true,
        status: "public",
        visibility: Visibility.public,
        modelVersion: "v4.5-all",
        allowRemix: true,
        likes: Math.floor(Math.random() * 100),
        plays: Math.floor(Math.random() * 500),
      },
    });

    // Create a completed render job
    await prisma.renderJob.create({
      data: {
        projectId: project.id,
        state: JobState.done,
        progress: 100,
      },
    });

    console.log(`✅ Created project: ${project.title}`);
  }

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

