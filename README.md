# Data-Processing-CLI

# Data Processing CLI

An interactive command-line tool for file system navigation and data processing, built with Node.js 24 and zero external dependencies.

## Requirements

- Node.js >= 24.10.0
- npm

## Installation
```bash
git clone <repo-url>
cd <repo-name>
npm install
```

## Usage
```bash
npm run start
```

On startup, the REPL initializes in the user's home directory and accepts commands until `.exit` or `Ctrl+C`.

## Commands

### Navigation

| Command | Description |
|---|---|
| `up` | Move up one directory level |
| `cd <path>` | Navigate to a directory (relative or absolute) |
| `ls` | List files and folders in current directory |

### Data Processing

| Command | Description |
|---|---|
| `csv-to-json --input <file> --output <file>` | Convert CSV to JSON array |
| `json-to-csv --input <file> --output <file>` | Convert JSON array to CSV |
| `count --input <file>` | Count lines, words, and characters |
| `hash --input <file> [--algorithm sha256\|md5\|sha512] [--save]` | Calculate file hash |
| `hash-compare --input <file> --hash <hashfile> [--algorithm ...]` | Compare file hash against stored value |
| `encrypt --input <file> --output <file> --password <pwd>` | Encrypt file using AES-256-GCM |
| `decrypt --input <file> --output <file> --password <pwd>` | Decrypt file encrypted by `encrypt` |
| `log-stats --input <file> --output <file>` | Analyze log file using Worker Threads |

All file paths can be relative (resolved against the current working directory) or absolute.

## Examples
```bash
> csv-to-json --input data.csv --output data.json
> hash --input data.json --algorithm sha256 --save
> encrypt --input data.json --output data.json.enc --password secret
> log-stats --input logs.txt --output stats.json
```

## Generate test log data
```bash
node scripts/generate-logs.js --output workspace/logs.txt --lines 500000
```

## Project Structure
```
src/
  main.js               # Entry point, REPL setup
  repl.js               # Command parsing and dispatching
  navigation.js         # up, cd, ls
  commands/
    csvToJson.js
    jsonToCsv.js
    count.js
    hash.js
    hashCompare.js
    encrypt.js
    decrypt.js
    logStats.js
  workers/
    logWorker.js        # Worker Thread for log-stats
  utils/
    pathResolver.js
    argParser.js
```

## Technical Notes

- No external libraries — Node.js built-ins only (`fs`, `stream`, `crypto`, `readline`, `worker_threads`, `os`, `path`)
- All file I/O uses the Streams API — files are never loaded fully into memory
- `log-stats` spawns N Worker Threads (N = logical CPU cores) for parallel chunk processing
- AES-256-GCM encryption: binary format is `[16B salt][12B iv][ciphertext][16B authTag]`
- Working directory is managed as application state — `process.cwd()` is not used for path resolution

