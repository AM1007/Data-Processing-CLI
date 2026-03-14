import path from "path";
import fs from 'fs/promises';
import { cwd, setCwd, printCwd } from './main.js';
import { resolvePath } from './utils/pathResolver.js';

export const goUp = () => {
  const parentDir = path.dirname(cwd);
  if (parentDir === cwd) {
    printCwd();
    return;
  }
  setCwd(parentDir);
  printCwd();
};

export const changeDir = async (targetPath) => {
  const resolvedPath = resolvePath(cwd, targetPath);
  try {
    const stat = await fs.stat(resolvedPath);
    if (!stat.isDirectory()) {
      throw new Error();
    }
    setCwd(resolvedPath);
    printCwd();
  } catch {
    throw new Error();
  }
};

export const listDir = async () => {
  const entries = await fs.readdir(cwd, { withFileTypes: true });

  const folders = entries
    .filter(entry => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  const files = entries
    .filter(entry => !entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));

  folders.forEach(entry => console.log(`${entry.name}    [folder]`));
  files.forEach(entry => console.log(`${entry.name}    [file]`));
};
