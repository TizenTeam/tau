#!/bin/bash
# This script creates TCT Package located in tct-package and automaticaly runs
# TCT tests
#
# Author: Michał Szepielak <m.szepielak@samsung.com>


# Config params
TEST_FILENAME=tct-webuifw-tests-2.2.1-1.zip
TEST_NAME=tct-webuifw-tests

# Aliases
TB=`tput bold`
TN=`tput sgr0`

USAGE_PROMPT="
Usage: ./tct-paker.sh [OPTION]
  ${TB}-c, --clean-cache${TN}
  	cleans testkit lite cache directory from cached tct packages (/opt/testkit/lite/)
  ${TB}-p, --pack-only${TN}
  	creates only TCT Packages. Testkit won't be fired
  "

case "$1" in
    -h|--help) echo "$USAGE_PROMPT"
               exit ;;
    -c|--clean-cache)
	    # Remove tmp directiories from testkit lite, to be sure,
		# that running package is not cached
     	echo "Cleaning cache directory"
     	sudo rm -rf /opt/testkit/lite/*-*-*
    	;;
    "") # empty argument is ok
    	PACK_ONLY=0
    	;;
	-p|--pack-only)
		PACK_ONLY=1
		;;
    *) echo "$USAGE_PROMPT"
       exit ;;
esac


# Copy runner application to package
cp tau-runner/$TEST_NAME.wgt tct-package/opt/$TEST_NAME/$TEST_NAME.wgt
# Copy test pattern to package
cp tau-runner/tests.xml tct-package/opt/$TEST_NAME/tests.xml
# Change working directory
cd tct-package

# Remove old package if exists
if [ -f $TEST_FILENAME ] ; then
	rm $TEST_FILENAME
fi
# Pack package
zip -9 -y -r -q $TEST_FILENAME opt

if [ $PACK_ONLY -eq 1 ]; then
	echo "Package was created in ./tct-package/${TEST_FILENAME}"
	exit
fi

# If there are multiple devices connected exit
if [ `sdb devices | awk '/List of devices/{getline; print}' | wc -l` -gt  ] ; then
	echo "Only one connected device or emulator is supported. Please unplug other devices or close emulators"
	echo "Package was created, but tests didn't run!"
	exit
fi

# Push package to device
sdb push $TEST_FILENAME /tmp
sdb root on
sdb shell "unzip -o /tmp/${TEST_FILENAME} -d /opt/usr/media/tct/"
sdb shell "/opt/usr/media/tct/opt/${TEST_NAME}/inst.sh"

# Run tests
testkit-lite -f device:/opt/usr/media/tct/opt/$TEST_NAME/tests.xml -e "WRTLauncher" -o $TEST_NAME.results.xml
