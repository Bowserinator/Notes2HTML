'use strict';

const md = require('markdown-it')()
    .use(require('markdown-it-sub'))
    .use(require('markdown-it-sup'))
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-deflist'))
    .use(require('markdown-it-abbr'))
    .use(require('markdown-it-highlightjs'));
const customTagHandler = require('./customTagHandler.js');
const config = require('./config.js');
const categoryColor = require('./categoryColor.js');

const HTML_TEMPLATE = `
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta name="description" content="[CATEGORY] - [PAGE] Notes, formatted into a neat website using Notes2HTML">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Social meta -->
    <meta property="og:title" content="Notes about [PAGE]">
    <meta property="og:description" content="[CATEGORY] - [PAGE] Notes, formatted into a neat website using Notes2HTML">
    <meta property="og:image" content="img/thumbnail.jpg">

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">

    <title>[CATEGORY] | [PAGE]</title>

    <!-- Custom font -->
    <link href="https://fonts.googleapis.com/css?family=Major+Mono+Display|Raleway:400,400i,700,700i" rel="stylesheet">

    <!-- Import libraries for ASCII math -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=AM_CHTML"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
                jax: ["input/TeX", "output/HTML-CSS"],
                tex2jax: {
                inlineMath: [ ['$','$'] ],
                displayMath: [ ],
                processEscapes: true
            },
            "HTML-CSS": { fonts: ["TeX"] },
            asciimath2jax: {
                delimiters: [ ['%%','%%'] ]
            }
        });
    </script>
    
    <!-- LaTeX rendering -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css" integrity="sha384-9eLZqc9ds8eNjO3TmqPeYcDj8n+Qfa4nuSiGYa6DjLNcv9BtN69ZIulL9+8CqC9Y"
        crossorigin="anonymous">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js" integrity="sha384-K3vbOmF2BtaVai+Qk37uypf7VrgBubhQreNQe9aGsz9lB63dIFiQVlJbr92dw2Lx"
        crossorigin="anonymous"></script>

    <!-- Custom JS -->
    <script src="${config.jsPath}/index.js"></script>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="${config.cssPath}/index.css">
</head>

<body>
    <div class="header" style="border-bottom: 30px solid [CATEGORY HASH]">
        <h1 class="header-title">[PAGE]</h1>
        <a href="[RETURN URL]" style="text-decoration-color: white;">
            <h4 class="header-sub">[CATEGORY] / [SUB]</h4>
        </a>
    </div>
    <div class="main-body">

[BODY]

<br><br>
<hr>
[PREV]
[NEXT]
<br>
        <a href="[RETURN URL]" class="return-button"></h3>GO BACK</h3></a>
    </div>

    <div class="footer">
    <br>
    ${config.footerText}
    </div>

    <script src="${config.jsPath}/accordion.js"></script>
</body>
</html>`;

/**
 * Generate the <a> tag for a file (next/prev note)
 * @param {File} file    File object
 * @param {boolean} next Next note? Or previous?
 */
function nextHref(file, next=true) {
    return `<a style="float: ${next ? 'right' : 'left'}" href="${file.path}">${next ? 'Next' : 'Prev'}: ${file.title}</a>`;
}

/**
 * Renders markdown to HTML
 * @param {string} text     Text to render
 * @param {string} url      Top level url
 * @param {string} title    Title of the notes
 * @param {string} category Category, ie 'physics'
 * @param {string} sub      Subcategory, ie 'waves'
 * @param {File}   prev     Previous File object
 * @param {File}   next     Next file object
 */
module.exports = function(text, url, title, category, sub, prev, next) {
    let categoryHash = categoryColor(category);
    let returnUrl = url;

    return HTML_TEMPLATE
        .replace(new RegExp('\\[CATEGORY\\]', 'g'), category)
        .replace(new RegExp('\\[PAGE\\]', 'g'), title)
        .replace(new RegExp('\\[RETURN URL\\]', 'g'), returnUrl)
        .replace('[SUB]', sub)
        .replace('[PREV]', prev ? nextHref(prev, false) : '')
        .replace('[NEXT]', next ? nextHref(next, true) : '')
        .replace('[CATEGORY HASH]', categoryHash)
        .replace('[BODY]', customTagHandler(md.render(text)))
        .trim();
}