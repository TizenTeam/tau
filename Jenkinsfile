pipeline {
    agent any
    parameters {
        string(name: 'GERRIT_CHANGE_URL', defaultValue: 'refs/changes/xx/xxxxxx/x', description: 'URL from Gerrit')
    }

    stages {
        stage('Quality Control') {
            agent {
                label 'node'
            }
            steps {
                echo 'Building..'
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "npm install grunt-contrib-copy"
                    sh "node_modules/grunt-cli/bin/grunt ci -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults: 'report/**/*.xml'])
                }
            }
        }
        stage('UI Tests') {
            agent {
                label 'mobile-tests'
            }
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
                echo 'Testing..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt ui-tests-junit -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults: 'report/**/*.xml'])
                }
                stash includes: 'tau/tests/UI-tests/diff/**', name: 'test-diff-ui'
                stash includes: 'tau/tests/UI-tests/result/**', name: 'test-result-ui'
            }
        }
        stage('Karma Tests') {
            agent {
                label 'mobile-tests'
            }
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
                echo 'Testing..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt karma -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults: 'report/**/*.xml'])
                }
                stash includes: 'tau/report/**', name: 'test-result-karma'
            }
        }
        stage('Tests') {
            agent {
                label 'node'
            }
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
                echo 'Testing..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt test -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults: 'report/**/*.xml'])
                }
                stash includes: 'tau/report/**', name: 'test-result'
            }
        }
        stage('Clover') {
            agent {
                label 'node'
            }
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
                unstash 'test-result'
                unstash 'test-result-karma'
                echo 'Collecting clover..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt build -f"
                    sh "node tools/cmd/clover.js"
                    step([$class: 'CloverPublisher', cloverReportDir: 'report/test/all/coverage/clover', cloverReportFileName: 'clover.xml'])
                }
                stash includes: 'tau/dist/**', name: 'dist'
            }
        }
        stage('SonarQube analysis') {
            agent {
                label 'node'
            }
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
                unstash 'test-result-karma'
                sh "node tau/tools/cmd/prepare-sonar.js ${GERRIT_CHANGE_URL}"
                // requires SonarQube Scanner 2.8+
                withSonarQubeEnv('Main') {
                  sh "/home/m.urbanski/sonar-scanner-2.8/bin/sonar-scanner"
                }
            }
        }
        stage('Docs') {
            agent {
                label 'node'
            }
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
                echo 'Generating docs..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt docs -f"
                    sh "mkdir -p docs/sdk"
                }
                stash includes: 'tau/docs/sdk/**', name: 'docs'
            }
        }
        stage('Artifacts') {
            agent {
                label 'mobile-tests'
            }
            steps {
                echo 'Getting artifacts....'
                unstash 'test-result'
                unstash 'test-result-karma'
                unstash 'test-result-ui'
                unstash 'test-diff-ui'
                unstash 'docs'
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
                    sh "cp -a docs/sdk artifacts/"
                    sh "cp -a report artifacts/"
                    sh "cp -a tests/UI-tests/diff artifacts/"
                    sh "cp -a tests/UI-tests/result artifacts/"
                    sh "mv artifacts /usr/share/nginx/html/${BUILD_TAG}"
                }
            }
        }
    }
    post {
        success {
            echo 'Sending status to JIRA failure...'

            sh "env"
            script {
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    echo 'This is gerrit'
                    git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                    sh "git fetch origin ${GERRIT_CHANGE_URL}"
                    sh "git checkout FETCH_HEAD"
                }
                def commit = sh(returnStdout: true, script: "git log -1 --pretty=%B")
                echo "${commit}"
                def jiraIDArray = ( "${commit}" =~ /\[(OAPTAU-[0-9]+)\]/)
                def JIRAID = ""
                if (jiraIDArray) {
                    JIRAID = jiraIDArray[0][1]
                }
                echo "JIRAID: ${JIRAID}"
                def HOSTNAME = JENKINS_URL.replaceAll(~/:8000\//, "")
                def BUILD_URL = BUILD_TAG.replaceAll(~/%/, "%25");
                def JIRAMESSAGE = "WWW: ${HOSTNAME}:8080/${BUILD_URL}/ "
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def GERRITIDPARTS = ("${GERRIT_CHANGE_URL}" =~ /refs\/changes\/[0-9]+\/([0-9]+)\/[0-9]+/)
                    def GERRITID = GERRITIDPARTS[0][1]
                    echo "${GERRITID}"
                    def GERRITURL = "http://165.213.149.170/gerrit/#/c/${GERRITID}/"
                    JIRAMESSAGE += "${GERRITURL}"
                }
                def CAM = ""
                if ("${JIRAID}" != "") {
                    CAM = "CAM: https://cam.sprc.samsung.pl/browse/${JIRAID}"
                }
                echo "JIRAMESSAGE: ${JIRAMESSAGE}"
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def message = "Running ${env.BUILD_ID} on ${env.RUN_DISPLAY_URL} ${CAM}"
                    echo "ssh -p 29418 m.urbanski@165.213.149.170 gerrit review --verified +1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    try {
                        sh "ssh -p 29418 m.urbanski@165.213.149.170 gerrit review --verified +1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    }
                    catch (e) {
                        echo "${e}"
                    }
                }
                try {
                    jiraAddComment comment: "Build success ${JIRAMESSAGE}", idOrKey: "${JIRAID}", site: 'SRPOL'
                    def transitionInput =
                        [
                            "update": [
                                "comment": [
                                    [
                                        "add": [
                                            "body": "Bug has been fixed."
                                        ]
                                    ]
                                ]
                            ],
                            "transition": [
                                "id": "5",
                                "fields": [
                                    "assignee": [
                                        "name": "unassigned"
                                    ],
                                    "resolution": [
                                        "name": "Fixed"
                                    ]
                                ]
                            ]
                        ]

                        jiraTransitionIssue idOrKey: "${JIRAID}", input: transitionInput
                }
                catch (e) {
                    echo "${e}"
                }
            }
        }
        failure {
            echo 'Sending status to JIRA failure...'

            sh "env"
            script {
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    echo 'This is gerrit'
                    git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                    sh "git fetch origin ${GERRIT_CHANGE_URL}"
                    sh "git checkout FETCH_HEAD"
                }
                def commit = sh(returnStdout: true, script: "git log -1 --pretty=%B")
                echo "${commit}"
                def jiraIDArray = ( "${commit}" =~ /\[(OAPTAU-[0-9]+)\]/)
                def JIRAID = ""
                if (jiraIDArray) {
                    JIRAID = jiraIDArray[0][1]
                }
                echo "JIRAID: ${JIRAID}"
                def HOSTNAME = JENKINS_URL.replaceAll(~/:8000\//, "")
                def BUILD_URL = BUILD_TAG.replaceAll(~/%/, "%25");
                def JIRAMESSAGE = "WWW: ${HOSTNAME}:8080/${BUILD_URL}/ "
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def GERRITIDPARTS = ("${GERRIT_CHANGE_URL}" =~ /refs\/changes\/[0-9]+\/([0-9]+)\/[0-9]+/)
                    def GERRITID = GERRITIDPARTS[0][1]
                    echo "${GERRITID}"
                    def GERRITURL = "http://165.213.149.170/gerrit/#/c/${GERRITID}/"
                    JIRAMESSAGE += "${GERRITURL}"
                }
                def CAM = ""
                if ("${JIRAID}" != "") {
                    CAM = "CAM: https://cam.sprc.samsung.pl/browse/${JIRAID}"
                }
                echo "JIRAMESSAGE: ${JIRAMESSAGE}"
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def message = "Running ${env.BUILD_ID} on ${env.RUN_DISPLAY_URL} ${CAM}"
                    echo "ssh -p 29418 m.urbanski@165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    try {
                        sh "ssh -p 29418 m.urbanski@165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    }
                    catch (e) {
                        echo "${e}"
                    }
                }
                try {
                    jiraAddComment comment: "Build failure ${JIRAMESSAGE}", idOrKey: "${JIRAID}", site: 'SRPOL'
                }
                catch (e) {
                    echo "${e}"
                }
            }
        }
        unstable {
            echo 'Sending status to JIRA unstable...'

            sh "env"
            script {
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    echo 'This is gerrit'
                    git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                    sh "git fetch origin ${GERRIT_CHANGE_URL}"
                    sh "git checkout FETCH_HEAD"
                }
                def commit = sh(returnStdout: true, script: "git log -1 --pretty=%B")
                echo "${commit}"
                def jiraIDArray = ( "${commit}" =~ /\[(OAPTAU-[0-9]+)\]/)
                def JIRAID = ""
                if (jiraIDArray) {
                    JIRAID = jiraIDArray[0][1]
                }
                echo "JIRAID: ${JIRAID}"
                def HOSTNAME = JENKINS_URL.replaceAll(~/:8000\//, "")
                def BUILD_URL = BUILD_TAG.replaceAll(~/%/, "%25");
                def JIRAMESSAGE = "WWW: ${HOSTNAME}:8080/${BUILD_URL}/ "
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def GERRITIDPARTS = ("${GERRIT_CHANGE_URL}" =~ /refs\/changes\/[0-9]+\/([0-9]+)\/[0-9]+/)
                    def GERRITID = GERRITIDPARTS[0][1]
                    echo "${GERRITID}"
                    def GERRITURL = "http://165.213.149.170/gerrit/#/c/${GERRITID}/"
                    JIRAMESSAGE += "${GERRITURL}"
                }
                def CAM = ""
                if ("${JIRAID}" != "") {
                    CAM = "CAM: https://cam.sprc.samsung.pl/browse/${JIRAID}"
                }
                echo "JIRAMESSAGE: ${JIRAMESSAGE}"
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def message = "Running ${env.BUILD_ID} on ${env.RUN_DISPLAY_URL} ${CAM}"
                    echo "ssh -p 29418 m.urbanski@165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    try {
                        sh "ssh -p 29418 m.urbanski@165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    }
                    catch (e) {
                        echo "${e}"
                    }
                }
                try {
                    jiraAddComment comment: "Build success (unstable) ${JIRAMESSAGE}", idOrKey: "${JIRAID}", site: 'SRPOL'
                }
                catch (e) {
                    echo "${e}"
                }
            }
        }
    }
}
