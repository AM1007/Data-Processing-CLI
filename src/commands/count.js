import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

export const count = (inputPath) =>{
  return new Promise((resolve, reject) => {
  const readStream = createReadStream(inputPath, { encoding: 'utf-8' });
  let lines = 0;
  let words = 0;
  let characters = 0;

  readStream.on('data', (chunk) => {
    characters += chunk.length;
    lines += chunk.split('\n').length - 1;
    words += chunk.split(/\s+/).filter(w => w.length > 0).length;
  });

  readStream.on('error', reject)
  readStream.on('end', () => {
    console.log(`Lines: ${lines}`);
    console.log(`Words: ${words}`);
    console.log(`Characters: ${characters}`);
    resolve();
  });
    
  })
}


