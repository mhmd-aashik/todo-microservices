-- CreateTable
CREATE TABLE "todos" (
    "id" UUID NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "todos_user_id_idx" ON "todos"("user_id");

-- CreateIndex
CREATE INDEX "todos_user_id_created_at_idx" ON "todos"("user_id", "created_at");
