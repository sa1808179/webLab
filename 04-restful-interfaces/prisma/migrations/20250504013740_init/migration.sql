-- CreateTable
CREATE TABLE "CardType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "typeId" TEXT NOT NULL,
    "title" TEXT,
    "tags" JSONB NOT NULL DEFAULT [],
    "data" JSONB NOT NULL,
    "slideId" TEXT,
    CONSTRAINT "Card_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "CardType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Card_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "tags" JSONB NOT NULL DEFAULT [],
    "deckId" TEXT,
    CONSTRAINT "Slide_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "tags" JSONB NOT NULL DEFAULT []
);

-- CreateIndex
CREATE UNIQUE INDEX "CardType_type_key" ON "CardType"("type");
