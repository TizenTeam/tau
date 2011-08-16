#!/bin/bash

### Prepare: set global variables ###
CWD=`pwd`
SRC_ROOT=`cd \`dirname $0\`/../; pwd`
SCRIPT_PATH="$CWD/`basename $0`"
APP_NAME=$1
INSTALL_DIR=$2
DESTDIR="$INSTALL_DIR/$APP_NAME"

# Print usage and exit #
function usage
{
	local EXITCODE=1
	if [ -n "$1" ]; then local ERRMSG=$1; else local ERRMSG="Invalid arguments"; fi
	local NO_USAGE=$2

	if [ -n "$1" ]; then EXITCODE=1; echo "ERROR: $ERRMSG"; echo ""; fi

	if [ ! -n "$2" ]; then 
		echo "Usage: `basename $SCRIPT_PATH` <app-name> <install-dir>"
		echo ""
		echo "       app-name : Your application name. If whitespace is contained, wrap it by quote mark."
		echo "       install-dir : Directory which the template code directory with name of app-name is created in."
		echo ""
	fi

	exit $EXITCODE
}


### Check argv ###
function check_argv
{
	if [ ! -d "$INSTALL_DIR" ]; then usage "No install-dir found; $INSTALL_DIR"; fi
	if [ -e "$DESTDIR" ]; then usage "$DESTDIR already exists"; fi
}


### Copy template to installation directory ###
function copy_template
{
	echo "Copying template files into $DESTDIR..."
	cp -a template $DESTDIR ||  usage "ERROR: Failed to copy files" ;
}


### Replace filename & keywords ###
function replace_template
{
	echo "Replacing template files..."

	local replace_keywords=( "APP_NAME" )

	local in_file_path_list=`find $DESTDIR -name '*.in' -type f -print`
	for in_file_path in ${in_file_path_list[@]}; do
		for keyword in "${replace_keywords[@]}"; do 
			eval "local val=\$$keyword"
			sed -i -e "s/@$keyword@/$val/g" $in_file_path
		done
	done
	rename 's/\.in//' $DESTDIR/*
}


### main ###
check_argv
copy_template
replace_template

