-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "CardTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
