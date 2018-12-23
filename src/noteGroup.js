'use strict';

const fs = require('fs-extra');
const mkdirp = require('mkdirp');

const config = require('./config.js');
const categoryPage = require('./categoryPage.js');
const categoryList = require('./allCategoryPage.js');
const mdToHTML = require('./mdToHTML.js');

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
 * Collection of notes
 */
class NoteGroup {
    /**
     * Construct a NoteGroup
     * @param dir Directory of notes
     */
    constructor(dir) {
        this.filePaths = getFiles(dir).filter(x => {
            let t = x.split('.');
            return config.fileExt.includes(t[t.length - 1].toLowerCase());
        });
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

        for(let i = 0; i < this.files.length; i++)
            this.files[i].generateHTML(this.files[i - 1], this.files[i + 1]);

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

        if (title === undefined)
            throw new Exception('TITLE line missing for file ' + filePath);
        if (category=== undefined)
            throw new Exception('CATEGORY line missing for file ' + filePath);
        if (sub === undefined)
            throw new Exception('SUB line missing for file ' + filePath);
        if (number === undefined || Number.isNaN(+number))
            throw new Exception('NUMBER line missing or NaN for file ' + filePath);
        if (title === 'index')
            throw new Exception('Title cannot be called index, see file ' + filePath);

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