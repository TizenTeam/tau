## Project setting
DEBUG ?= yes
PROJECT_NAME = tizen-web-ui-fw
VERSION = 0.1
VERSION_COMPAT =
THEME_NAME = default

PATH := $(CURDIR)/build-tools/bin:$(PATH)

JSLINT_LEVEL = 1
JSLINT = jslint --sloppy --eqeq --bitwise --forin --nomen --predef jQuery --color --plusplus --browser --jqmspace
INLINE_PROTO = 1
OUTPUT_ROOT = $(CURDIR)/build
FRAMEWORK_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}

LATEST_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/latest

JS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/js
export THEME_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes
CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes/${THEME_NAME}
CSS_IMAGES_OUTPUT_DIR = ${CSS_OUTPUT_ROOT}/images
WIDGET_CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/widget-css
PROTOTYPE_HTML_OUTPUT_DIR = proto-html

WIDGETS_DIR = $(CURDIR)/src/widgets

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

LIBS_JS_FILES = jlayout/jquery.sizes.js \
				jlayout/jlayout.border.js \
				jlayout/jlayout.grid.js \
				jlayout/jlayout.flexgrid.js \
				jlayout/jlayout.flow.js \
				jlayout/jquery.jlayout.js \
				domready.js \
                $(NULL)

JQUERY_MOBILE = submodules/jquery-mobile/compiled/jquery.mobile.js
JQUERY_MOBILE_CSS = submodules/jquery-mobile/compiled/jquery.mobile.structure.css \
                    submodules/jquery-mobile/compiled/jquery.mobile.css \
                    $(NULL)
JQUERY_MOBILE_IMAGES = submodules/jquery-mobile/css/themes/default/images

JQM_VERSION = jquery-mobile-1.0.1pre
JQM_LIB_PATH = $(CURDIR)/libs/js/${JQM_VERSION}

ifeq (${DEBUG},yes)
LIBS_JS_FILES +=\
	jquery.mobile.js \
    $(NULL)
JQUERY = jquery-1.6.4.js
else
LIBS_JS_FILES +=\
	jquery.mobile.min.js \
    $(NULL)
JQUERY = jquery-1.6.4.min.js
endif

LIBS_CSS_FILES =
ifeq (${DEBUG},yes)
LIBS_CSS_FILES +=\
    $(CURDIR)/src/jqm/compiled/jquery.mobile-1.0rc2pre.css \
    $(NULL)
else
LIBS_CSS_FILES +=\
    $(CURDIR)/src/jqm/compiled/jquery.mobile-1.0rc2pre.min.css \
    $(NULL)
endif


all: third_party widgets loader themes version_compat compress


jqm: init
	# Building jQuery Mobile...
	@@test -d ${JQM_LIB_PATH}.bak && rm -f ${JQM_LIB_PATH} && mv ${JQM_LIB_PATH}.bak ${JQM_LIB_PATH}; \
	cp -a ${JQM_LIB_PATH} ${JQM_LIB_PATH}.bak; \
	for f in `ls $(CURDIR)/libs/patch/*.patch`; do \
		cd $(CURDIR); \
		echo "Apply patch: $$f";  \
		cat $$f | patch -p1 -N; \
	done; \
	cd ${JQM_LIB_PATH} && make all-but-min || exit 1; \
	cp -f ${JQM_LIB_PATH}/compiled/*.js ${JQM_LIB_PATH}/../; \
	rm -rf ${JQM_LIB_PATH}; mv ${JQM_LIB_PATH}.bak ${JQM_LIB_PATH};



third_party: init jqm
	# Building third party components...
	@@cd ${LIBS_DIR}/js; \
	    for f in ${LIBS_JS_FILES}; do \
	        cat $$f >> ${FW_LIB_JS}; \
		uglifyjs $$f >> ${FW_LIB_MIN}; \
		echo "" >> ${FW_LIB_MIN}; \
	    done; \
	    cp ${LIBS_DIR}/js/${JQUERY} ${JS_OUTPUT_ROOT}/jquery.js
	@@cd ${LIBS_DIR}/css; \
	    for f in ${LIBS_CSS_FILES}; do \
	        cat $$f >> ${FW_CSS}; \
	    done; \
	    cp -r images/* ${CSS_IMAGES_OUTPUT_DIR}

	#@@cp -a ${LIBS_DIR}/images ${FRAMEWORK_ROOT}/


widgets: init third_party
	# Building widgets...
	@@ls -l ${WIDGETS_DIR} | grep '^d' | awk '{print $$NF;}' | \
	    while read REPLY; do \
	        echo "	# Building widget $$REPLY"; \
			if test ${JSLINT_LEVEL} -ge 1; then \
				for FNAME in ${WIDGETS_DIR}/$$REPLY/js/*.js; do \
					${JSLINT} $$FNAME; \
					if test ${JSLINT_LEVEL} -ge 2 -a $$? -ne 0; then \
						exit 1; \
					fi; \
				done; \
			fi; \
			if test "x${INLINE_PROTO}x" = "x1x"; then \
				./tools/inline-protos.sh ${WIDGETS_DIR}/$$REPLY >> ${WIDGETS_DIR}/$$REPLY/js/$$REPLY.js.compiled; \
				cat ${WIDGETS_DIR}/$$REPLY/js/$$REPLY.js.compiled >> ${FW_JS}; \
			else \
				for f in `find ${WIDGETS_DIR}/$$REPLY -iname 'js/*.js' | sort`; do \
					echo "		$$f"; \
					cat $$f >> ${FW_JS}; \
				done; \
            fi; \
	        for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.js.theme' | sort`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_JS_THEME}; \
	        done; \
	        for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.less' | sort`; do \
	            echo "		$$f"; \
	            lessc $$f > $$f.css; \
	        done; \
	        for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.css' | sort`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_CSS}; \
	        done; \
	        for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.gif' -or -iname '*.png' -or -iname '*.jpg' | sort`; do \
	            echo "		$$f"; \
	            cp $$f ${CSS_IMAGES_OUTPUT_DIR}; \
	        done; \
                if test "x${INLINE_PROTO}x" != "x1x"; then \
	          for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.prototype.html' | sort`; do \
	              echo "		$$f"; \
	              cp $$f ${PROTOTYPE_HTML_OUTPUT_DIR}; \
	          done; \
                fi; \
	    done


loader: widgets globalize
	cat 'src/loader/loader.js' >> ${FW_JS}


globalize: widgets
	cat 'libs/js/globalize/lib/globalize.js' >> ${FW_JS}
	# copy globalize libs...
	cp -a libs/js/globalize/lib/cultures ${FRAMEWORK_ROOT}/js/


themes:
	make -C src/themes || exit $?


compress: widgets loader
	@@echo "	# Compressing....";
	echo '/*' > ${FW_MIN}
	cat ${COPYING_FILE} >> ${FW_MIN}
	echo '*/' >> ${FW_MIN}
	uglifyjs -nc ${FW_JS} >> ${FW_MIN}


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


version_compat: third_party widgets
	# Creating compatible version dirs...
	for v_compat in ${VERSION_COMPAT}; do \
		ln -sf ${VERSION} ${FRAMEWORK_ROOT}/../$$v_compat; \
	done;

demo: widgets 
	mkdir -p ${OUTPUT_ROOT}/demos
	cp -av demos/* ${OUTPUT_ROOT}/demos/
	cp -f src/template/bootstrap.js ${OUTPUT_ROOT}/demos/gallery/


install: all
	mkdir -p ${INSTALL_DIR}/lib/tizen-web-ui-fw ${INSTALL_DIR}/bin ${INSTALL_DIR}/share/tizen-web-ui-fw/demos/
	cp -av ${OUTPUT_ROOT}/tizen-web-ui-fw/* src/template ${INSTALL_DIR}/lib/tizen-web-ui-fw/
	cp -av tools/* ${INSTALL_DIR}/bin/
	cp -av demos/tizen-gray ${INSTALL_DIR}/share/tizen-web-ui-fw/demos/ && cd ${INSTALL_DIR}/share/tizen-web-ui-fw/demos/tizen-gray && sed -i -e "s#../../build#../../../../lib#g" *.html


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
