-- CreateEnum
CREATE TYPE "StudyPlanStatus" AS ENUM ('draft', 'active', 'archived');

-- CreateEnum
CREATE TYPE "ConceptSource" AS ENUM ('ai_generated', 'manual', 'imported');

-- CreateEnum
CREATE TYPE "ConceptStatus" AS ENUM ('active', 'deprecated');

-- CreateEnum
CREATE TYPE "AnalysisJobStatus" AS ENUM ('pending', 'processing', 'done', 'failed');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "pomodoro_config" JSONB NOT NULL DEFAULT '{"work":25,"short_break":5,"long_break":15,"cycles":4,"sound":true}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plans" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "deadline" TIMESTAMP(3),
    "status" "StudyPlanStatus" NOT NULL DEFAULT 'active',
    "dag_auto_fixed" BOOLEAN NOT NULL DEFAULT false,
    "traceback_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concepts" (
    "id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "difficulty" INTEGER DEFAULT 1,
    "mastery_score" DOUBLE PRECISION,
    "source" "ConceptSource" NOT NULL DEFAULT 'ai_generated',
    "status" "ConceptStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_edges" (
    "id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "from_concept_id" UUID NOT NULL,
    "to_concept_id" UUID NOT NULL,

    CONSTRAINT "concept_edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_jobs" (
    "id" UUID NOT NULL,
    "plan_draft_id" UUID,
    "status" "AnalysisJobStatus" NOT NULL DEFAULT 'pending',
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "analysis_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_cache" (
    "id" UUID NOT NULL,
    "concept_id" UUID NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" VARCHAR(50),
    "answer_hint" TEXT,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "study_plans_user_id_idx" ON "study_plans"("user_id");

-- CreateIndex
CREATE INDEX "concepts_plan_id_idx" ON "concepts"("plan_id");

-- CreateIndex
CREATE INDEX "concept_edges_plan_id_idx" ON "concept_edges"("plan_id");

-- CreateIndex
CREATE INDEX "concept_edges_from_concept_id_idx" ON "concept_edges"("from_concept_id");

-- CreateIndex
CREATE INDEX "concept_edges_to_concept_id_idx" ON "concept_edges"("to_concept_id");

-- CreateIndex
CREATE UNIQUE INDEX "concept_edges_plan_id_from_concept_id_to_concept_id_key" ON "concept_edges"("plan_id", "from_concept_id", "to_concept_id");

-- CreateIndex
CREATE INDEX "analysis_jobs_plan_draft_id_idx" ON "analysis_jobs"("plan_draft_id");

-- CreateIndex
CREATE INDEX "analysis_jobs_status_idx" ON "analysis_jobs"("status");

-- CreateIndex
CREATE INDEX "question_cache_concept_id_idx" ON "question_cache"("concept_id");

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_edges" ADD CONSTRAINT "concept_edges_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_edges" ADD CONSTRAINT "concept_edges_from_concept_id_fkey" FOREIGN KEY ("from_concept_id") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_edges" ADD CONSTRAINT "concept_edges_to_concept_id_fkey" FOREIGN KEY ("to_concept_id") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_cache" ADD CONSTRAINT "question_cache_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
