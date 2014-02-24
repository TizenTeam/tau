/*global module, grunt, require, process */

module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.file.readXML = function (filepath) {
        require('require-xml');
        return JSON.parse(require(filepath));
    };

    function getWidgetConfig() {
        var path = require('path'),
            file = path.resolve('./config.xml');
        if (!grunt.file.isFile(file)) {
            return {};
        }

        return grunt.file.readXML(file).widget;
    }

    var env = {
            sdkPath: grunt.option('tizen_sdk') || null,
            signProfile: grunt.option('sign_profile') || 'develop'
        },
        path = require('path'),
        systemPath = process.env.PATH.split(path.delimiter),
        fileExists = grunt.file.exists;

    if (env.sdkPath === null) {
        systemPath.forEach(function (directory) {
            var file = path.join(directory, 'sdb');
            if (env.sdkPath === null && fileExists(file)) {
                directory = directory.replace(/\\/g, '/').split('/');
                directory.pop();
                env.sdkPath = directory;
            }
        });
    }
    if (env.sdkPath === null) {
        grunt.fatal("ERROR: Path to Tizen SDK not found. Please use --tizen_sdk to set it manually".red, 1);
    }

    grunt.initConfig({
        path: {
            base: '.',
            build: 'build',
            device: '/opt/usr/apps/tmp' // work path on target device - must be user writeable
        },
        shell: {
            sign: {
                options: {
                    stdout: true,
                    execOptions: {
                        cwd: '<%= path.build %>'
                    }
                },
                command: '<%= env.sdkPath %>/tools/ide/bin/web-signing -p <%= env.signProfile %> -n'
            },
            pack: {
                options: {
                    stdout: true

                },
                command: '<%= env.sdkPath %>/tools/ide/bin/web-packaging -o -n <%= widget.name %>.wgt <%= path.build %>'
            }
        },

        tizen_configuration: {
            tizenAppScriptDir: '<%= path.device %>',
            sdbCmd: '<%= env.sdkPath %>/tools/sdb'
        },
        clean: {
            build: {
                src: ['<%= path.build %>/*']
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['src/**'], dest: 'build/'},
                    {expand: true, src: ['lib/**'], dest: 'build/'},
                    {expand: true, src: ['*', '!Gruntfile.js', '!package.json'], dest: 'build/', filter: 'isFile'}
                ]
            }
        },
        tizen: {
            push: {
                action: 'push',
                localFiles: {
                    pattern: '*.wgt'
                },
                remoteDir: '<%= path.device %>'
            },
            install: {
                action: 'install',
                remoteFiles: {
                    pattern: '<%= path.device %>/<%= widget.name %>.wgt'
                }
            },
            uninstall: {
                action: 'uninstall',
                remoteFiles: {
                    pattern: '<%= path.device %>/<%= widget.name %>.wgt'
                }
            },
            start: {
                action: 'start',
                stopOnFailure: true
            },
            stop: {
                action: 'stop',
                stopOnFailure: false
            },
            debug: {
                action: 'debug',
                browserCmd: 'chromium-browser',
                localPort: 9090,
                stopOnFailure: true
            }
        }
    });

    grunt.config('env', env);
    grunt.config('widget', getWidgetConfig());

    grunt.registerTask('package', [
        'clean:build',
        'copy',
        'shell:sign',
        'shell:pack'
    ]);

    grunt.registerTask('install', [
        'package',
        'tizen_prepare',
        'tizen:push',
        'tizen:uninstall',
        'tizen:install'
    ]);

    grunt.registerTask('run', [
        'package',
        'install',
        'tizen:start'
    ]);
    grunt.registerTask('debug', [
        'package',
        'install',
        'tizen:debug'
    ]);
};
