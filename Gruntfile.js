module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for plug-ins goes here.
            dist: {
                src: [
                    'development/js/sotawatchfilter.js',
                    'development/js/**/*.js'
                ],
                dest: 'production/js/sotawatchfilter.js'
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'development/js/**/*.js', '!development/js/libs/*.js'],
        },

        ngAnnotate: {
            options: {
                // Task-specific options go here.
            },
            sotawatchfilter: {
                // Target-specific file lists and/or options go here
                files: {
                        'production/js/sotawatchfilter.annotated.js' : ['production/js/sotawatchfilter.js'],
                },
            },
        },

        uglify: {
            build: {
                src: 'production/js/sotawatchfilter.annotated.js',
                dest: 'production/js/sotawatchfilter.min.js'
            }
        },

        htmlmin: {                                     // Task
            index: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'production/index.html': 'development/index.html',     // 'destination': 'source'
                },
            },
            templates: {
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,     // Enable dynamic expansion.
                    cwd: 'development/templates/',      // Src matches are relative to this path.
                    src: ['*.html'], // Actual pattern(s) to match.
                    dest: 'production/templates/',   // Destination path prefix.
                }],
            }
        },

        cssmin: {
            combine: {
                files: {
                    'production/css/style.min.css': ['development/css/*.css']
                }
            },
        },

        watch: {
            scripts: {
                files: ['development/js/**/*.js'],
                tasks: ['javascript'],
                options: {
                    spawn: false,
                },
            },
            style: {
                files: ['development/css/**/*.css'],
                tasks: ['css'],
                options: {
                    spawn: false,
                },
            },
            html: {
                files: ['development/**/*.html'],
                tasks: ['html'],
                options: {
                    spawn: false,
                },
            }
        }

    });

    // 3. Where we tell Grunt we plan to use the plug-ins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'jshint', 'ngAnnotate', 'uglify', 'htmlmin', 'cssmin']);
    grunt.registerTask('javascript', ['concat', 'jshint', 'ngAnnotate', 'uglify']);
    grunt.registerTask('html', ['htmlmin']);
    grunt.registerTask('css', ['cssmin']);

};






