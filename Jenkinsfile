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
                    junit 'report/**/*.xml'
                }
            }
        }
        stage('Tests mobile') {
            steps {
                echo 'Testing mobile..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt ci-mobile -f"
                    junit 'report/**/*.xml'
                    publishHTML(target: [allowMissing: true, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'report/test/mobile/coverage/html', reportFiles: 'index.html', reportName: 'HTML Report'])
                    step([$class: 'CloverPublisher', cloverReportDir: 'report/test/mobile/coverage/clover', cloverReportFileName: 'clover.xml'])
                }
            }
        }
        stage('Tests wearable') {
            steps {
                echo 'Testing wearable..'
                dir ('tau') {
                    sh "npm install"
                    sh "npm install grunt-cli"
                    sh "node_modules/grunt-cli/bin/grunt ci-wearable -f"
                    junit 'report/**/*.xml'
                    publishHTML(target: [allowMissing: true, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'report/test/wearable/coverage/html', reportFiles: 'index.html', reportName: 'HTML Report'])
                    step([$class: 'CloverPublisher', cloverReportDir: 'report/test/wearable/coverage/clover', cloverReportFileName: 'clover.xml'])
                }
            }
        }
        stage('Artifacts') {
            steps {
                echo 'Getting artifacts....'
                dir ('tau') {
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
                    archiveArtifacts artifacts: 'artifacts/**', fingerprint: true
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
                def JIRAMESSAGE = ""
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def GERRITIDPARTS = ("${GERRIT_CHANGE_URL}" =~ /refs\/changes\/[0-9]+\/([0-9]+)\/[0-9]+/)
                    def GERRITID = GERRITIDPARTS[0][1]
                    echo "${GERRITID}"
                    def GERRITURL = "http://165.213.149.170/gerrit/#/c/${GERRITID}/"
                    JIRAMESSAGE = "${GERRITURL}"
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
                def JIRAMESSAGE = ""
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def GERRITIDPARTS = ("${GERRIT_CHANGE_URL}" =~ /refs\/changes\/[0-9]+\/([0-9]+)\/[0-9]+/)
                    def GERRITID = GERRITIDPARTS[0][1]
                    echo "${GERRITID}"
                    def GERRITURL = "http://165.213.149.170/gerrit/#/c/${GERRITID}/"
                    JIRAMESSAGE = "${GERRITURL}"
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
                def JIRAMESSAGE = ""
                if ("${GERRIT_CHANGE_URL}" != 'refs/changes/xx/xxxxxx/x') {
                    def GERRITIDPARTS = ("${GERRIT_CHANGE_URL}" =~ /refs\/changes\/[0-9]+\/([0-9]+)\/[0-9]+/)
                    def GERRITID = GERRITIDPARTS[0][1]
                    echo "${GERRITID}"
                    def GERRITURL = "http://165.213.149.170/gerrit/#/c/${GERRITID}/"
                    JIRAMESSAGE = "${GERRITURL}"
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
                    jiraAddComment comment: "Build success (unstable) ${JIRAMESSAGE}", idOrKey: "${JIRAID}", site: 'SRPOL'
                }
                catch (e) {
                    echo "${e}"
                }
            }
        }
    }
}