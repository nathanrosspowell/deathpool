module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {
                        cwd: 'assets/',
                        src: ['**/*'],
                        dest: '_build/',
                        expand: true, 
                    },
                    {
                        cwd: 'assets/',
                        src: ['**/*'],
                        dest: '_temp/',
                        expand: true, 
                    },
                    {
                        cwd: '_temp/build/',
                        src: ['**/*'],
                        dest: '_build/',
                        expand: true, 
                    }
                ]
            }
        },
        'compile-handlebars': {
            home: {
                template: [
                    'templates/header.html',
                    'templates/home.html',
                    'templates/footer.html'
                ],
                templateData: [
                    'data/pages/home.json',
                    'data/pages/home.json',
                    'data/pages/home.json'
                ],
                output: [
                    '_temp/home/header.html',
                    '_temp/home/index.html',
                    '_temp/home/footer.html'
                ]
            }
        },
        concat: {
            main: {
                files: {
                    // programmer_talk
                    '_build/index.html' : [
                        '_temp/home/header.html',
                        '_temp/home/index.html',
                        '_temp/home/footer.html'
                    ]
                }
            }
        },
        'gh-pages': {
            main: {
                options: {
                    base: '_build'
                },
                src: ['**']
            }
        }
    });
    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-gh-pages');
    // Default task: does everything except deployment
    grunt.registerTask('default', ['copy', 'compile-handlebars', 'concat' ]);
    // Deploy task: runs everything in order.
    grunt.registerTask('deploy', ['default', 'gh-pages']);
};
