import fs from 'fs/promises';
import crypto from 'crypto';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';


export const decrypt = async (inputPath, outputPath, password) => {
   try{
    const fileBuffer = await fs.readFile(inputPath);

    const salt = fileBuffer.subarray(0, 16);
    const iv = fileBuffer.subarray(16, 28);
    const authTag = fileBuffer.subarray(fileBuffer.length - 16);
    const ciphertext = fileBuffer.subarray(28, fileBuffer.length - 16);

    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const readableStream = Readable.from(ciphertext);
    const writeStream = createWriteStream(outputPath);
    await pipeline(readableStream, decipher, writeStream);
  }catch{
    throw new Error();
  }
}

