THEME_NAME=tizen-blue

THEME_OUTPUT_ROOT ?= .
OUTPUT_DIR = ${THEME_OUTPUT_ROOT}/${THEME_NAME}

CSS_OUTPUT = ${OUTPUT_DIR}/web-ui-fw-theme.css

CSS_SRCS=	../common/jquery.mobile.theme.less.css \
		../common/jquery.mobile.core.less.css \
		../common/jquery.mobile.transitions.css \
		../common/jquery.mobile.scrollview.css \
		../common/jquery.mobile.grids.css \
		../common/jquery.mobile.headerfooter.css \
		../common/jquery.mobile.navbar.css \
		../common/jquery.mobile.button.less.css \
		../common/jquery.mobile.collapsible.css \
		../common/jquery.mobile.dialog.less.css \
		../common/jquery.mobile.forms.checkboxradio.less.css \
		../common/jquery.mobile.forms.fieldcontain.css \
		../common/jquery.mobile.forms.select.css \
		../common/jquery.mobile.forms.textinput.less.css \
		../common/jquery.mobile.controlgroup.less.css \
		../common/jquery.mobile.listview.less.css \
		../common/jquery.mobile.virtuallistview.less.css \
		../common/jquery.mobile.popupwindow.less.css \
		../common/jquery.mobile.segmentctrl.css \
		../common/jquery.mobile.hsvpicker.less.css \
		../common/jquery.mobile.colorpalette.less.css \
		../common/jquery.mobile.colortitle.less.css \
		../common/jquery.mobile.datetimepicker.less.css \
		../common/jquery.mobile.ctxpopup.less.css \
		../common/jquery.mobile.progressbar.less.css \
		../common/jquery.mobile.progress.less.css \
		../common/jquery.mobile.slider.less.css \
		../common/jquery.mobile.imageslider.less.css \
		../common/jquery.mobile.tickernoti.less.css \
		../common/jquery.mobile.smallpopup.less.css \
		../common/jquery.mobile.optionheader.less.css \
		../common/jquery.mobile.pagecontrol.less.css \
		../common/jquery.mobile.calendarpicker.less.css \
		../common/jquery.mobile.swipelist.less.css \
		../common/jquery.mobile.nocontents.less.css \
		../common/shortcutscroll.less.css \
		../common/dayselector.less.css

all: prepare css images js

prepare:
	-mkdir -p ${OUTPUT_DIR}

less: prepare
	# Compiling less to css...
	@for f in `find ../common -iname '*.less' | sort`; do \
		if test "config.less" = "$$f" ; then continue; fi; \
		echo "	build $$f"; \
		lessc $$f > $$f.css; \
		done;

css: prepare less
	# Creating tizen-blue theme...
	@rm -f $(CSS_OUTPUT)
	@for src in $(CSS_SRCS); do \
		cat $$src >> $(CSS_OUTPUT) ; \
		done

images: prepare
	# Copying tizen-blue theme images...
	@cp -a images/ ${OUTPUT_DIR}/

js: prepare
	@cp -a theme.js ${OUTPUT_DIR}

clean:
	# Cleaning tizen-blue theme...
	-rm -rf $(OUTPUT_DIR)
	-rm -f *.less.css

