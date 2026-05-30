const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  console.log('No logs yet. Run tests first: npm test');
  process.exit(0);
}

const logFiles = fs
  .readdirSync(logsDir)
  .filter((name) => name.endsWith('.log'))
  .map((name) => ({
    name,
    mtime: fs.statSync(path.join(logsDir, name)).mtimeMs,
  }))
  .sort((a, b) => b.mtime - a.mtime);

if (logFiles.length === 0) {
  console.log('No log files found in logs/. Run tests first: npm test');
  process.exit(0);
}

const latest = path.join(logsDir, logFiles[0].name);
console.log(`Latest log: ${latest}\n`);
console.log(fs.readFileSync(latest, 'utf8'));
