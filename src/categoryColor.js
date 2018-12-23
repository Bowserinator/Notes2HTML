'use strict';

const config = require('./config.js');
const colorHash = require('color-hash');

/**
 * Return a color for a given subject.
 * Modify pre-determined subjects in
 * config, otherwise it's randomly
 * generated via hash
 * 
 * @param {string} subject Subject
 * @return                 Color of the subject
 */
module.exports = function(subject) {
    let c = new colorHash();
    return config.subjectColors[subject.toLowerCase()] || c.hex(subject);
}