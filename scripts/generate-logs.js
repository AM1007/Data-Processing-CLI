import fs from 'fs';
import path from 'path';

const levels = ['INFO', 'WARN', 'ERROR'];
const services = ['user-service', 'order-service', 'payment-service'];
const methods = ['GET', 'POST', 'PUT', 'DELETE'];
const paths = ['/api/users', '/api/orders', '/api/payments', '/api/products'];
const statuses = [200, 201, 301, 400, 404, 500];

const args = process.argv.slice(2);
const outputIndex = args.indexOf('--output');
const linesIndex = args.indexOf('--lines');

const outputPath = args[outputIndex + 1];
const lines = parseInt(args[linesIndex + 1]) || 1000;

const writeStream = fs.createWriteStream(outputPath);

for (let i = 0; i < lines; i++) {
  const date = new Date(2026, 0, 1 + Math.floor(i / 1000));
  const level = levels[Math.floor(Math.random() * levels.length)];
  const service = services[Math.floor(Math.random() * services.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const responseTime = Math.floor(Math.random() * 500) + 10;
  const method = methods[Math.floor(Math.random() * methods.length)];
  const urlPath = paths[Math.floor(Math.random() * paths.length)];

  writeStream.write(`${date.toISOString()} ${level} ${service} ${status} ${responseTime} ${method} ${urlPath}\n`);
}

writeStream.end();
console.log(`Generated ${lines} log lines to ${outputPath}`);