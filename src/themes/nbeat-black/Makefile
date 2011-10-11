THEME_NAME=nbeat-black

THEME_OUTPUT_ROOT ?= .
OUTPUT_DIR = ${THEME_OUTPUT_ROOT}/${THEME_NAME}

CSS_OUTPUT = ${OUTPUT_DIR}/web-ui-fw-theme.css


CSS_SRCS=	jquery.mobile.theme.less.css \
		jquery.mobile.core.css \
		jquery.mobile.transitions.css \
		jquery.mobile.grids.css \
		jquery.mobile.headerfooter.css \
		jquery.mobile.navbar.css \
		jquery.mobile.button.css \
		jquery.mobile.collapsible.css \
		jquery.mobile.controlgroup.css \
		jquery.mobile.dialog.css \
		jquery.mobile.forms.checkboxradio.css \
		jquery.mobile.forms.fieldcontain.css \
		jquery.mobile.forms.select.css \
		jquery.mobile.forms.textinput.css \
		jquery.mobile.listview.css \
		jquery.mobile.forms.slider.css \
		jquery.mobile.popupwindow.css \
		jquery.mobile.segmentctrl.css


all: prepare css images

prepare:
	-mkdir -p ${OUTPUT_DIR}

less: prepare
	for f in `find . -iname '*.less' | sort`; do \
		echo "		$$f"; \
		lessc $$f > $$f.css; \
		done;

css: prepare less
	# Creating nbeat-black theme...
	@rm -f $(CSS_OUTPUT)
	@for src in $(CSS_SRCS); do \
		cat $$src >> $(CSS_OUTPUT) ; \
		done

images: prepare
	# Copying nbeat-black theme images...
	@cp -a images/ ${OUTPUT_DIR}/

clean:
	# Cleaning nbeat-black theme...
	-rm -rf $(OUTPUT_DIR)
	-rm -f *.less.css

