THEME_NAME=tizen-white

THEME_OUTPUT_ROOT ?= .
OUTPUT_DIR = ${THEME_OUTPUT_ROOT}/${THEME_NAME}

CSS_OUTPUT = ${OUTPUT_DIR}/tizen-web-ui-fw-theme.css

CSS_SRCS=	../common/jquery.mobile.theme.less.css \
		../common/jquery.mobile.core.less.css \
		../common/jquery.mobile.transitions.css \
		../common/jquery.mobile.grids.css \
		../common/jquery.mobile.headerfooter.less.css \
		../common/jquery.mobile.navbar.css \
		../common/jquery.mobile.button.less.css \
		../common/jquery.mobile.collapsible.less.css \
		../common/jquery.mobile.dialog.less.css \
		../common/jquery.mobile.forms.checkboxradio.less.css \
		../common/jquery.mobile.forms.fieldcontain.css \
		../common/jquery.mobile.forms.select.css \
		../common/jquery.mobile.forms.textinput.less.css \
		../common/jquery.mobile.controlgroup.less.css \
		../common/jquery.mobile.listview.less.css \
		../common/jquery.mobile.segmentctrl.less.css \
		../common/jquery.mobile.tizen.optionheader.less.css \
		../common/jquery.mobile.tizen.virtuallistview.less.css \
		../common/jquery.mobile.tizen.scrollview.less.css \
		../common/jquery.mobile.tizen.datetimepicker.less.css \
		../common/jquery.mobile.tizen.popupwindow.less.css \
		../common/jquery.mobile.tizen.ctxpopup.less.css \
		../common/jquery.mobile.tizen.progressbar.less.css \
		../common/jquery.mobile.tizen.progress.less.css \
		../common/jquery.mobile.tizen.slider.less.css \
		../common/jquery.mobile.tizen.gallery.less.css \
		../common/jquery.mobile.tizen.notification.less.css \
		../common/jquery.mobile.tizen.pagecontrol.less.css \
		../common/jquery.mobile.tizen.swipe.less.css \
		../common/jquery.mobile.tizen.nocontents.less.css \
		../common/jquery.mobile.tizen.shortcutscroll.less.css \
		../common/jquery.mobile.tizen.dayselector.less.css \
		../common/jquery.mobile.tizen.toggleswitch.less.css \
		../common/jquery.mobile.tizen.triangle.less.css \
		../common/jquery.mobile.tizen.multibuttonentry.less.css \
		../common/jquery.mobile.tizen.scrollview.handler.less.css \
		../common/jquery.mobile.tizen.virtualgridview.less.css \
		../common/jquery.mobile.tizen.multimediaview.less.css \
		../common/jquery.mobile.tizen.mapview.less.css \
		../common/jquery.mobile.popup.css \
		../common/jquery.mobile.tizen.popup.less.css \
		../common/jquery.mobile.tizen.misc.less.css \
		../common/jquery.mobile.tizen.controlbar.less.css

all: prepare css images js

prepare:
	-mkdir -p ${OUTPUT_DIR}
	-ln -sf ${THEME_NAME} ${THEME_OUTPUT_ROOT}/tizen-tizen

less: prepare
	# Compiling less to css...
	@for f in `find ../common -iname '*.less' | sort`; do \
		if test "config.less" = "$$f" ; then continue; fi; \
		echo "	build $$f"; \
		lessc $$f > $$f.css; \
		done;

css: prepare less
	# Creating tizen-gray theme...
	@rm -f $(CSS_OUTPUT)
	@for src in $(CSS_SRCS); do \
		cat $$src >> $(CSS_OUTPUT) ; \
		done

images: prepare
	# Copying tizen-gray theme images...
	@cp -a images/ ${OUTPUT_DIR}/

js: prepare
	@cp -a theme.js ${OUTPUT_DIR}

clean:
	# Cleaning tizen-gray theme...
	-rm -rf $(OUTPUT_DIR)
	-rm -f *.less.css

