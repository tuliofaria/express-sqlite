PRAGMA journal_mode=WAL;
-- CreateTable
CREATE TABLE "TrackPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
