import fs from 'fs/promises';
import { Worker } from 'worker_threads';
import os from 'os';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const findLineStart = async (fileHandle, pos, fileSize) => {
  if (pos <= 0) return 0;
  if (pos >= fileSize) return fileSize;

  const buf = Buffer.alloc(1);
  let i = pos;
  while (i < fileSize) {
    await fileHandle.read(buf, 0, 1, i);
    if (buf[0] === 0x0a) return i + 1; // символ после \n
    i++;
  }
  return fileSize;
};

export const logStats = async (inputPath, outputPath) => {
  try {
    const stat = await fs.stat(inputPath);
    const fileSize = stat.size;
    const numWorkers = os.cpus().length;
    const chunkSize = Math.ceil(fileSize / numWorkers);

    const fileHandle = await fs.open(inputPath, 'r');

    const chunks = [];
    let start = 0;
    for (let i = 0; i < numWorkers; i++) {
      if (start >= fileSize) break;
      const rawEnd = Math.min(start + chunkSize - 1, fileSize - 1);
      const nextStart = rawEnd + 1 >= fileSize
        ? fileSize
        : await findLineStart(fileHandle, rawEnd + 1, fileSize);
      const end = nextStart - 1;
      chunks.push({ start, end });
      start = nextStart;
    }

    await fileHandle.close();

    const promises = chunks.map(({ start, end }) => {
      return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, '../workers/logWorker.js'), {
          workerData: { inputPath, start, end }
        });
        worker.on('message', resolve);
        worker.on('error', (err) => {
          reject(err);
        });
      });
    });

    const results = await Promise.all(promises);

    const mergeResults = (results) => {
      const merged = {
        total: 0,
        levels: {},
        status: {},
        paths: {},
        responseTimeSum: 0
      };

      for (const result of results) {
        merged.total += result.total;
        merged.responseTimeSum += result.responseTimeSum;

        for (const [key, value] of Object.entries(result.levels)) {
          merged.levels[key] = (merged.levels[key] || 0) + value;
        }
        for (const [key, value] of Object.entries(result.status)) {
          merged.status[key] = (merged.status[key] || 0) + value;
        }
        for (const [key, value] of Object.entries(result.paths)) {
          merged.paths[key] = (merged.paths[key] || 0) + value;
        }
      }
      return merged;
    };

    const merged = mergeResults(results);
    const avgResponseTimeMs = merged.responseTimeSum / merged.total;
    const topPaths = Object.entries(merged.paths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    const output = {
      total: merged.total,
      levels: merged.levels,
      status: merged.status,
      topPaths,
      avgResponseTimeMs
    };

    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
  } catch (err) {
    throw new Error();
  }
};