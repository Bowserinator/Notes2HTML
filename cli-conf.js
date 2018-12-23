'use strict';

module.exports = {
    optionDefinitions : [
        { name: 'input', alias: 'i', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'rename', alias: 'r', type: Boolean },
        { name: 'noserver', alias: 's', type: Boolean },
        { name: 'help', alias: 'h', type: Boolean },
        { name: 'port', alias: 'p', type: Number }
    ],
    sections : [
        {
            header: 'Notes2HTML',
            content: 'Generates notes from markdown files, and compiles into a website.'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'input',
                    alias: 'i',
                    typeLabel: '{underline directory}',
                    description: 'Path to the input (md notes) folder'
                },
                {
                    name: 'output',
                    alias: 'o',
                    typeLabel: '{underline directory}',
                    description: 'Path to the output folder. If it doesn\'t exist it will be created.'
                },
                {
                    name: 'port',
                    alias: 'p',
                    typeLabel: '{underline port}',
                    description: '(Default: 8080) Port to run the python server on (localhost)'
                },
                {
                    name: 'rename',
                    alias: 'r',
                    description: '(Default: true) Automatically rename duplicate file paths',
                },
                {
                    name: 'noserver',
                    alias: 's',
                    description: '(Default: false) Don\'t run the python server when compiling'
                },
                {
                    name: 'help',
                    alias: 'h',
                    description: 'List all commands.'
                }
            ]
        }
    ]
};