node('docker') {

  stage('Checkout') {
    if(env.GERRIT_REFSPEC && env.GERRIT_PATCHSET_REVISION) {
      println "Building from Gerrit with Refspec: $GERRIT_REFSPEC and branch $GERRIT_PATCHSET_REVISION"
      checkout([$class: 'GitSCM', branches: [[name: "$GERRIT_PATCHSET_REVISION"]], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'gerrit_id_rsa', name: "", refspec: "$GERRIT_REFSPEC", url: 'ssh://rjs@gerrit.eclipsesource.com:29418/generator-tabris-js']]])
    } else {
      git url: 'git@github.com:eclipsesource/generator-tabris-js.git', credentialsId: 'tabris-js_id_rsa'
    }
  }

  /* Requires the Docker Pipeline plugin to be installed */
  docker.image('node:12-alpine').inside {

    def scmInfo

    stage('Checkout') {
      scmInfo = checkout scm
    }

    stage('Build') {
      ansiColor('xterm') {
        sh 'npm ci'
        sh 'npm test'
      }
    }

  }

}
