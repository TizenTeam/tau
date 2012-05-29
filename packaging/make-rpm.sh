#!/bin/bash -x

PROJECT=web-ui-fw
VERSION=0.1.16
TARNAME=$PROJECT-$VERSION

OBS_USER=youmin.ha
OBS_LOCAL=home:$OBS_USER
OBSDIR_ROOT=$HOME/obs
OBSDIR_USER=$OBSDIR_ROOT/$OBS_LOCAL
OBSDIR_PROJECT=$OBSDIR_USER/$PROJECT

cd `dirname $0`/../
SRCROOT=`pwd`

### OBS
test -d "$OBSDIR_ROOT" || mkdir -p $OBSDIR_ROOT
cd $OBSDIR_ROOT
test -d "$OBSDIR_USER" || osc co $OBS_LOCAL
cd $OBSDIR_USER
test -d $OBSDIR_PROJECT || osc mkpac $PROJECT
cd $OBSDIR_PROJECT

### Make tarball and spec into obs project dir
rm -rf $OBSDIR_PROJECT/*
cd $SRCROOT
git archive --format=tar --prefix=$TARNAME/ HEAD | gzip > $OBSDIR_PROJECT/$TARNAME.tar.gz
cp -av ./packaging/$PROJECT.spec $OBSDIR_PROJECT/


### Build
#rpmbuild -ba packaging/*.spec
cd $OBSDIR_PROJECT
osc build standard --no-verify --local-package --clean

