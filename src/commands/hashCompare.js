import fs from 'fs/promises';
import { hash } from "./hash.js";

export const hashCompare = async(inputPath, hashFilePath, algorithm) =>{
  try{
    const computedHash = await hash(inputPath, algorithm, false);
    const expectedHash = await fs.readFile(hashFilePath, 'utf-8');
    if (computedHash === expectedHash.trim().toLowerCase()) {
      console.log('OK');
  } else {
    console.log('MISMATCH');
  }
  }catch{
    throw new Error()
  }
}