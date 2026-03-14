import { open } from 'fs/promises';
import crypto from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export const decrypt = async (inputPath, outputPath, password) => {
  try {
    const fileHandle = await open(inputPath, 'r');
    const stat = await fileHandle.stat();
    const fileSize = stat.size;

    const headerBuf = Buffer.alloc(28);
    await fileHandle.read(headerBuf, 0, 28, 0);

    const authTagBuf = Buffer.alloc(16);
    await fileHandle.read(authTagBuf, 0, 16, fileSize - 16);

    await fileHandle.close();

    const salt = headerBuf.subarray(0, 16);
    const iv = headerBuf.subarray(16, 28);

    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTagBuf);

    const readStream = createReadStream(inputPath, {
      start: 28,
      end: fileSize - 17,
    });
    const writeStream = createWriteStream(outputPath);

    await pipeline(readStream, decipher, writeStream);
  } catch {
    throw new Error();
  }
};
