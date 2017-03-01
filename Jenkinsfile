pipeline {
    agent any
    parameters {
        string(name: 'GERRIT_CHANGE_URL', defaultValue: 'xx/xxxxxx/x', description: 'URL from Gerrit')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    if ("${GERRIT_CHANGE_URL}" != '') {
                        echo 'This is gerrit'
                        git url: 'ssh://m.urbanski@165.213.149.170:29418/framework/web/web-ui-fw'

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
                    sh "mkdir -p artifacts/dist/wearable"
                    sh "mkdir -p artifacts/demos/SDK/wearable"
                    sh "cp -a demos/SDK/mobile/* artifacts/demos/SDK/wearable/"
                    sh "cp -a dist/mobile/* artifacts/dist/wearable/"
                    publishHTML(target: [allowMissing: true, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'report', reportFiles: 'index.html', reportName: 'HTML Report'])
                    archiveArtifacts artifacts: 'artifacts/**', fingerprint: true

                }
            }
        }
    }
    post {
        always {
            steps {
                echo 'Sending status to JIRA...'

                sh "env"
                script {
                    def jiraIDArray = (sh(returnStdout: true, script: "git log -1 --pretty=%B") =~ /\[(OAPTAU-[0-9]+)\]/)
                    def JIRAID = jiraIDArray[0][1]
                    def transitions = jiraGetIssueTransitions idOrKey: "${JIRAID}", site: "SRPOL"

                    def transitionInput =
                        [
                            "update": [
                                "comment": [
                                    [
                                        "add": [
                                            "body": "Build was done."
                                        ]
                                    ]
                                ]
                            ],
                            "transition": [
                                "id": "5",
                                "fields": [
                                    "resolution": [
                                        "name": "Fixed"
                                    ],
                                    "status": [
                                        "name": "REOPENED"
                                    ]
                                ]
                            ]
                        ]

                    jiraTransitionIssue idOrKey: JIRAID, input: transitionInput, site: "SRPOL"
                }
            }
        }
    }
}