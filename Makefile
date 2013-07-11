SHELL := /bin/bash

## Project setting
DEBUG ?= yes
PROJECT_NAME = tizen-web-ui-fw
VERSION = 0.2
VERSION_COMPAT =
PKG_VERSION = $(shell cat packaging/web-ui-fw.spec | grep Version: | sed -e "s@Version:\s*@@" )
THEME_NAME = default

PATH := $(CURDIR)/build-tools/bin:$(PATH)
NODE = $(shell which node)

JSLINT_LEVEL = 1
JSLINT = jslint --sloppy --eqeq --bitwise --forin --nomen --predef jQuery --color --plusplus --browser --jqmspace --regexp --continue
COMMON_WIDGET = common
INLINE_PROTO = 1
OUTPUT_ROOT = $(CURDIR)/build
FRAMEWORK_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}

LATEST_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/latest

JS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/js
JS_MODULE_OUTPUT_DIR = ${JS_OUTPUT_ROOT}/modules
export THEME_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes
CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes/${THEME_NAME}
CSS_IMAGES_OUTPUT_DIR = ${CSS_OUTPUT_ROOT}/images
WIDGET_CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/widget-css
PROTOTYPE_HTML_OUTPUT_DIR = proto-html

JS_DIR = $(CURDIR)/src/js
WIDGETS_DIR = ${JS_DIR}/widgets
THEMES_DIR = $(CURDIR)/src/themes
LIBS_DIR = $(CURDIR)/libs

COPYING_FILE = $(CURDIR)/COPYING

DESTDIR ?=

PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

FW_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}.js
FW_MIN = $(subst .js,.min.js,$(FW_JS))
FW_LIB_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-libs.js
FW_LIB_MIN = $(subst .js,.min.js,$(FW_LIB_JS))

FW_JS_THEME = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-${THEME_NAME}-theme.js
FW_CSS = ${CSS_OUTPUT_ROOT}/${PROJECT_NAME}-theme.css
FW_LIBS_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-libs.js
FW_THEME_CSS_FILE = ${PROJECT_NAME}-theme.css
FW_WIDGET_CSS_FILE = ${WIDGET_CSS_OUTPUT_ROOT}/${PROJECT_NAME}-widget.css

LIBS_JS_FILES = jquery.easing.1.3.js \
		jquery.tmpl.js \
		jquery.mobile.js \
		globalize/lib/globalize.js \
		gl-matrix.js \
		$(NULL)

JQUERY_MOBILE_CSS = submodules/jquery-mobile/compiled/jquery.mobile.structure.css \
                    submodules/jquery-mobile/compiled/jquery.mobile.css \
                    $(NULL)
JQUERY_MOBILE_IMAGES = submodules/jquery-mobile/css/themes/default/images

JQM_VERSION = jquery-mobile-1.2.0
JQM_LIB_PATH = $(CURDIR)/libs/js/${JQM_VERSION}

JQUERY = jquery-1.8.2.js
JQUERY_MIN = $(subst .js,.min.js,$(JQUERY))

all: libs_prepare src_prepare third_party js custom_module libs_cleanup src_cleanup themes version version_compat compress

libs_prepare:
	# Prepare libs/ build...
	@@test -d ${LIBS_DIR}.bak && rm -rf ${LIBS_DIR} && mv ${LIBS_DIR}.bak ${LIBS_DIR}; \
	cp -a ${LIBS_DIR} ${LIBS_DIR}.bak
	for f in `ls ${LIBS_DIR}/patch/*.patch`; do \
		cd $(CURDIR); \
		echo "Apply patch: $$f";  \
		cat $$f | patch -p1 -N; \
	done; \

src_prepare:
	# Prepare src/ build...
	@@test -d ${JS_DIR}.bak && rm -rf ${JS_DIR} && mv ${JS_DIR}.bak ${JS_DIR}; \
	cp -a ${JS_DIR} ${JS_DIR}.bak

libs_cleanup:
	# Cleanup libs/ directory...
	@@rm -rf ${LIBS_DIR} && mv ${LIBS_DIR}.bak ${LIBS_DIR}

src_cleanup:
	# Cleanup src/ directory...
	@@rm -rf ${JS_DIR} && mv ${JS_DIR}.bak ${JS_DIR}

jqm: init
	# Building jQuery Mobile...
	cd ${JQM_LIB_PATH} && make js NODE=/usr/bin/node || exit 1; \
	cp -f ${JQM_LIB_PATH}/compiled/*.js ${JQM_LIB_PATH}/../; \

full: libs_prepare
	# Building Full file...
	$(NODE) node_modules/.bin/grunt js;
	@@mv -f build/tizen-web-ui-fw/tizen-web-ui-fw.full.js ${FRAMEWORK_ROOT}/js/;

third_party: init jqm globalize
	# Building third party components...
	mkdir -p ${JS_MODULE_OUTPUT_DIR}/libs/;
	@@cd ${LIBS_DIR}/js; \
	    for f in ${LIBS_JS_FILES}; do \
	        cat $$f >> ${FW_LIB_JS}; \
	        echo "" >> ${FW_LIB_JS}; \
	        cp $$f ${JS_MODULE_OUTPUT_DIR}/libs/; \
	    done; \
	sed -i -e '/^\/\/>>excludeStart\(.*\);/,/^\/\/>>excludeEnd\(.*\);/d' ${FW_LIB_JS};
	uglifyjs --ascii ${FW_LIB_JS} > ${FW_LIB_MIN};
	cp ${LIBS_DIR}/js/${JQUERY} ${JS_OUTPUT_ROOT}/jquery.js;
	cp ${LIBS_DIR}/js/${JQUERY_MIN} ${JS_OUTPUT_ROOT}/jquery.min.js;

custom_module:
	cp -a build-tools/requirejs  ${FRAMEWORK_ROOT}/requirejs;
	mv ${FRAMEWORK_ROOT}/requirejs/build.xml  ${FRAMEWORK_ROOT}/build.xml;


js: init third_party
	# Building JS files...
	mkdir -p ${JS_MODULE_OUTPUT_DIR}; \
	find ${JS_DIR} -iname '*.js' | sort | \
	while read JSFILE; do \
		echo " # Building $$JSFILE"; \
		if test ${JSLINT_LEVEL} -ge 1; then \
			${JSLINT} $$JSFILE; \
			if test ${JSLINT_LEVEL} -ge 2 -a $$? -ne 0; then \
				exit 1; \
			fi; \
		fi; \
		if test "x${INLINE_PROTO}x" = "x1x"; then \
			echo "		$$f (include inline-proto if exists)"; \
			./tools/inline-protos.sh $$JSFILE > $$JSFILE.compiled; \
			rm -f $$JSFILE; \
			mv $$JSFILE.compiled $$JSFILE; \
		else \
			echo "		$$f"; \
		fi; \
	done;
	#${NODE} $(CURDIR)/tools/moduledep.js -c ${JS_MODULE_OUTPUT_DIR} > ${JS_MODULE_OUTPUT_DIR}/../depData.json;
	#${NODE} $(CURDIR)/tools/moduledep.js -d ${JS_MODULE_OUTPUT_DIR} ${JS_MODULE_OUTPUT_DIR}/../depData.json >> ${FW_JS};
	${NODE} $(CURDIR)/tools/moduledep.js -d $(CURDIR)/src/js/ $(CURDIR)/src/js/depData.json >> ${FW_JS};
	cp -a ${JS_DIR}/* ${JS_MODULE_OUTPUT_DIR}/;
	cp -a ${JQM_LIB_PATH}/js ${JS_MODULE_OUTPUT_DIR}/jqm;
	#${NODE} $(CURDIR)/tools/moduledep.js -c ${JS_MODULE_OUTPUT_DIR} > ${JS_MODULE_OUTPUT_DIR}/../depData.json;

globalize:
	# copy globalize libs...
	cp -a libs/js/globalize/lib/cultures ${FRAMEWORK_ROOT}/js/

themes:
	make -C src/themes || exit $?

version: js themes
	echo '(function($$){$$.tizen.frameworkData.pkgVersion="$(PKG_VERSION)";}(jQuery));' >> ${FW_JS}
	echo "$(PKG_VERSION)" > ${FRAMEWORK_ROOT}/../VERSION
	sed -i -e 's/__version__/\"1.2.0\"/g' ${FW_LIBS_JS} ;

compress: third_party js themes
	# Javacript code compressing
	# Remove exxcludeStart/excludeEnd data from the output
	sed -i -e '/^\/\/>>excludeStart\(.*\);/,/^\/\/>>excludeEnd\(.*\);/d' ${FW_JS};
	# Add copyright to minified file
	echo '/*' > ${FW_MIN}; \
	cat ${COPYING_FILE} >> ${FW_MIN}; \
	echo '*/' >> ${FW_MIN}; \
	# Minify legacy build version
	uglifyjs --ascii -nc ${FW_JS} >> ${FW_MIN};
	# Minify full version if exist
	if test -f "${FRAMEWORK_ROOT}/js/tizen-web-ui-fw.full.js" ; then \
		uglifyjs --ascii -nc ${FRAMEWORK_ROOT}/js/tizen-web-ui-fw.full.js >> ${FRAMEWORK_ROOT}/js/tizen-web-ui-fw.full.min.js; \
	fi;
	# CSS compressing
	@@cd ${THEME_OUTPUT_ROOT}; \
	for csspath in */*.css; do \
		echo "Compressing $$csspath"; \
		cleancss -o $${csspath/%.css/.min.css} $$csspath; \
	done


docs: init
	# Building documentation...
	@@hash docco 2>&1 /dev/null || (echo "docco not found. Please see README."; exit 1); \
	ls -l ${WIDGETS_DIR} | grep '^d' | awk '{print $$NF;}' | \
	while read REPLY; do \
		echo "	# Building docs for widget $$REPLY"; \
		for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.js' | sort`; do \
			docco $$f > /dev/null; \
		done; \
	done; \
	cp docs/docco.custom.css docs/docco.css; \
	cat docs/index.header > docs/index.html; \
	for f in `find docs -name '*.html' -not -name index.html | sort`; do \
		echo "<li><a href=\"$$(basename $$f)\">$$(basename $$f .html)</a></li>" >> docs/index.html; \
	done; \
	cat docs/index.footer >> docs/index.html


version_compat: third_party js
	# Creating compatible version dirs...
	for v_compat in ${VERSION_COMPAT}; do \
		ln -sf ${VERSION} ${FRAMEWORK_ROOT}/../$$v_compat; \
	done;
	ln -sf ${VERSION} ${FRAMEWORK_ROOT}/../latest

demo: js
	mkdir -p ${OUTPUT_ROOT}/demos
	cp -av demos/* ${OUTPUT_ROOT}/demos/
	cp -f src/template/bootstrap.js ${OUTPUT_ROOT}/demos/gallery/


install: all
	mkdir -p ${INSTALL_DIR}/bin ${INSTALL_DIR}/share/tizen-web-ui-fw/demos/ ${INSTALL_DIR}/share/tizen-web-ui-fw/bin/
	cp -av ${OUTPUT_ROOT}/tizen-web-ui-fw/* src/template ${INSTALL_DIR}/share/tizen-web-ui-fw/
	cp -av tools/* ${INSTALL_DIR}/share/tizen-web-ui-fw/bin/
	cp -av demos/tizen-winsets ${INSTALL_DIR}/share/tizen-web-ui-fw/demos/ && cd ${INSTALL_DIR}/share/tizen-web-ui-fw/demos/tizen-winsets && sed -i -e "s#../../build#../../..#g" *.html


coverage: clean all
	# Checking unit test coverage
	$(CURDIR)/tests/coverage/instrument.sh


dist: clean all docs
	# Creating tarball...
	@@ \
	TMPDIR=$$(mktemp -d tarball.XXXXXXXX); \
	DESTDIR=$${TMPDIR}/${PROJECT_NAME}; \
	MIN=''; \
	if test "x${DEBUG}x" = "xnox"; then \
		MIN='.min'; \
	fi; \
	TARBALL=${PROJECT_NAME}-${VERSION}-`date +%Y%m%d`$${MIN}.tar.gz; \
	mkdir -p $${DESTDIR}; \
	cp -a ${FW_JS} \
		${FW_LIBS_JS} \
		${THEMES_OUTPUT_ROOT}/tizen/${FW_THEME_CSS_FILE} \
		${FW_WIDGET_CSS_FILE} \
		${THEMES_OUTPUT_ROOT}/tizen/images \
		docs \
		README.md \
		COPYING \
		$${DESTDIR}; \
	hash git 2>&1 /dev/null && touch $${DESTDIR}/$$(git log | head -n 1 | awk '{print $$2;}'); \
	tar cfzps \
		$${TARBALL} \
		--exclude='.git' \
		--exclude='*.less.css' \
		--exclude='*.js.compiled' \
		--exclude='submodules/jquery-mobile' \
		--exclude='${JQUERY}' \
		-C $${TMPDIR} ${PROJECT_NAME}; \
	rm -rf $${TMPDIR}


clean:
	# Removing destination directory...
	@@rm -rf ${OUTPUT_ROOT}
	# Remove generated files...
	@@rm -f `find . -iname *.less.css`
	@@rm -f `find . -iname *.js.compiled`


init: clean
	# Check build environment...
	@@hash lessc 2>/dev/null || (echo "lessc not found. Please see HACKING."; exit 1); \

	# Initializing...
	@@mkdir -p ${JS_OUTPUT_ROOT}
	@@mkdir -p ${THEME_OUTPUT_ROOT}
	@@mkdir -p ${CSS_OUTPUT_ROOT}
	@@mkdir -p ${CSS_IMAGES_OUTPUT_DIR}
	@@mkdir -p ${PROTOTYPE_HTML_OUTPUT_DIR}
	@@rm -f docs/*.html
