import os from 'os';
import readline from 'readline';
import { handleCommand } from './repl.js';

export let cwd = os.homedir();

export const printCwd = () => {
  console.log(`You are currently in ${cwd}`);
};

console.log('Welcome to Data Processing CLI!');
printCwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let isExiting = false;

const prompt = () => {
  
  rl.question('> ', async (input) => {
    const command = input.trim();
    if (command === '.exit') {
      isExiting = true;
      console.log('Thank you for using Data Processing CLI!');
      rl.close();
      return;
    }
    await handleCommand(command);
    prompt();
  });
};

prompt();

rl.on('close', () => {
  if (!isExiting) {
    console.log('Thank you for using Data Processing CLI!');
  }
  process.exit(0);
});

export const setCwd = (newCwd) => {
  cwd = newCwd;
};