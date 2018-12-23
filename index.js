'use strict';

const noteGroup = require('./src/noteGroup.js');
const { exec } = require('child_process');

let outputDir = './output';
let port = 8080;

let n = new noteGroup('./notes');
n.outputToFolder(outputDir);

exec('python -m http.server ' + port, { cwd: outputDir });
console.log('');
console.log('Your website can now be accessed at:');
console.log('https://localhost:' + port);