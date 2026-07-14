-- AlterTable: add passwordHash with backfill for existing users (default: Password123!)
ALTER TABLE "users" ADD COLUMN "passwordHash" TEXT;
UPDATE "users" SET "passwordHash" = '$2b$12$ib5ZKQ9vXMjIrzaMLETuk.8KVRKPPFwyz65TdjmB/0lCGyssMDXVy' WHERE "passwordHash" IS NULL;
ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
