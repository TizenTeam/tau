#!/bin/bash

cd `dirname $0`/../
SRCROOT=`pwd`

PROJECT=web-ui-fw
VERSION=`grep 'Version:' packaging/web-ui-fw.spec  | awk '{print $2}'`
TARNAME=$PROJECT-$VERSION

OBS_USER=$1
OBS_LOCAL=home:$OBS_USER
OBSDIR_ROOT=$HOME/obs
OBSDIR_USER=$OBSDIR_ROOT/$OBS_LOCAL
OBSDIR_PROJECT=$OBSDIR_USER/$PROJECT

if test ! -n "$OBS_USER"; then
	echo "Error: No OBS account is given."
	echo "USAGE: $0 <OBS account name> [--upload]"
	echo ""
	echo "${HOME}/obs/home:<OBS account>/web-ui-fw direcory will be created."
	echo "NOTE:"
	echo "  If --upload option is given, OBS build request will be done to your home project."
	echo "  Otherwise, local OBS will be run."
	exit 1
fi

### OBS
test -d "$OBSDIR_ROOT" || mkdir -p $OBSDIR_ROOT
cd $OBSDIR_ROOT
test -d "$OBSDIR_USER" || osc co $OBS_LOCAL/$PROJECT || ( echo "Error: Failed to checkout $OBS_LOCAL/$PROJECT"; exit 1 )
cd $OBSDIR_USER
test -d $OBSDIR_PROJECT || osc mkpac $PROJECT

### Make tarball and spec into obs project dir
cd $OBSDIR_PROJECT
osc rm --force *
rm -rf $OBSDIR_PROJECT/*
cd $SRCROOT
git archive --format=tar --prefix=$TARNAME/ HEAD | gzip > $OBSDIR_PROJECT/$TARNAME.tar.gz
cp -av ./packaging/$PROJECT.spec $OBSDIR_PROJECT/
cd $OBSDIR_PROJECT

echo "Complete."
echo "If you want to build locally, run following command:"
echo "cd $OBSDIR_PROJECT; osc build standard --no-verify --local-package --clean"
echo ""

### Build
if test "$2" == "--upload"; then
	osc add *
	osc ci
else
	#rpmbuild -ba packaging/*.spec
	cd $OBSDIR_PROJECT
	osc build standard --no-verify --local-package --clean
fi

