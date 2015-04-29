#!/bin/bash

# sudo apt-get install nodejs npm ruby
# sudo gem install sass
# sudo npm install -g grunt grunt-cli
# sudo npm install -g \
# 	grunt-contrib-jshint \
# 	grunt-contrib-concat \
# 	grunt-contrib-uglify \
# 	grunt-sass \
# 	grunt-contrib-watch



# project setup

npm init
npm install grunt
npm install \
	grunt-contrib-jshint \
	grunt-contrib-concat \
	grunt-contrib-uglify \
	grunt-sass \
	grunt-contrib-watch
grunt
