#!/bin/bash

path_to_be_removed=( \
	build.sh \
	debian \
	demos/aroundMe \
	demos/baseline \
	demos/gallery \
	demos/nbeat-white \
	demos/phonebook \
	deprecated \
	deps.dot \
	deps.manual.svg \
	docs \
	generate_demo_apps.py \
	HACKING.md \
	limbo \
	README*	\
	run.sh \
	src/jqm \
	src/candidates \
	src/themes/default \
	src/themes/nbeat-black \
	src/themes/nbeat-white \
	tests \
	tools/cleanup-src.sh )

cd `dirname $0`/../
for p in "${path_to_be_removed[@]}"; do
	echo $p
	rm -rf $p
done
