FROM jenkins/jenkins:lts

ENV JENKINS_USER=admin
ENV JENKINS_PASS=swastikm12
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

COPY security.groovy /usr/share/jenkins/ref/init.groovy.d/security.groovy
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt

# Install plugins using Jenkins Plugin CLI
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

