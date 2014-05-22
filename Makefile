SHELL := /bin/bash
OUTPUT_ROOT = $(CURDIR)/tau/dist

DESTDIR ?=
PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

TAU_DIR = $(CURDIR)/tau
NODE = /usr/bin/node

all: grunt

grunt:
	cd ${TAU_DIR}; \
	$(NODE) node_modules/grunt-cli/bin/grunt;

install:
	mkdir -p ${INSTALL_DIR}/share/tizen-web-ui-fw/
	# copy framework
	cp -av ${OUTPUT_ROOT} ${INSTALL_DIR}/share/tizen-web-ui-fw/
