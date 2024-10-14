/*
  Warnings:

  - You are about to drop the column `idArtist` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `idAlbum` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `idArtist` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,image]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,image]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[track]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,artistId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `artistId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `image` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `albumId` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FREE', 'PREMIUM', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_idArtist_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_idAlbum_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_idArtist_fkey";

-- DropIndex
DROP INDEX "Artist_name_key";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "idArtist",
ADD COLUMN     "artistId" TEXT NOT NULL,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "idAlbum",
DROP COLUMN "idArtist",
ADD COLUMN     "albumId" TEXT NOT NULL,
ADD COLUMN     "artistId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "_SongToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SongToUser_AB_unique" ON "_SongToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SongToUser_B_index" ON "_SongToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Album_image_key" ON "Album"("image");

-- CreateIndex
CREATE UNIQUE INDEX "Album_name_image_key" ON "Album"("name", "image");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_image_key" ON "Artist"("image");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_name_image_key" ON "Artist"("name", "image");

-- CreateIndex
CREATE UNIQUE INDEX "Song_track_key" ON "Song"("track");

-- CreateIndex
CREATE UNIQUE INDEX "Song_name_artistId_key" ON "Song"("name", "artistId");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongToUser" ADD CONSTRAINT "_SongToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongToUser" ADD CONSTRAINT "_SongToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
