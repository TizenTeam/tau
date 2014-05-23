SHELL := /bin/bash
OUTPUT_ROOT = $(CURDIR)/tau/dist/*

DESTDIR ?=
PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

ORIGIN = ${INSTALL_DIR}/share/tau/
ORIGIN_PATH = ../../../tau
ORIGIN_JS = ../../../tau/js/mobile
ORIGIN_CSS_BLACK = ../../../../tau/theme/mobile/black
ORIGIN_CSS_WHITE = ../../../../tau/theme/mobile/white

SLINK = ${INSTALL_DIR}/share/tizen-web-ui-fw
SLINK_JS = ${INSTALL_DIR}/share/tizen-web-ui-fw/0.2/js
SLINK_CSS = ${INSTALL_DIR}/share/tizen-web-ui-fw/0.2/themes
SLINK_CSS_BLACK = ${INSTALL_DIR}/share/tizen-web-ui-fw/0.2/themes/tizen-black
SLINK_CSS_WHITE = ${INSTALL_DIR}/share/tizen-web-ui-fw/0.2/themes/tizen-white

TAU_DIR = $(CURDIR)/tau
NODE = /usr/bin/node

all: grunt version

grunt:
	cd ${TAU_DIR}; \
	$(NODE) node_modules/grunt-cli/bin/grunt;

version:
	sed -i -e 's/$(shell cat packaging/web-ui-fw.spec | grep Version: | sed -e "s@Version:\s*@@")/$(shell cat tau/package.json | grep version | sed -e 's@\s"version": "@@' -e 's@",@@')/g' packaging/web-ui-fw.spec

install:
	mkdir -p ${SLINK_JS} ${SLINK_CSS_BLACK} ${SLINK_CSS_WHITE} ${ORIGIN}
	# copy framework
	cp -av ${OUTPUT_ROOT} ${ORIGIN}
	# make symlink
	ln -s ${ORIGIN_JS}/jquery.js ${SLINK_JS}/jquery.js
	ln -s ${ORIGIN_JS}/jquery.min.js ${SLINK_JS}/jquery.min.js
	ln -s ${ORIGIN_JS}/tau.js ${SLINK_JS}/tizen-web-ui-fw.js
	ln -s ${ORIGIN_JS}/tau.min.js ${SLINK_JS}/tizen-web-ui-fw.min.js
	ln -s ${ORIGIN_JS}/cultures ${SLINK_JS}/cultures
	ln -s ${ORIGIN_CSS_BLACK}/tau.css ${SLINK_CSS_BLACK}/tizen-web-ui-fw-theme.css
	ln -s ${ORIGIN_CSS_BLACK}/tau.min.css ${SLINK_CSS_BLACK}/tizen-web-ui-fw-theme.min.css
	ln -s ${ORIGIN_CSS_BLACK}/images ${SLINK_CSS_BLACK}/images
	ln -s ${ORIGIN_CSS_WHITE}/tau.css ${SLINK_CSS_WHITE}/tizen-web-ui-fw-theme.css
	ln -s ${ORIGIN_CSS_WHITE}/tau.min.css ${SLINK_CSS_WHITE}/tizen-web-ui-fw-theme.min.css
	ln -s ${ORIGIN_CSS_WHITE}/images ${SLINK_CSS_WHITE}/images
	ln -s ./tizen-black ${SLINK_CSS}/tizen-tizen
	ln -s ./0.2 ${SLINK}/latest
	ln -s ../tau/LICENSE.Flora ${SLINK}/LICENSE.Flora
	ln -s ../tau/VERSION ${SLINK}/VERSION
	# make dummy
	touch ${SLINK_JS}/tizen-web-ui-fw-libs.js
	touch ${SLINK_JS}/tizen-web-ui-fw-libs.min.js
	# delete wearable resource
	rm -rf ${ORIGIN}/js/wearable ${ORIGIN}/theme/mobile/default ${ORIGIN}/theme/wearable
