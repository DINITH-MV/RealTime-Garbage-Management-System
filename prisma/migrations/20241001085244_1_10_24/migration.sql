-- CreateTable
CREATE TABLE "Location" (
    "binId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "apiUrl" TEXT NOT NULL,
    "marker" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);
