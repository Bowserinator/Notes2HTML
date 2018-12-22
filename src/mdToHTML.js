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

    <title>[CATEGORY] | [PAGE]</title>

    <!-- Import libraries for ASCII math -->
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            extensions: ["tex2jax.js"],
            jax: ["input/TeX", "output/HTML-CSS"],
            tex2jax: {
            inlineMath: [ ['%','%'] ],
            displayMath: [ ['%%','%%'] ],
            processEscapes: true
            },
            "HTML-CSS": { fonts: ["TeX"] }
        });
        </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=AM_CHTML"></script>

    <!-- LaTeX rendering -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css" integrity="sha384-9eLZqc9ds8eNjO3TmqPeYcDj8n+Qfa4nuSiGYa6DjLNcv9BtN69ZIulL9+8CqC9Y"
        crossorigin="anonymous">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js" integrity="sha384-K3vbOmF2BtaVai+Qk37uypf7VrgBubhQreNQe9aGsz9lB63dIFiQVlJbr92dw2Lx"
        crossorigin="anonymous"></script>

    <!-- Custom JS -->
    <script src="${config.jsPath}/index.js"></script>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="${config.cssPath}/index.css">

    <!-- Favicons -->
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
</head>

<body>
    <div class="header">
        <h1 class="header-title">[PAGE]</h1>
        <h4 class="header-sub">[CATEGORY]</h4>
    </div>
    <div class="main-body">

[BODY]

    </div>
    <script src="${config.jsPath}/accordion.js"></script>
</body>
</html>`;


/**
 * Renders markdown to HTML
 * @param text Text to render
 */
module.exports = function(text) {
    return HTML_TEMPLATE.replace('[BODY]', customTagHandler(md.render(text)).trim());
}