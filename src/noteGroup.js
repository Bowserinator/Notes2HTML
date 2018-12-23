'use strict';

const path = require('path');
const basePath = path.normalize(__dirname);

const fs = require('fs-extra');
const mkdirp = require('mkdirp');

const config = require(basePath + '/config.js');
const categoryPage = require(basePath + '/categoryPage.js');
const categoryList = require(basePath + '/allCategoryPage.js');
const mdToHTML = require(basePath + '/mdToHTML.js');

const fileRank = (a, b) => {
    return a.category === b.category ?
        a.sub === b.sub ?
            a.number - b.number : a.sub < b.sub ? 1 : -1
        : a.category < b.categry ? 1 : -1;
}

/**
 * Return array of all files in a directory
 * 
 * @see https://stackoverflow.com/a/20525865
 * @param {string} dir   Directory to search
 * @param {array} files_ For recursion, array of files 
 */
function getFiles(dir, files_) {
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files) {
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory())
            getFiles(name, files_);
        else
            files_.push(name);
    }
    return files_;
}

/**
 * Log a message with a timestamp
 * @param {string} msg message
 */
function log(msg) {
    let d = new Date();
    console.log(`[${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}] ${msg}`);
}

/**
 * Adds a leading 0 if n < 10
 * @param {number} n Number
 */
function addZero(n) {
    return n < 10 ? '0' + n : '' + n;
}

/**
 * Checks if an extension is valid
 * @param x File path
 */
const isValidExt = x => {
    let t = x.split('.');
    return config.fileExt.includes(t[t.length - 1].toLowerCase());
};

/**
 * Collection of notes
 */
class NoteGroup {
    /**
     * Construct a NoteGroup
     * @param dir              Directory of notes
     * @param renameDuplicates Rename duplicate files?
     */
    constructor(dir, renameDuplicates=true) {
        this.allFiles = getFiles(dir)
        this.filePaths = this.allFiles.filter(isValidExt);
        this.nonExtFilePaths = this.allFiles.filter(x => !isValidExt(x)).map(x => x.split(dir)[1]);
        this.inputDir = dir;

        this.files = [];
        this.categories = {};

        for (let filePath of this.filePaths) {
            let file = new File(filePath);
            this.files.push(file);

            this.categories[file.category] = this.categories[file.category] ?
                this.categories[file.category] : {};

            this.categories[file.category][file.sub] = this.categories[file.category][file.sub] ?
                this.categories[file.category][file.sub] : [];
            
            this.categories[file.category][file.sub].push(file);
        }

        /* Sort files by category, then subcategory, then rank */
        this.files.sort(fileRank);

        /* Check for duplicates */
        console.log('Checking for file duplicates...');
        let seenFiles = {};

        for (let file of this.files) {
            let filep = file.path;

            if (seenFiles[filep] > 0) {
                seenFiles[filep]++;
                log('[WARN] File ' + filep + ' is a duplicate, and will be ' +
                    (renameDuplicates ? 'renamed' : 'overwritten'));

                if (renameDuplicates)
                    file.path = file.path.replace('.html', '_' + seenFiles[filep] + '.html');
            }
            else seenFiles[filep] = 1;
        }
        console.log('');

        for(let i = 0; i < this.files.length; i++)
            this.files[i].generateHTML(this.files[i + 1], this.files[i - 1]);

        for (let category of Object.keys(this.categories)) {
            for (let sub of Object.keys(this.categories[category]))
                this.categories[category][sub].sort(fileRank);
        }
    }

    /**
     * Writes output html to a folder
     * @param dir Output dir 
     */
    outputToFolder(dir) {
        log('Ensuring output folder is empty...');
        fs.removeSync(dir);
        console.log('');

        log('Copying web files to directory...');
        fs.copySync('./web', dir);

        log('Adding files... please wait...');
        let i = 1;

        for (let file of this.files) {
            mkdirp.sync(dir + file.baseUrl);
            fs.writeFileSync(dir + file.path, file.html);
            log(`[${i}] Created ${file.path}`);
            i++;
        }

        console.log('');
        for (let category of Object.keys(this.categories)) {
            let html = categoryPage(this.categories[category], category);
            let path = '/a/' + category.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '/index.html';

            log('Generating category page ' + path);
            fs.writeFileSync(dir + path, html);
        }

        console.log('');
        fs.writeFileSync(dir + '/index.html', categoryList(Object.keys(this.categories)));
        log('Generating main category page...');

        console.log('');

        /* Copy over non-md files */
        i = 1;
        for (let path of this.nonExtFilePaths) {
            mkdirp.sync(dir + path.substring(0, path.lastIndexOf('/')));
            log(`[${i}] Copying file ${path}`);
            fs.copySync(this.inputDir + path, dir + path);
            i++;
        }
    } 
}

/**
 * File class
 */
class File {
    /**
     * Construct a File
     * @param filePath path to file
     */
    constructor(filePath) {
        this.data = fs.readFileSync(filePath, { encoding: 'utf8' });
        this.lines = this.data.split('\n');

        let title, category, sub, number;
        for (let line of this.lines) {
            let deleteLine = true;
            if (line.startsWith('TITLE '))
                title = line.split('TITLE ')[1];
            else if (line.startsWith('CATEGORY '))
                category = line.split('CATEGORY ')[1];
            else if (line.startsWith('SUB '))
                sub = line.split('SUB ')[1];
            else if (line.startsWith('NUMBER '))
                number = line.split('NUMBER ')[1];
            else
                deleteLine = false;
            
            if (deleteLine)
                this.data = this.data.replace(line, '');
        }
        this.data = this.data.trim();

        /* Try to extrapolate category and subcategory from folders */
        let paths = filePath.split('/');
        if (category === undefined) 
            category = paths[paths.length - 3];
        if (sub === undefined) 
            sub = paths[paths.length - 2];

        if (title === undefined)
            throw 'TITLE line missing for file ' + filePath;
        if (category=== undefined)
            throw 'CATEGORY line missing for file ' + filePath;
        if (sub === undefined)
            throw 'SUB line missing for file ' + filePath;
        if (number === undefined || Number.isNaN(+number))
            log('[ERROR] NUMBER line missing or NaN for file ' + filePath);

        this.number = +number;
        this.category = category;
        this.title = title;
        this.sub = sub;
        
        this.baseUrl = '/a/' + category.replace(/[^a-z0-9]/gi, '_').toLowerCase() 
                     + '/' + sub.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '/';
        this.fileName = filePath.split('/');
        this.fileName = this.fileName[this.fileName.length - 1].split('.')[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase() + '.html';
        this.path = this.baseUrl + this.fileName;
        this.html = null;
    }

    /**
     * Generate HTML
     * @param prev Prev file
     * @param next Next file
     */
    generateHTML(prev, next) {
        if (prev && prev.category !== this.category) prev = null;
        if (next && next.category !== this.category) next = null;

        this.html = mdToHTML(this.data, this.baseUrl
            .replace(this.sub.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '/', ''), 
            this.title, this.category, this.sub, next, prev);
    }
}

module.exports = NoteGroup;