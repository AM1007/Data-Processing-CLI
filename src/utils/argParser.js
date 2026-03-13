export const parseArgs = (args) =>{
  const result = {};

  for (let i = 0; i < args.length; i+=1){
    if(args[i].startsWith('--')){
      const key = args[i].slice(2);
      const next = args[i + 1];
      const value = (!next || next.startsWith('--')) ? true : next;
      result[key] = value;
    }
  }

  return result;
}