import { cwd, printCwd } from './main.js';
import { goUp, changeDir, listDir } from './navigation.js';
import { parseArgs } from "./utils/argParser.js"
import { resolvePath } from './utils/pathResolver.js';
import { count } from './commands/count.js'
import { csvToJson } from './commands/csvToJson.js'
import { jsonToCsv } from './commands/jsonToCsv.js'
import { hash } from './commands/hash.js';
import { hashCompare } from './commands/hashCompare.js'
import { encrypt } from './commands/encrypt.js'
import { decrypt } from './commands/decrypt.js'
import { logStats } from './commands/logStats.js'

export const handleCommand = async (command) => {
  const parts = command.split(' ');
  const name = parts[0];
  const args = parts.slice(1);
  const parsedArgs = parseArgs(args);

  if (name === 'up') {
    goUp();
    return;
  } else if (name === 'cd') {
    if (!parsedArgs.path) {
      console.log('Invalid input');
      return;
    }
  try{
    await changeDir(parsedArgs.path)
    }catch{
      console.log('Operation failed');
    }
  } else if (name === 'ls') {
    try {
      await listDir();
      printCwd();
    } catch {
      console.log('Operation failed');
    }
  } else if (name === 'csv-to-json'){
      if (!parsedArgs.input || !parsedArgs.output) {
        console.log('Invalid input');
        return;
      }
      try {
        const inputPath = resolvePath(cwd, parsedArgs.input);
        const outputPath = resolvePath(cwd, parsedArgs.output);
        await csvToJson(inputPath, outputPath);
        printCwd();
      } catch {
        console.log('Operation failed');
      }
    } else if (name === 'json-to-csv'){
      if (!parsedArgs.input || !parsedArgs.output) {
        console.log('Invalid input');
        return;
      }
      try{
        const inputPath = resolvePath(cwd, parsedArgs.input);
        const outputPath = resolvePath(cwd, parsedArgs.output);
        await jsonToCsv(inputPath, outputPath);
        printCwd();
      } catch{
        console.log('Operation failed');
      }
    } else if (name === 'count'){
     if (!parsedArgs.input) {
        console.log('Invalid input');
        return;
      }
      try{
        const inputPath = resolvePath(cwd, parsedArgs.input);
        await count(inputPath);
        printCwd();
      }catch{
        console.log('Operation failed');
      }
    } else if (name === 'hash') {
      if (!parsedArgs.input) {
        console.log('Invalid input');
      return;
      }
      try{
        const algorithm = parsedArgs.algorithm || 'sha256'
        const supported = ['sha256', 'md5', 'sha512'];
        if (!supported.includes(algorithm)) {
          throw new Error();
        }
        const inputPath = resolvePath(cwd, parsedArgs.input);
        await hash(inputPath, algorithm, parsedArgs.save);
        printCwd();  
      }catch{
        console.log('Operation failed');
      }
    } else if (name === 'hash-compare') {
      if (!parsedArgs.input || !parsedArgs.hash) {
      console.log('Invalid input');
      return;
      }
      try{
        const inputPath = resolvePath(cwd, parsedArgs.input);
        const hashFilePath = resolvePath(cwd, parsedArgs.hash);
        const algorithm = parsedArgs.algorithm || 'sha256';
        await hashCompare(inputPath, hashFilePath, algorithm);
        printCwd();
      }catch{
        console.log('Operation failed');
      }
    } else if (name === 'encrypt') {
      if (!parsedArgs.input || !parsedArgs.output || !parsedArgs.password) {
        console.log('Invalid input');
        return;
      }
      try{
        const inputPath = resolvePath(cwd, parsedArgs.input);
        const outputPath = resolvePath(cwd, parsedArgs.output);
        await encrypt(inputPath, outputPath, parsedArgs.password);
        printCwd();
      }catch{
        console.log('Operation failed');
      }
    } else if (name === 'decrypt') {
      if (!parsedArgs.input || !parsedArgs.output || !parsedArgs.password) {
        console.log('Invalid input');
        return;
      }
      try{
        const inputPath = resolvePath(cwd, parsedArgs.input);
        const outputPath = resolvePath(cwd, parsedArgs.output);
        await decrypt(inputPath, outputPath, parsedArgs.password);
        printCwd();
      }catch{
        console.log('Operation failed');
      }
    } else if (name === 'log-stats') {
      if (!parsedArgs.input || !parsedArgs.output) {
        console.log('Invalid input');
        return;
      }
      try{
        const inputPath = resolvePath(cwd, parsedArgs.input);
        const outputPath = resolvePath(cwd, parsedArgs.output);
        await logStats(inputPath, outputPath);
        printCwd();
      } catch{
        console.log('Operation failed');
      }
    } else {
  console.log('Invalid input');
  }
}