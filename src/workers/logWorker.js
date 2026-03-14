import { workerData, parentPort } from 'worker_threads';
import { createReadStream } from 'fs';

const { inputPath, start, end } = workerData;
const readStream = createReadStream(inputPath, { start, end, encoding: 'utf-8' });

const stats = {
  total: 0,
  levels: {},
  status: {},
  paths: {},
  responseTimeSum: 0
};

let remainder = '';

readStream.on('data', (chunk) => {
  remainder += chunk;
  const lines = remainder.split('\n');
  remainder = lines.pop();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const parts = trimmed.split(' ');
    const level = parts[1];
    const statusCode = parseInt(parts[3]);
    const responseTime = parseInt(parts[4]);
    const path = parts[6];

    stats.total += 1;
    stats.levels[level] = (stats.levels[level] || 0) + 1;
    stats.paths[path] = (stats.paths[path] || 0) + 1;
    stats.responseTimeSum += responseTime;

    const statusClass = `${Math.floor(statusCode / 100)}xx`;
    stats.status[statusClass] = (stats.status[statusClass] || 0) + 1;
  }
});

readStream.on('end', () => {
  parentPort.postMessage(stats);
});

readStream.on('error', (err) => {
  console.error('Stream error:', err.message);
});