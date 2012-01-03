THEME_NAME=nbeat-hd

THEME_OUTPUT_ROOT ?= .
OUTPUT_DIR = ${THEME_OUTPUT_ROOT}/${THEME_NAME}

CSS_OUTPUT = ${OUTPUT_DIR}/web-ui-fw-theme.css


CSS_SRCS=	jquery.mobile.forms.checkboxradio.less.css

all: prepare css images js

prepare:
	-mkdir -p ${OUTPUT_DIR}

less: prepare
	# Compiling less to css...
	@for f in `find . -iname '*.less' | sort`; do \
		if test "./config.less" = "$$f" ; then continue; fi; \
		echo "	build $$f"; \
		lessc $$f > $$f.css; \
		done;

css: prepare less
	# Creating nbeat-hd theme...
	@rm -f $(CSS_OUTPUT)
	@for src in $(CSS_SRCS); do \
		cat $$src >> $(CSS_OUTPUT) ; \
		done

images: prepare
	# Copying nbeat-hd theme images...
	@cp -a images/ ${OUTPUT_DIR}/

js: prepare
	@cp -a theme.js ${OUTPUT_DIR}

clean:
	# Cleaning nbeat-hd theme...
	-rm -rf $(OUTPUT_DIR)
	-rm -f *.less.css

