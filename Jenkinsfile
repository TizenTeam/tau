pipeline {
    agent any
    parameters {
        string(name: 'GERRIT_CHANGE_URL', defaultValue: 'refs/changes/xx/xxxxxx/x', description: 'URL from Gerrit')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                        echo 'This is gerrit'
                        git branch: 'devel/tizen_3.0', credentialsId: '0d0e7561-6f63-434a-9ca0-762d2d7aa4db', url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

                        sh "git fetch origin ${GERRIT_CHANGE_URL}"
                        sh "git checkout FETCH_HEAD"
                    }
                }
            }
        }
        stage('Quality Control') {
            steps {
                echo 'Building..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "npm install grunt-contrib-copy"
                    sh "node_modules/grunt-cli/bin/grunt ci -f"
                    step([$class: 'JUnitResultArchiver', allowEmptyResults: true, testResults: 'report/**/*.xml'])
                }
            }
        }
        stage('Tests') {
            steps {
                echo 'Testing..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt test -f"
                    junit 'report/**/*.xml'
                }
            }
        }
        stage('Clover') {
            steps {
                echo 'Collecting clover..'
                dir ('tau') {
                    sh "node tools/cmd/clover.js"
                    step([$class: 'CloverPublisher', cloverReportDir: 'report/test/all/coverage/clover', cloverReportFileName: 'clover.xml'])
                }
            }
        }
        stage('Docs') {
            steps {
                echo 'Generating docs..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt docs -f"
                    sh "mkdir -p docs/sdk"
                }
            }
        }
        stage('Artifacts') {
            steps {
                echo 'Getting artifacts....'
                dir ('tau') {
                    sh "node_modules/grunt-cli/bin/grunt build -f"
                    sh "rm -rf artifacts"
                    sh "mkdir -p artifacts/dist/mobile"
                    sh "mkdir -p artifacts/demos/SDK/mobile"
                    sh "cp -a demos/SDK/mobile/* artifacts/demos/SDK/mobile/"
                    sh "cp -a dist/mobile/* artifacts/dist/mobile/"
                    sh "cp -a dist/mobile/theme/changeable artifacts/dist/mobile/theme/default"
                    sh "mkdir -p artifacts/dist/wearable"
                    sh "mkdir -p artifacts/demos/SDK/wearable"
                    sh "cp -a demos/SDK/mobile/* artifacts/demos/SDK/wearable/"
                    sh "cp -a dist/wearable/* artifacts/dist/wearable/"
                    sh "cp -a dist/wearable/theme/changeable artifacts/dist/wearable/theme/default"
                    sh "cp -a docs/sdk artifacts/"
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
                def commit = sh(returnStdout: true, script: "git log -1 --pretty=%B")
                echo "${commit}"
                def jiraIDArray = ( "${commit}" =~ /\[(OAPTAU-[0-9]+)\]/)
                def JIRAID = ""
                if (jiraIDArray) {
                    JIRAID = jiraIDArray[0][1]
                }
                echo "JIRAID: ${JIRAID}"
                def BUILD_URL = BUILD_TAG.replaceAll(~/%/, "%25");
                def JIRAMESSAGE = "WWW: http://${HOSTNAME}:8080/${BUILD_URL}/ "
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
                    echo "ssh -p 29418 165.213.149.170 gerrit review --verified +1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    try {
                        sh "ssh -p 29418 165.213.149.170 gerrit review --verified +1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    }
                    catch (e) {
                        echo "${e}"
                    }
                }
                try {
                    jiraAddComment comment: "Build success ${JIRAMESSAGE}", idOrKey: "${JIRAID}", site: 'SRPOL'
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
                def commit = sh(returnStdout: true, script: "git log -1 --pretty=%B")
                echo "${commit}"
                def jiraIDArray = ( "${commit}" =~ /\[(OAPTAU-[0-9]+)\]/)
                def JIRAID = ""
                if (jiraIDArray) {
                    JIRAID = jiraIDArray[0][1]
                }
                echo "JIRAID: ${JIRAID}"
                def BUILD_URL = BUILD_TAG.replaceAll(~/%/, "%25");
                def JIRAMESSAGE = "WWW: http://${HOSTNAME}:8080/${BUILD_URL}/ "
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
                    echo "ssh -p 29418 165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    try {
                        sh "ssh -p 29418 165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
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
                def commit = sh(returnStdout: true, script: "git log -1 --pretty=%B")
                echo "${commit}"
                def jiraIDArray = ( "${commit}" =~ /\[(OAPTAU-[0-9]+)\]/)
                def JIRAID = ""
                if (jiraIDArray) {
                    JIRAID = jiraIDArray[0][1]
                }
                echo "JIRAID: ${JIRAID}"
                def BUILD_URL = BUILD_TAG.replaceAll(~/%/, "%25");
                def JIRAMESSAGE = "WWW: http://${HOSTNAME}:8080/${BUILD_URL}/ "
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
                    echo "ssh -p 29418 165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
                    try {
                        sh "ssh -p 29418 165.213.149.170 gerrit review --verified -1 -m '\"${message}\"' \$(git rev-list --max-count=1 HEAD)"
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