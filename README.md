# Notes2HTML
By Bowserinator, inspired by BWBellairs

A compiler to compile markdown files (With a bit of additional custom syntax) into a website. You can sort all your notes into different categories and subcategories, and the website will automatically generate the structure for you.

## Getting Started
```
git clone https://github.com/hellomouse/Notes2HTML
cd Notes2HTML
npm install
```

In addition, you'll also need Python 3    _(To run the command `python -m http.server PORT`)_ if you want the localhost server to work.

Create a new folder somewhere and work on your notes (See wiki for file structure and how to format), and when you're done run the following command:

```
node index.js -i [Path to your notes folder] -o [Path to output folder]
```
The output folder will be created if it doesn't exist, and you can use relative paths. This output folder will be the root directory of your website. For more on customizing the output, see the wiki. By default, only `.note` and `.md` files are
converted to HTML.

**WARNING:** Everything in the output directory will be DELETED when the program is run. Make sure you typed your path correctly!!

Here are the follow flags you can use for the program
```
Notes2HTML
  Generates notes from markdown files, and compiles into a website.

Options
  -i, --input directory    Path to the input (md notes) folder
  -o, --output directory   Path to the output folder. If it doesn't exist it will be created.
  -p, --port port          (Default: 8080) Port to run the python server on (localhost)
  -r, --rename             (Default: true) Automatically rename duplicate file paths
  -s, --noserver           (Default: false) Don't run the python server when compiling
  -h, --help               List all commands.
```



## Additional web config
In `src/config.js` you can find more options to configure:
```
definitionColor: '#d9e6fc'   Color for a definition block
factColor: '#fff7e0'         Color for a fact block
cssPath: '/css'              Folder for css (Modify the /web folder if changed)
jsPath: '/js'                Folder for js (Modify the /web folder if changed)
footerText: 'Your footnote text goes here'
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
}
fileExt: ['note', 'md']     File extensions to "convert", all others copied
```

To modify any CSS or JS in the code, see the `/web` folder. See the wiki for more ways to customize your output.

## Built With

* [KaTeX](https://katex.org/docs/api.html) - LaTeX rendering
* [MathJax](https://www.mathjax.org/) - ASCII math rendering
* [markdown-it](https://www.npmjs.com/package/markdown-it) - Markdown rendering
* [TinyColor](https://github.com/bgrins/TinyColor) - Color API


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details