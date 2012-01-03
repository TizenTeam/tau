THEME_NAME=nbeat-gray

THEME_OUTPUT_ROOT ?= .
OUTPUT_DIR = ${THEME_OUTPUT_ROOT}/${THEME_NAME}

CSS_OUTPUT = ${OUTPUT_DIR}/web-ui-fw-theme.css

CSS_SRCS=	../nbeat-hd/jquery.mobile.theme.less.css \
		../nbeat-hd/jquery.mobile.core.less.css \
		../nbeat-hd/jquery.mobile.transitions.css \
		../nbeat-hd/jquery.mobile.grids.css \
		../nbeat-hd/jquery.mobile.headerfooter.css \
		../nbeat-hd/jquery.mobile.navbar.css \
		../nbeat-hd/jquery.mobile.button.less.css \
		../nbeat-hd/jquery.mobile.collapsible.css \
		../nbeat-hd/jquery.mobile.dialog.less.css \
		../nbeat-hd/jquery.mobile.forms.checkboxradio.less.css \
		../nbeat-hd/jquery.mobile.forms.fieldcontain.css \
		../nbeat-hd/jquery.mobile.forms.select.css \
		../nbeat-hd/jquery.mobile.forms.textinput.less.css \
		../nbeat-hd/jquery.mobile.controlgroup.less.css \
		../nbeat-hd/jquery.mobile.listview.less.css \
		../nbeat-hd/jquery.mobile.virtuallistview.less.css \
		../nbeat-hd/jquery.mobile.popupwindow.less.css \
		../nbeat-hd/jquery.mobile.segmentctrl.css \
		../nbeat-hd/jquery.mobile.hsvpicker.less.css \
		../nbeat-hd/jquery.mobile.colorpalette.less.css \
		../nbeat-hd/jquery.mobile.colortitle.less.css \
		../nbeat-hd/jquery.mobile.datetimepicker.less.css \
		../nbeat-hd/jquery.mobile.ctxpopup.less.css \
		../nbeat-hd/jquery.mobile.progressbar.less.css \
		../nbeat-hd/jquery.mobile.progress.less.css \
		../nbeat-hd/jquery.mobile.slider.less.css \
		../nbeat-hd/jquery.mobile.imageslider.less.css \
		../nbeat-hd/jquery.mobile.tickernoti.less.css \
		../nbeat-hd/jquery.mobile.smallpopup.less.css \
		../nbeat-hd/jquery.mobile.optionheader.less.css \
		../nbeat-hd/jquery.mobile.pagecontrol.less.css \
		../nbeat-hd/jquery.mobile.calendarpicker.less.css \
		../nbeat-hd/jquery.mobile.swipelist.less.css \
		../nbeat-hd/jquery.mobile.nocontents.less.css \
		../nbeat-hd/shortcutscroll.less.css \
		../nbeat-hd/dayselector.less.css

all: prepare css images js

prepare:
	-mkdir -p ${OUTPUT_DIR}

less: prepare
	# Compiling less to css...
	@for f in `find ../nbeat-hd -iname '*.less' | sort`; do \
		if test "config.less" = "$$f" ; then continue; fi; \
		echo "	build $$f"; \
		lessc $$f > $$f.css; \
		done;

css: prepare less
	# Creating nbeat-gray theme...
	@rm -f $(CSS_OUTPUT)
	@for src in $(CSS_SRCS); do \
		cat $$src >> $(CSS_OUTPUT) ; \
		done

images: prepare
	# Copying nbeat-gray theme images...
	@cp -a images/ ${OUTPUT_DIR}/

js: prepare
	@cp -a theme.js ${OUTPUT_DIR}

clean:
	# Cleaning nbeat-gray theme...
	-rm -rf $(OUTPUT_DIR)
	-rm -f *.less.css

