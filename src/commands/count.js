import { createReadStream } from 'fs';

export const count = (inputPath) => {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(inputPath, { encoding: 'utf-8' });
    let lines = 0;
    let words = 0;
    let characters = 0;
    let lastCharWasSpace = true;

    readStream.on('data', (chunk) => {
      characters += chunk.length;
      lines += chunk.split('\n').length - 1;

      const tokens = chunk.split(/\s+/);

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.length === 0) continue;

        if (i === 0 && !lastCharWasSpace) {
        } else {
          words++;
        }
      }

      lastCharWasSpace = /\s$/.test(chunk);
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