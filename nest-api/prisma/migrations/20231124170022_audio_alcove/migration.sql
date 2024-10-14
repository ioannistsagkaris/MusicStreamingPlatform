-- CreateTable

CREATE TABLE
    "User" (
        "id" TEXT NOT NULL,
        "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "email" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "hash" TEXT NOT NULL,

CONSTRAINT "User_pkey" PRIMARY KEY ("id") );

-- CreateTable

CREATE TABLE
    "Song" (
        "id" TEXT NOT NULL,
        "idArtist" TEXT NOT NULL,
        "idAlbum" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "track" TEXT NOT NULL,

CONSTRAINT "Song_pkey" PRIMARY KEY ("id") );

-- CreateTable

CREATE TABLE
    "Artist" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,

CONSTRAINT "Artist_pkey" PRIMARY KEY ("id") );

-- CreateTable

CREATE TABLE
    "Album" (
        "id" TEXT NOT NULL,
        "idArtist" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "image" BYTEA,

CONSTRAINT "Album_pkey" PRIMARY KEY ("id") );

-- AddForeignKey

ALTER TABLE "Song"
ADD
    CONSTRAINT "Song_idArtist_fkey" FOREIGN KEY ("idArtist") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "Song"
ADD
    CONSTRAINT "Song_idAlbum_fkey" FOREIGN KEY ("idAlbum") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "Album"
ADD
    CONSTRAINT "Album_idArtist_fkey" FOREIGN KEY ("idArtist") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;