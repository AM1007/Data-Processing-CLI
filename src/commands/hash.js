import crypto from 'crypto';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import fs from 'fs/promises';

export const hash = async (inputPath, algorithm, save) => {
  try{
    const hashStream = crypto.createHash(algorithm);
    const readStream = createReadStream(inputPath);
    await pipeline(readStream, hashStream);
    const result = hashStream.digest('hex');
    const hashFilePath = `${inputPath}.${algorithm}`;
    if (save) {
      await fs.writeFile(hashFilePath, result);
    }
    console.log(`${algorithm}: ${result}`);
    return result;
  }catch{
    throw new Error();
  }
}  