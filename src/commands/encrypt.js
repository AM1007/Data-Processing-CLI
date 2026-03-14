import crypto from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export const encrypt = async (inputPath, outputPath, password) => {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(password, salt, 32);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const readStream = createReadStream(inputPath);
  const writeStream = createWriteStream(outputPath);

  try {
    await new Promise((resolve, reject) => {
      writeStream.write(Buffer.concat([salt, iv]), (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await pipeline(readStream, cipher, writeStream, { end: false });

    const authTag = cipher.getAuthTag();
    await new Promise((resolve, reject) => {
      writeStream.end(authTag, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch {
    throw new Error();
  }
};
