import { createReadStream } from 'fs';

export const count = (inputPath) => {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(inputPath, { encoding: 'utf-8' });
    let lines = 0;
    let words = 0;
    let characters = 0;
    let inWord = false;

    readStream.on('data', (chunk) => {
      characters += chunk.length;

      for (let i = 0; i < chunk.length; i++) {
        const ch = chunk[i];

        if (ch === '\n') {
          lines++;
        }

        const isWhitespace = ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';

        if (!isWhitespace && !inWord) {
          words++;
          inWord = true;
        } else if (isWhitespace) {
          inWord = false;
        }
      }
    });

    readStream.on('error', reject);
    readStream.on('end', () => {
      console.log(`Lines: ${lines}`);
      console.log(`Words: ${words}`);
      console.log(`Characters: ${characters}`);
      resolve();
    });
  });
};