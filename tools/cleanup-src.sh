#!/bin/bash

path_to_be_removed=( \
	build.sh \
	debian \
	demos/aroundMe \
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
	src/widgets/mapview \
	tools/cleanup-src.sh )

cd `dirname $0`/../
for p in "${path_to_be_removed[@]}"; do
	echo "remove $p"
	rm -rf $p
done

# Remove propretary winsets from demo
sed -i -n '1h;1!H;${;g;s/<!-- START_PROPRIETARY -->.*<!-- END_PROPRIETARY -->//g;p;}' demos/tizen-winsets/index.html

# clean-up propretary winsets
prop_widgets=( mapview )

for w in "${prop_widgets[@]}"; do
	echo "Remove widget: $w"
	rm -rf src/widgets/${w}
	find demos/tizen-winsets/ -name "*${w}*" -exec rm -rf {} \;
	find src/themes/ -name "*${w}*" -exec rm -rf {} \;
	grep -r "$w" src/themes/ | cut -f1 -d: | xargs sed -i -e "/${w}/d"

done
