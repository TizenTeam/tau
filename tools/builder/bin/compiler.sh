#!/bin/sh
SCRIPT_BASE=$(dirname $(readlink -f $0))
BUILDER_BIN_DIR=`(cd $SCRIPT_BASE && pwd)`
BUILDER_APP_DIR=`(cd $BUILDER_BIN_DIR/.. && pwd)`
BUILDER_LIB_DIR=`(cd $BUILDER_BIN_DIR/../lib && pwd)`
java -jar "$BUILDER_LIB_DIR/closure-compiler.jar" $@
exit $?

