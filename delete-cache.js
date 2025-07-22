
const fs = require('fs');
const path = require('path');

const directory = path.join(process.env.LOCALAPPDATA, 'npm-cache');

fs.rm(directory, { recursive: true, force: true }, (err) => {
  if (err) {
    throw err;
  }

  console.log(`${directory} is deleted!`);
});
