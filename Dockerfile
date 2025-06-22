FROM jenkins/jenkins:lts

ENV JENKINS_USER=admin
ENV JENKINS_PASS=admin

# Skip setup wizard
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

# Create default admin user via init script
COPY security.groovy /usr/share/jenkins/ref/init.groovy.d/security.groovy

