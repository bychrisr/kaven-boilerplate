-- CreateTable
CREATE TABLE "PlatformConfig" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'Kaven SaaS',
    "description" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#00A76F',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformConfig_pkey" PRIMARY KEY ("id")
);
