DEBUG = yes
PROJECT_NAME = web-ui-fw
VERSION = 0.1
VERSION_COMPAT =
THEME_NAME = default

INLINE_PROTO = 1
OUTPUT_ROOT = $(CURDIR)/build
FRAMEWORK_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}
JS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/js
export THEME_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes
#CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/css
CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes/${THEME_NAME}
CSS_IMAGES_OUTPUT_DIR = ${CSS_OUTPUT_ROOT}/images
PROTOTYPE_HTML_OUTPUT_DIR = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}/proto-html/${THEME_NAME}

CODE_DIR = src/widgets
LIBS_DIR = libs

DESTDIR ?= 
PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

FW_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}.js
FW_JS_THEME = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-${THEME_NAME}-theme.js
#FW_CSS = ${CSS_OUTPUT_ROOT}/${PROJECT_NAME}-${THEME_NAME}-theme.css
FW_CSS = ${CSS_OUTPUT_ROOT}/${PROJECT_NAME}-theme.css
FW_LIBS_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-libs.js

LIBS_JS_FILES = underscore.js

ifeq (${DEBUG},yes)
LIBS_JS_FILES +=\
    $(CURDIR)/src/jqm/compiled/jquery.mobile-1.0rc2pre.js \
    jquery.ui.position.git+dfe75e1.js \
    $(NULL)
JQUERY = jquery-1.6.4.js
else
LIBS_JS_FILES +=\
    $(CURDIR)/src/jqm/compiled/jquery.mobile-1.0rc2pre.min.js \
    jquery.ui.position.git+dfe75e1.min.js \
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

all: third_party widgets loader themes version_compat

# NOTE: This jqm target is temporary.
jqm: init
	# Building jQuery Mobile...
	@@cd src/jqm && make all-but-min

third_party: init jqm
	# Building third party components...
	@@cd ${LIBS_DIR}/js; \
	    for f in ${LIBS_JS_FILES}; do \
	        cat $$f >> ${FW_JS}; \
	    done
	    cp ${LIBS_DIR}/js/${JQUERY} ${JS_OUTPUT_ROOT}/jquery.js
	@@cd ${LIBS_DIR}/css; \
	    for f in ${LIBS_CSS_FILES}; do \
	        cat $$f >> ${FW_CSS}; \
	    done; \
	    cp -r images/* ${CSS_IMAGES_OUTPUT_DIR}

	#@@cp -a ${LIBS_DIR}/images ${FRAMEWORK_ROOT}/

widgets: init third_party
	# Building widgets...
	@@ls -l ${CODE_DIR} | grep '^d' | awk '{print $$NF;}' | \
	    while read REPLY; do \
	        echo "	# Building widget $$REPLY"; \
                if test "x${INLINE_PROTO}x" = "x1x"; then \
                  ./tools/inline-protos.sh ${CODE_DIR}/$$REPLY >> ${CODE_DIR}/$$REPLY/js/$$REPLY.js.compiled; \
                  cat ${CODE_DIR}/$$REPLY/js/$$REPLY.js.compiled >> ${FW_JS}; \
                else \
	          for f in `find ${CODE_DIR}/$$REPLY -iname 'js/*.js' | sort`; do \
	              echo "		$$f"; \
	              cat $$f >> ${FW_JS}; \
	          done; \
                fi; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.js.theme' | sort`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_JS_THEME}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.less' | sort`; do \
	            echo "		$$f"; \
	            lessc $$f > $$f.css; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.css' | sort`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_CSS}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.gif' -or -iname '*.png' -or -iname '*.jpg' | sort`; do \
	            echo "		$$f"; \
	            cp $$f ${CSS_IMAGES_OUTPUT_DIR}; \
	        done; \
                if test "x${INLINE_PROTO}x" != "x1x"; then \
	          for f in `find ${CODE_DIR}/$$REPLY -iname '*.prototype.html' | sort`; do \
	              echo "		$$f"; \
	              cp $$f ${PROTOTYPE_HTML_OUTPUT_DIR}; \
	          done; \
                fi; \
	    done

loader: widgets
	cat 'src/loader/loader.js' >> ${FW_JS}

themes:
	make -C src/themes || exit $?

version_compat: third_party widgets
	# Creating compatible version dirs...
	for v_compat in ${VERSION_COMPAT}; do \
		ln -sf ${VERSION} ${FRAMEWORK_ROOT}/../$$v_compat; \
	done;

demo: widgets 
	mkdir -p ${OUTPUT_ROOT}/demos
	cp -av demos/* ${OUTPUT_ROOT}/demos/
	cp -f src/template/bootstrap.js ${OUTPUT_ROOT}/demos/gallery/

install:
	mkdir -p ${INSTALL_DIR}/share/slp-web-fw ${INSTALL_DIR}/bin
	cp -av ${OUTPUT_ROOT}/* src/template ${INSTALL_DIR}/share/slp-web-fw/
	cp -av tools/* ${INSTALL_DIR}/bin

clean:
	# Removing destination directory...
	@@rm -rf ${OUTPUT_ROOT}
	# Remove generated files...
	@@rm -f `find . -iname *.less.css`
	@@rm -f `find . -iname *.js.compiled`
	@@cd src/jqm && make clean

init: clean
	# Initializing...
	@@mkdir -p ${JS_OUTPUT_ROOT}
	@@mkdir -p ${THEME_OUTPUT_ROOT}
	@@mkdir -p ${CSS_OUTPUT_ROOT}
	@@mkdir -p ${CSS_IMAGES_OUTPUT_DIR}
	@@mkdir -p ${PROTOTYPE_HTML_OUTPUT_DIR}
