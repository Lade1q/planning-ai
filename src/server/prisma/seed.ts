import {
  PrismaClient,
  StudyPlanStatus,
  ConceptSource,
  ConceptStatus,
  AnalysisJobStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Seed script tao du lieu mau cho development.
 * Tao 1 user test, 1 study plan mau, 3 concepts, 2 edges,
 * 1 analysis job, va 1 question cache entry.
 *
 * Script nay KHONG duoc phep chay tren production.
 */
async function main() {
  // Production guard
  if (process.env.NODE_ENV === "production") {
    console.error("ABORTED: Seed script is NOT allowed in production!");
    process.exit(1);
  }

  await prisma.$transaction(async (tx) => {
    // Xoa du lieu cu (thu tu: child -> parent)
    await tx.questionCache.deleteMany();
    await tx.conceptEdge.deleteMany();
    await tx.concept.deleteMany();
    await tx.analysisJob.deleteMany();
    await tx.studyPlan.deleteMany();
    await tx.user.deleteMany();

    // Tao user test
    const testUser = await tx.user.create({
      data: {
        email: "test@recallai.dev",
        passwordHash: "$2b$10$placeholder_hash_for_seeding_only",
        name: "Test User",
      },
    });

    console.log("Created test user:", testUser.email);

    // Tao study plan mau
    const plan = await tx.studyPlan.create({
      data: {
        userId: testUser.id,
        name: "Cau truc du lieu va Giai thuat",
        deadline: new Date("2026-08-15"),
        status: StudyPlanStatus.active,
      },
    });

    console.log("Created study plan:", plan.name);

    // Tao 3 concepts mau (DAG: Array -> LinkedList -> BinaryTree)
    const conceptArray = await tx.concept.create({
      data: {
        planId: plan.id,
        name: "Array",
        difficulty: 1,
        source: ConceptSource.ai_generated,
        status: ConceptStatus.active,
      },
    });

    const conceptLinkedList = await tx.concept.create({
      data: {
        planId: plan.id,
        name: "Linked List",
        difficulty: 2,
        source: ConceptSource.ai_generated,
        status: ConceptStatus.active,
      },
    });

    const conceptBinaryTree = await tx.concept.create({
      data: {
        planId: plan.id,
        name: "Binary Tree",
        difficulty: 3,
        source: ConceptSource.ai_generated,
        status: ConceptStatus.active,
      },
    });

    console.log("Created 3 concepts: Array, Linked List, Binary Tree");

    // Tao 2 edges (prerequisite): Array -> LinkedList, LinkedList -> BinaryTree
    await tx.conceptEdge.createMany({
      data: [
        {
          planId: plan.id,
          fromConceptId: conceptArray.id,
          toConceptId: conceptLinkedList.id,
        },
        {
          planId: plan.id,
          fromConceptId: conceptLinkedList.id,
          toConceptId: conceptBinaryTree.id,
        },
      ],
    });

    console.log("Created 2 prerequisite edges: Array -> Linked List -> Binary Tree");

    // Tao 1 analysis job mau
    await tx.analysisJob.create({
      data: {
        planDraftId: plan.id,
        status: AnalysisJobStatus.done,
        retryCount: 0,
        completedAt: new Date(),
      },
    });

    console.log("Created 1 analysis job (status: done)");

    // Tao 1 question cache entry mau
    await tx.questionCache.create({
      data: {
        conceptId: conceptArray.id,
        questionText: "Giai thich su khac biet giua Array va Linked List ve mat bo nho.",
        questionType: "open_ended",
        answerHint: "Array luu tru lien tiep trong bo nho, Linked List luu tru phan tan voi con tro.",
      },
    });

    console.log("Created 1 question cache entry");
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
