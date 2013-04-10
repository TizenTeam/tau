THEMES	= tizen/tizen-*
export THEME_OUTPUT_ROOT ?= ../build/

all: themes defaulttheme

themes:
	# Make themes...
	@for theme in ${THEMES}; do \
		make -C $$theme || exit $?; \
		done

defaulttheme: themes
	ln -sf tizen-white ${THEME_OUTPUT_ROOT}/tizen-tizen

clean:
	# Clean themes...
	@for theme in ${THEMES}; do \
		make -C $$theme clean; \
		done

