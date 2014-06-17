SHELL := /bin/bash
OUTPUT_ROOT = $(CURDIR)/tau/dist/*
LEGACY_ROOT = $(CURDIR)/legacy/*

DESTDIR ?=
PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

TAU = ${INSTALL_DIR}/share/tau/
LEGACY = ${INSTALL_DIR}/share/tizen-web-ui-fw/

TAU_DIR = $(CURDIR)/tau
NODE = /usr/bin/node

all: grunt version

grunt:
	cd ${TAU_DIR}; \
	$(NODE) node_modules/grunt-cli/bin/grunt;

version:
	sed -i -e 's/$(shell cat packaging/web-ui-fw.spec | grep Version: | sed -e "s@Version:\s*@@")/$(shell cat tau/package.json | grep version | sed -e 's@\s"version": "@@' -e 's@",@@')/g' packaging/web-ui-fw.spec

install:
	mkdir -p ${LEGACY} ${TAU}
	# copy framework
	cp -av ${OUTPUT_ROOT} ${TAU}
	cp -av ${LEGACY_ROOT} ${LEGACY}
	# delete wearable resource
	rm -rf ${TAU}/wearable
