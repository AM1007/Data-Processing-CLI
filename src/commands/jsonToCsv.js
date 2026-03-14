import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';

export const jsonToCsv = async (inputPath, outputPath) => {
  const readStream = createReadStream(inputPath, { encoding: 'utf-8' });
  const writeStream = createWriteStream(outputPath);

  let buffer = '';
  let headersWritten = false;

  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      buffer += chunk;
      callback();
    },
    flush(callback) {
      try {
        const data = JSON.parse(buffer);
        const headers = Object.keys(data[0]);

        if (!headersWritten) {
          this.push(headers.join(',') + '\n');
          headersWritten = true;
        }

        for (const obj of data) {
          const row = headers.map(h => obj[h]).join(',');
          this.push(row + '\n');
        }

        callback();
      } catch {
        callback(new Error());
      }
    }
  });

  try {
    await pipeline(readStream, transformStream, writeStream);
  } catch {
    throw new Error();
  }
};