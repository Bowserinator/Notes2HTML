TITLE test
CATEGORY misc
SUB Markdown test
NUMBER 0

This is a test file to test the limits of the markdown and custom syntax

Custom Syntax
===
[COLOR #f0f4cb]
Light colored text block (Should be readable)
[/COLOR]

[COLOR #1f2112]
Dark colored text block (Should be readable)
[/COLOR]

[DEF]
Colored definition block
[/DEF]

[FACT]
Colored fact block
[/FACT]

A random question?

[A]
A hidden answer.
[/A]

KaTeX rendering

$$\\frac{x^2 + 1}{y + a_1}$$

ASCII Math:

%%x = (-b+-sqrt(b^2-4ac))/(2a)%%

Iframe

[INTERACTIVE https://www.youtube.com/embed/owsfdh4gxyc 300 200]

Markdown Syntax
===

## Basic Formatting

**bold** _italic_ \`monospace\` 
> blockquote
[Link to github][https://github.com]

* A bullet point
* Another bullet point

1. Numbered list
2. Another element

Horz rule:

---

2~alpha~ subscript 2^beta^ superscript

\`\`\`
code block goes here
look another line
\`\`\`

Image example from github

![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")


## Footnotes

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

## Def Lists
Term 1
:   Definition 1

Term 2 with *inline markup*
:   Definition 2
        { some code, part of Definition 2 }
    Third paragraph of definition 2.

## Abbreviations
*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
The HTML specification
is maintained by the W3C.

## Tables

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |