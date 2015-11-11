module.exports = function (grunt) {
  'use strict';
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);


  grunt.initConfig({

    watch: {
      sass: {
        files: "src/scss/**/*.scss",
        tasks: ['sass:dev', 'postcss']
      },
      jade: {
        files: "src/jade/**/*.jade",
        tasks: ['jade:dev']
      },
      js: {
        files: 'src/js/dev/index.js',
        tasks: ['concat']
      },
      svg: {
        files: 'src/img/svg/*.svg',
        tasks: ['newer:svgmin', 'svgstore']
      }
    },

    sass: {
      dev: {
        options: {
          includePaths: [
            'node_modules/susy/sass',
            'node_modules/breakpoint-sass/stylesheets',
            'src/scss',
            'src/scss/utils',
            'src/scss/base',
            'src/scss/layout',
            'src/scss/module'
          ],
          outputStyle: 'expanded',
          sourceMap: true
        },
        files: {
          "src/css/style.css": "src/scss/index.scss"
        }
      }
    },

// POSTCSS

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')(
            {browsers: 'last 2 versions'}
          ),
          require('postcss-svg')(
            {
              paths: ['src/img/svgmin'],
              defaults: "[fill]: hotpink",
              ei: false
            }
          )
        ]
      },
      dist: {
        src: 'src/css/style.css'
      }
    },

    jade: {
      dev: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'src/jade/',
          src: '*.jade',
          dest: 'src/',
          ext: '.html'
        }]
      }
    },

    concat: {
      dev: {
        options: {
          separator: ';\n'
        },
        src: [
          'src/js/dev/*.js'
        ],
        dest: 'src/js/main.js'
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src : [
            'src/css/*.css',
            'src/*.html',
            'src/js/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: 'src',
          port: 3008,
          browser: 'chromium-browser',
          ui: false,
          notify: false,
          injectChanges: true
        }
      }
    },

//SVG

    svgmin: {
      options: {
        plugins: [
          {removeViewBox: false},
          {removeUselessStrokeAndFill: true},
          {removeMetadata: true},
          {removeTitle: true}
        ]
      },
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/img/svg/',
            src: ['*.svg'],
            dest: 'src/img/svgmin/',
            ext: '.min.svg'
          }
        ]
      }
    },

    svgstore: {
      options: {
        //cleanup: ['fill', 'stroke'],
        inheritviewbox: true,
        includeTitleElement: false,
        prefix: 'icon-',
        svg: {
          //xmlns: 'http://www.w3.org/2000/svg',
          style: '' +
          'position: absolute; ' +
          'width: 0; ' +
          'height: 0; ' +
          'visibility: hidden;'
        }
      },
      dev: {
        files: {
          'src/jade/inc/svgsprite.jade': ['src/img/svgmin/*.min.svg']
        }
      }
    },

//CSSCOMB

    csscomb: {
      dev: {
        options: {
          config: '.csscomb.json'
        },
        files: [{
          expand: true,
          cwd: 'src/scss',
          src: ['**/*.scss',
                '!**/_utils.scss',
                '!**/_vars.scss',
                '!**/_module.scss'
               ],
          dest: 'src/scss/',
          ext: '.scss'
        }]
      }
    },

//BUILD TASKS

    clean: {
      build: {
        src: ["build"]
      },
      svg: {
        src: ["src/img/svgmin"]
      }
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: [
              '**',
              '!**/js/dev/**',
              '!**/scss/**',
              '!**/jade/**',
              '!**/svg*/**'
            ],
            dest: 'build/'
          }
        ]
      }
    },

    cssmin: {
      build: {
        files: {
          'build/css/style.css': ['build/css/style.css']
        }
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'build/index.html': 'build/index.html'
        }
      }
    },

    uglify: {
      build: {
        files: {'build/js/main.js': 'build/js/main.js'}
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'build/img/'
        }]
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        duration: 10
      }
    },

//PUBLISH ON GITHUB PAGES

    'gh-pages': {
      options: {
        base: 'build'
      },
      src: ['**']
    }
  });


  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('comb', [
    'newer:csscomb:dev'
  ]);
  
  grunt.registerTask('svg', [
    'clean:svg',
    'svgmin',
    'svgstore'
  ]);
  
  grunt.registerTask('build', [
    'clean:build',
    'copy',
    'cssmin',
    'htmlmin',
    'uglify',
    'imagemin'
  ]);
  
  grunt.registerTask('default', [
    'browserSync:dev',
    'watch'
  ]);
};
