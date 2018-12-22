/**
 * Handles custom tags in the file format that
 * are not supported natively by markdown.
 */

'use strict';

const tinycolor = require('tinycolor2');
const config = require('./config.js');

const colorRegex = /\[COLOR (.*?)]([\s\S]*?)\[\/COLOR\]/gm;
const defRegex = /\[DEF]([\s\S]*?)\[\/DEF\]/gm;
const factRegex = /\[FACT]([\s\S]*?)\[\/FACT\]/gm;
const QARegex = /\[A]([\s\S]*?)\[\/A\]/gm;
const latexRegex = /\$\$([\s\S]*?)\$\$/gm;
const interactiveRegex = /\[INTERACTIVE ([\s\S]*?)\]/gm;

/**
 * Find all matches of a regex in a
 * given block of text
 * 
 * @param {RegExp} regex Regex to match 
 * @param {string} text  Text to search
 */
function findAll(regex, text) {
    let m;
    let results = [];

    while ((m = regex.exec(text)) !== null) {
        /* This is necessary to avoid infinite loops with zero-width matches */
        if (m.index === regex.lastIndex)
            regex.lastIndex++;
        
        let r = [];
        m.forEach(match => { r.push(match); });

        /* Fix for the match array:
         * - Strip \n from matches after */
        for(let i = 0; i < r.length; i++)
            r[i] = r[i].trim();

        results.push(r);
    }
    return results;
}

/**
 * Generate an HTML color block to put
 * stuff in.
 * 
 * @param {string} text    Text in the block
 * @param {string} bgColor Background color
 */
function getColorBlock(text, bgColor) {
    let textColor = tinycolor(bgColor).isLight() ? 'black' : 'white';
    return `<div style="background-color: ${bgColor}; color: ${textColor}" class="text-block">
${text}
</div>`
}

/**
 * Replace custom tags with HTML for
 * later markdown parsing.
 * 
 * @return Formatted text
 */
module.exports = function(text) {
    /**
     * Replace COLOR blocks, defined as [COLOR color_goes_here]text[/COLOR]
     * with a div of the corresponding color. Text color is auto-determined
     * based on lightness of color.
     */
    let colorMatches = findAll(colorRegex, text);
    for (let match of colorMatches) 
        text = text.replace(match[0], getColorBlock(match[2], match[1]));

    /* Replace DEF and FACT blocks (Same as above, but with pre-defined colors) */
    let defMatches = findAll(defRegex, text);
    let factMatches = findAll(factRegex, text);
    
    for (let match of defMatches)
        text = text.replace(match[0], getColorBlock(match[1], config.definitionColor));
    for (let match of factMatches)
        text = text.replace(match[0], getColorBlock(match[1], config.factColor));

    /* Replace [A] with a question answer block */
    let QAmatches = findAll(QARegex, text);
    for (let match of QAmatches) {
        text = text.replace('<p>' + match[0] + '</p>', `<button class="accordion">Show answer</button>
<div class="panel">
    <p>${match[1]}</p>
</div>`);
    }

    /* LaTeX rendering with KaTex */
    let latexMatches = findAll(latexRegex, text);
    for (let match of latexMatches) {
        let id = 'latex-block-' + Math.random();
        text = text.replace(match[0], `<div id="${id}"></div>
<script>
addEvent(window, 'load', () => { katex.render(String.raw\`${match[1]}\`, document.getElementById('${id}'), { 
    throwOnError: false,
    displayMode: true
}); });
</script>`)
    }

    /* ASCII Math is handled by MathJax */
    // Do nothing

    /* [INTERACTIVE] blocks are replaced by iframes */
    let interactiveMatches = findAll(interactiveRegex, text);
    for (let match of interactiveMatches) {
        match[1] = match[1].split(' ');

        let src = match[1][0];
        let width = match[1][1];
        let height = match[1][2];

        text = text.replace(match[0], `<iframe src="${src}" height="${height}" width="${width}"></iframe>`);
    }

    return text;
};

