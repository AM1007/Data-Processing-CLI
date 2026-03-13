import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import fs from 'fs/promises';

export const jsonToCsv = async (inputPath, outputPath) => {
  const content = await fs.readFile(inputPath, 'utf-8');
  const data = JSON.parse(content);
  const headers = Object.keys(data[0]);

  const headerLine = headers.join(',');
  const rows = data.map(obj => headers.map(h => obj[h]).join(','));

  const csvContent = [headerLine, ...rows].join('\n');
  const readableStream = Readable.from([csvContent]);
  const writeStream = createWriteStream(outputPath);

    try {
      await pipeline(readableStream, writeStream);
    } catch {
      throw new Error();
    }
}


