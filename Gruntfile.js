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
                        cwd: '_temp/build/',
                        src: ['**/*'],
                        dest: '_build/',
                        expand: true, 
                    }
                ]
            }
        },
        'compile-handlebars': {
            programmer_talk: {
                template: [
                    'src/child_page/template.handlebars',
                    'src/remark/header.handlebars',
                ],
                templateData: [
                    'src/beginner_guides/programmer_talk/meta.json',
                    'src/beginner_guides/programmer_talk/meta.json',
                ],
                output: [
                    'build/beginner_guides/programmer_talk/index.html',
                    'temp/beginner_guides/programmer_talk/presentation/index.html',
                ]
            }
        },
        concat: {
            main: {
                files: {
                    // programmer_talk
                    'build/beginner_guides/programmer_talk/presentation/index.html' : [
                        'temp/beginner_guides/programmer_talk/presentation/index.html',
                        'src/beginner_guides/programmer_talk/README.md',
                        'src/remark/footer.html' ]
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
    grunt.registerTask('default', ['copy', ]); //'compile-handlebars', 'concat' ]);
    // Deploy task: runs everything in order.
    grunt.registerTask('deploy', ['default', 'gh-pages']);
};
