module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        copy: {
            deathpool: {
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

        },
        concat: {
            deathpool: {
                files: {
                    // Homepage
                    '_build/index.html' : [
                        '_temp/home/header.html',
                        '_temp/home/index.html',
                        '_temp/home/footer.html'
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

                }
            }
        },
        'gh-pages': {
            deathpool: {
                options: {
                    base: '_build'
                },
                src: ['**']
            }
        },
        json_merge: {
            options: {
                replacer: null,
                space: " "
            },
            deathpool: {
                files: { 
                    '_temp/data/all-people.json': ['data/people/*.json']
                }
            }
        }
    });
    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-json-merge');
    grunt.loadNpmTasks('grunt-json-generator');

    // Custom steps
    grunt.registerTask('custom-build', 'Building the special json files.', function() {

        grunt.log.writeln('Building Json Files...');
        // load people
        var people = grunt.file.readJSON('_temp/data/all-people.json')

        var today = Date.now();
        dead_people = {}
        for (var key in people) {
            var person = people[key];
            var dob = new Date(person.dob).getTime();
            var alive_date = today;
            person.alive = true;
            if (person.dod !== "") {
                person.alive = false;
                var dod = new Date(person.dod).getTime();
                alive_date = dod;
                dead_people[key] = key; // Just make a dict of names.
            }
            var ageDifMs = alive_date - dob;
            var ageDate = new Date(ageDifMs);
            var age = Math.abs(ageDate.getUTCFullYear() - 1970);
            person.age = age;
        }

        grunt.file.write('_temp/data/all-people-stats.json', JSON.stringify(people, null, 2));//serialize it back to file

        // load teams
        // total up scores
        grunt.log.writeln('Done building Json Files.');
    });

    // Default task: does everything except deployment
    grunt.registerTask('default', ['json_merge', 'custom-build', 'compile-handlebars', 'concat', 'copy' ]);
    // Deploy task: runs everything in order.
    grunt.registerTask('deploy', ['default', 'gh-pages']);
};
