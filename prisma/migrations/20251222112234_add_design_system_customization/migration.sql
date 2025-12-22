-- CreateEnum
CREATE TYPE "DesignSystemType" AS ENUM ('MUI', 'HIG', 'FLUENT', 'SHADCN');

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignSystemCustomization" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designSystem" "DesignSystemType" NOT NULL DEFAULT 'MUI',
    "mode" TEXT NOT NULL DEFAULT 'light',
    "colorPrimary" TEXT,
    "colorSecondary" TEXT,
    "colorSuccess" TEXT,
    "colorWarning" TEXT,
    "colorError" TEXT,
    "colorInfo" TEXT,
    "fontFamily" TEXT,
    "fontSizeScale" DOUBLE PRECISION DEFAULT 1.0,
    "spacingScale" DOUBLE PRECISION DEFAULT 1.0,
    "radiusScale" DOUBLE PRECISION DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignSystemCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignSystemCustomization_userId_key" ON "DesignSystemCustomization"("userId");

-- CreateIndex
CREATE INDEX "DesignSystemCustomization_userId_idx" ON "DesignSystemCustomization"("userId");

-- CreateIndex
CREATE INDEX "DesignSystemCustomization_designSystem_idx" ON "DesignSystemCustomization"("designSystem");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignSystemCustomization" ADD CONSTRAINT "DesignSystemCustomization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
