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
                    '_temp/data/pages/home.json',
                    '_temp/data/pages/home.json',
                    '_temp/data/pages/home.json'
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
                    '_temp/data/pages/people.json',
                    '_temp/data/pages/people.json',
                    '_temp/data/pages/people.json'
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
                    '_temp/data/pages/scores.json',
                    '_temp/data/pages/scores.json',
                    '_temp/data/pages/scores.json'
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
                space: 4
            },
            deathpool: {
                files: { 
                    '_temp/data/all-people.json': ['data/people/*.json']
                }
            },
            computed: {
                files: { 
                    '_temp/data/computed.json': ['_temp/data/computed/*.json'],
                    '_temp/data/pages/scores.json': ['data/pages/scores.json', '_temp/data/computed.json'],
                    '_temp/data/pages/people.json': ['data/pages/people.json', '_temp/data/computed.json'],
                    '_temp/data/pages/home.json': ['data/pages/home.json', '_temp/data/computed.json']
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

        //////////////////////////////////////////////////////////////
        // People.
        var people = grunt.file.readJSON('_temp/data/all-people.json')
        var today = Date.now();
        dead_people = {}
        for (var key in people) {
            var person = people[key];
            var dob = new Date(person.dob).getTime();
            var alive_date = today;
            person.alive = true;
            person.star = false;
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

        //////////////////////////////////////////////////////////////
        // Teams.
        var team_file = grunt.file.readJSON('data/teams.json');
        var teams = team_file.teams;
        for (var key in teams) {
            var player = teams[key];
            player.points = 0;
            player.deaths = 0;
            player.total_age = 0;
            for (var person_index in player.people) {
                var person_key = player.people[person_index];
                var person = people[person_key];
                if (player.star == person_key) {
                    person.star = true;
                }
                if (person.alive === false) {
                    player.points += 1;
                    player.deaths += 1;
                    if (person.star) {
                        player.points += 2;
                    }
                    player.total_age += person.age;
                }
            }
        }

        //////////////////////////////////////////////////////////////
        // Do scoring

        function score_compare(a,b) {
          // Sort to have best person in index 0.

          // Sort by points.
          if (a.points > b.points) {
            return -1;
          }
          if (a.points < b.points) {
            return 1;
          }

          // Sort by total age.
          if (a.total_age < b.total_age) {
            return -1;
          }
          if (a.total_age > b.total_age) {
            return 1;
          }

          // Alphabetical
          if (a.name < b.name) {
              return -1;
          }
          if ( a.name > b.name ) {
              return 1;
          }

          // Totall equal.
          return 0;
        }
        var scores = []

        for (var key in teams) {
            var player = teams[key];
            var new_player = player;
            new_player.name = key;
            scores.push(new_player);
        }
        scores.sort(score_compare);
        names_by_score = []
        for (var index in scores) {
            var player = scores[index];
            names_by_score.push(player.name);
        }
        var titles = [
            "1st",
            "2nd",
            "3rd",
            "4th",
            "5th",
            "6th",
            "7th",
            "8th",
            "9th",
            "10th",
        ]
        var scores_and_titles = names_by_score.map(function(e, i) {
          return { 
              "name" : e, 
              "title" : titles[i]
          };
        });

        var scores_obj = {};
        scores_obj.scores = {};
        scores_obj.scores.all = scores_and_titles;
        scores_obj.scores.top_3 = scores_and_titles.slice(0, 3);
        scores_obj.scores.the_rest = scores_and_titles.slice(3);

        var people_obj = {};
        people_obj.people = people;

        // Write out all the computations.
        grunt.file.write('_temp/data/computed/people.json', JSON.stringify(people_obj, null, 4));//serialize it back to file
        grunt.file.write('_temp/data/computed/teams.json', JSON.stringify(team_file, null, 4));//serialize it back to file
        grunt.file.write('_temp/data/computed/score.json', JSON.stringify(scores_obj, null, 4));//serialize it back to file
    });

    // Default task: does everything except deployment
    grunt.registerTask('default', ['json_merge:deathpool', 'custom-build', 'json_merge:computed', 'compile-handlebars', 'concat', 'copy' ]);
    // Deploy task: runs everything in order.
    grunt.registerTask('deploy', ['default', 'gh-pages']);
};
