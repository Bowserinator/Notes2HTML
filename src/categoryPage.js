'use strict';

const path = require('path');
const basePath = path.normalize(__dirname);

const config = require(basePath + '/config.js');
const categoryColor = require(basePath + '/categoryColor.js');

const CATEGORY_TEMPLATE = `
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta name="description" content="[CATEGORY] Notes, formatted into a neat website using Notes2HTML">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Social meta -->
    <meta property="og:title" content="Notes about [CATEGORY]">
    <meta property="og:description" content="[CATEGORY] Notes, formatted into a neat website using Notes2HTML">
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

    <title>[CATEGORY]</title>

    <!-- Custom font -->
    <link href="https://fonts.googleapis.com/css?family=Major+Mono+Display|Raleway:400,400i,700,700i" rel="stylesheet">

    <!-- Custom JS -->
    <script src="${config.jsPath}/index.js"></script>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="${config.cssPath}/index.css">
</head>

<body>
    <div class="header" style="border-bottom: 30px solid [CATEGORY HASH]">
        <h1 class="header-title">[CATEGORY]</h1>
        <a href="/" style="text-decoration-color: white;">
            <h4 class="header-sub">Return to all notes</h4>
        </a>
    </div>
    <div style="width: 80%; margin-left: 10%; min-height: calc(100vh - 350px)">

[BODY]

    </div>

    <div class="footer">
    <br>
    ${config.footerText}
    </div>
</body>
</html>
`

/**
 * Generate a category page
 * 
 * @param {object} sortedCategories Object containing sub categories, each with array
 *                                  of File objects
 * @param {string} category         Name of category, ie 'physics'
 */
module.exports = function(sortedCategories, category) {
    let body = '';
    let categoryHash = categoryColor(category);

    for (let sub of Object.keys(sortedCategories)) {
        body += `<div class="category-box">
    <h3>${sub}</h3>
    ${sortedCategories[sub].map(x => `<h5 style="margin: 0"><a href="${x.path}">${x.title}</a></h5>`).join('<br>')}
</div>`
    }

    return CATEGORY_TEMPLATE
        .replace(new RegExp('\\[CATEGORY\\]', 'g'), category)
        .replace('[CATEGORY HASH]', categoryHash)
        .replace('[BODY]', body)
        .trim();
}