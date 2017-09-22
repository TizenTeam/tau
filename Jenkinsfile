pipeline {
    agent any

    stages {
        stage('UI & Karma Tests') {
            agent {
                label 'mobile-tests'
            }
            steps {
                echo 'Testing..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt ui-tests-junit -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
                        'report/**/*.xml'])
                }
                archive 'tau/tests/UI-tests/diff/**'
                archive 'tau/tests/UI-tests/result/**'
                echo 'Karma testing..'
                dir ('tau') {
                    sh "node_modules/grunt-cli/bin/grunt karma -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
                        'report/**/*.xml'])
                }
                stash includes: 'tau/report/**', name: 'test-result-karma'
            }
        }
        stage('Eslint & Tests & Cover & SonarQube & docs') {
            agent {
                label 'node'
            }
            steps {
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt ci -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
                        'report/**/*.xml'])
                    sh "node_modules/grunt-cli/bin/grunt test -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults:
                        'report/**/*.xml'])
                }
                stash includes: 'tau/report/**', name: 'test-result'
                unstash 'test-result-karma'
                echo 'Collecting clover..'
                dir ('tau') {
                    sh "node_modules/grunt-cli/bin/grunt build -f"
                    sh "node tools/cmd/clover.js"
                    step([$class: 'CloverPublisher', cloverReportDir:
                        'report/test/all/coverage/clover', cloverReportFileName: 'clover.xml'])
                }
                archive 'tau/dist/**'
                stash includes: 'tau/dist/**', name: 'dist'
                sh "node tau/tools/cmd/prepare-sonar.js ${GERRIT_CHANGE_URL}"
                // requires SonarQube Scanner 2.8+
                withSonarQubeEnv('Main') {
                  sh "/home/m.urbanski/sonar-scanner-2.8/bin/sonar-scanner"
                }
                echo 'Generating docs..'
                dir ('tau') {
                    sh "node_modules/grunt-cli/bin/grunt docs -f"
                    sh "mkdir -p docs/sdk"
                }
                archive 'tau/docs/sdk/**'
            }
        }
        stage('Artifacts') {
            agent {
                label 'node'
            }
            steps {
                echo 'Getting artifacts....'
                unstash 'dist'
                dir ('tau') {
                    sh "rm -rf artifacts"
                    sh "mkdir -p artifacts/dist/mobile"
                    sh "mkdir -p artifacts/demos/SDK/mobile"
                    sh "cp -a demos/SDK/mobile/* artifacts/demos/SDK/mobile/"
                    sh "cp -a dist/mobile/* artifacts/dist/mobile/"
                    sh "cp -a dist/mobile/theme/changeable artifacts/dist/mobile/theme/default"
                    sh "mkdir -p artifacts/dist/wearable"
                    sh "mkdir -p artifacts/demos/SDK/wearable"
                    sh "cp -a demos/SDK/wearable/* artifacts/demos/SDK/wearable/"
                    sh "cp -a dist/wearable/* artifacts/dist/wearable/"
                    sh "cp -a dist/wearable/theme/changeable artifacts/dist/wearable/theme/default"
                    archive 'artifacts/**'
                }
            }
        }
    }
}