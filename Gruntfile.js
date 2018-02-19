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
                        cwd: 'meta/',
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
            },

            teams: {
                template: [
                    'templates/header.html',
                    'templates/teams.html',
                    'templates/footer.html'
                ],
                templateData: [
                    'data/pages/teams.json',
                    'data/pages/teams.json',
                    'data/pages/teams.json'
                ],
                output: [
                    '_temp/teams/header.html',
                    '_temp/teams/index.html',
                    '_temp/teams/footer.html'
                ]
            },

            people: {
                template: [
                    'templates/header.html',
                    'templates/people.html',
                    'templates/footer.html'
                ],
                templateData: [
                    'data/pages/people.json',
                    'data/pages/people.json',
                    'data/pages/people.json'
                ],
                output: [
                    '_temp/people/header.html',
                    '_temp/people/index.html',
                    '_temp/people/footer.html'
                ]
            },

            scores: {
                template: [
                    'templates/header.html',
                    'templates/scores.html',
                    'templates/footer.html'
                ],
                templateData: [
                    'data/pages/scores.json',
                    'data/pages/scores.json',
                    'data/pages/scores.json'
                ],
                output: [
                    '_temp/scores/header.html',
                    '_temp/scores/index.html',
                    '_temp/scores/footer.html'
                ]
            },

            charts: {
                template: [
                    'templates/header.html',
                    'templates/charts.html',
                    'templates/footer.html'
                ],
                templateData: [
                    'data/pages/charts.json',
                    'data/pages/charts.json',
                    'data/pages/charts.json'
                ],
                output: [
                    '_temp/charts/header.html',
                    '_temp/charts/index.html',
                    '_temp/charts/footer.html'
                ]
            },
        },
        concat: {
            main: {
                files: {
                    // Homepage
                    '_build/index.html' : [
                        '_temp/home/header.html',
                        '_temp/home/index.html',
                        '_temp/home/footer.html'
                    ],

                    // Teams
                    '_build/teams/index.html' : [
                        '_temp/teams/header.html',
                        '_temp/teams/index.html',
                        '_temp/teams/footer.html'
                    ],

                    // People
                    '_build/people/index.html' : [
                        '_temp/people/header.html',
                        '_temp/people/index.html',
                        '_temp/people/footer.html'
                    ],

                    // Scores
                    '_build/scores/index.html' : [
                        '_temp/scores/header.html',
                        '_temp/scores/index.html',
                        '_temp/scores/footer.html'
                    ],

                    // Charts
                    '_build/charts/index.html' : [
                        '_temp/charts/header.html',
                        '_temp/charts/index.html',
                        '_temp/charts/footer.html'
                    ],

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