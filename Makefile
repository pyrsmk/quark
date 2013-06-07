NAME	= quark
VERSION	= grep -m 1 Version src/${NAME}.js | cut -c19-

all: lint minify

lint:
	jshint src/${NAME}.js --config config/jshint.json

minify:
	rm -f ${NAME}*
	uglifyjs src/${NAME}.js > ${NAME}-`${VERSION}`.min.js
	cat ${NAME}-`${VERSION}`.min.js src/starter.js > starter
	uglifyjs starter > ${NAME}-`${VERSION}`.starter.min.js
	rm starter

instdeps:
	npm install jshint -g
	npm install uglify-js -g
