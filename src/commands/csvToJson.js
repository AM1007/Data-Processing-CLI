import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';

export const csvToJson = async (inputPath, outputPath) => {
  const readStream = createReadStream(inputPath, { encoding: 'utf-8' });
  const writeStream = createWriteStream(outputPath);

  let headers = null;
  let remainder = '';
  let isFirst = true;

  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        remainder += chunk;
        const lines = remainder.split('\n');
        remainder = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue; 

          if (!headers) {
            headers = trimmed.split(',');
          } else {
            const values = trimmed.split(',');
            const obj = {};

            headers.forEach((header, i) => {
              obj[header] = values[i];
            });

            const json = JSON.stringify(obj, null, 2);

            if (isFirst) {
              this.push('[\n' + json);
              isFirst = false;
            } else {
              this.push(',\n' + json);
            }
          }
        }
      callback();
    },
    flush(callback) {
      this.push('\n]');
      callback();
    }
  });

  try {
    await pipeline(readStream, transformStream, writeStream);
  } catch {
    throw new Error();
  }
};

