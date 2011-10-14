THEME_NAME=nbeat-black

THEME_OUTPUT_ROOT ?= .
OUTPUT_DIR = ${THEME_OUTPUT_ROOT}/${THEME_NAME}

CSS_OUTPUT = ${OUTPUT_DIR}/web-ui-fw-theme.css


CSS_SRCS=	jquery.mobile.theme.less.css \
		jquery.mobile.core.less.css \
		jquery.mobile.transitions.css \
		jquery.mobile.grids.css \
		jquery.mobile.headerfooter.css \
		jquery.mobile.navbar.css \
		jquery.mobile.button.less.css \
		jquery.mobile.collapsible.css \
		jquery.mobile.controlgroup.css \
		jquery.mobile.dialog.css \
		jquery.mobile.forms.checkboxradio.less.css \
		jquery.mobile.forms.fieldcontain.css \
		jquery.mobile.forms.select.css \
		jquery.mobile.forms.textinput.css \
		jquery.mobile.listview.less.css \
		jquery.mobile.forms.slider.css \
		jquery.mobile.popupwindow.less.css \
		jquery.mobile.segmentctrl.css \
		jquery.mobile.hsvpicker.less.css \
		jquery.mobile.colorpalette.less.css \
		jquery.mobile.colortitle.less.css \
        jquery.mobile.datetimepicker.less.css \
        jquery.mobile.ctxpopup.less.css


all: prepare css images

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

