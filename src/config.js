/**
 * Config file for compiler
 */

'use strict';

module.exports = {
    definitionColor: '#d9e6fc',
    factColor: '#fff7e0',
    
    cssPath: '/css',
    jsPath: '/js',

    footerText: 'Hellomouse (c) [YEAR] - Bowserinator and Bradley'.replace(
        '[YEAR]', new Date().getFullYear()),
    
    subjectColors: {
        bio: 'green',
        biology: 'green',
        physics: '#4c90ff',
        chemistry: '#ffc04c',
        math: '#b198b7',
        algebra: '#ff7e4c',
        precalc: '#ff4c75',
        geometry: '#c6bda9',
        calc: '#d4d9db',
        calculus: '#d4d9db'
    },
    fileExt: ['note', 'md']
};