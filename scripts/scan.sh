sonar-scanner \
	-Dsonar.projectKey=ounceofsilver_is-it-shabbat-core \
	-Dsonar.organization=ounceofsilver \
	-Dsonar.sources=./src \
	-Dsonar.host.url=https://sonarcloud.io \
	-Dsonar.login=$SONARCLOUD_ISITSHABBATCORE \
	-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
	-Dsonar.javascript.exclusions=**/lib/** \
	-Dsonar.coverage.exclusions=**/*.spec.js
