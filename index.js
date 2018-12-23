'use strict';

const path = require('path');
const basePath = path.normalize(__dirname);

const { exec } = require('child_process');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const cliConf = require(basePath + '/cli-conf.js');
const noteGroup = require(basePath + '/src/noteGroup.js');

const usage = commandLineUsage(cliConf.sections);

/* Parse options */
let options = commandLineArgs(cliConf.optionDefinitions);

if (options.help) {
    console.log(usage);
    process.exit(0);
}
if (options.input === undefined) {
    console.error('You must specify an input directory, use --help for more info');
    process.exit(1);
}
if (options.output === undefined) {
    console.error('You must specify an output directory, use --help for more info');
    process.exit(1);
}

if (options.rename === undefined)
    options.rename = true;
if (options.noserver === undefined)
    options.noserver = false;
if (options.port === undefined)
    options.port = 8080;

options.input = path.resolve(options.input);
options.output = path.resolve(options.output);

let port = options.port;
let n = new noteGroup(options.input, options.rename);

n.outputToFolder(options.output);

if (!options.noserver) {
    exec('python -m http.server ' + port, { cwd: options.output });
    console.log('');
    console.log('Your website can now be accessed at:');
    console.log('https://localhost:' + port);
}