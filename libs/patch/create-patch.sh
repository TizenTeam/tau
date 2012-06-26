#!/bin/bash

cd `dirname $0`/../../
CWD=`pwd`
LIB_DIR=${CWD}/libs
PATCH_DIR=$LIB_DIR/patch

CURRENT_BRANCH="`git branch --no-color 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`"
PATCH_BRANCH="temp-patch"
ORIG_BRANCH_FILE="${CWD}/.current_branch.txt"
ORIG_BRANCH="`cat $ORIG_BRANCH_FILE 2>/dev/null`"

function reset_branch
{
	if test -n "$1"; then ret=$1; else ret=1; fi;
	echo "Restore to original git branch."
	git checkout ${ORIG_BRANCH}
	git branch -D ${PATCH_BRANCH}
	rm -f $ORIG_BRANCH_FILE
	exit $ret
}

# Make sure if current branch is PATCH_BRANCH
test ! -f "$ORIG_BRANCH_FILE" && echo "ERROR: Original branch file ($ORIG_BRANCH_FILE) is not found!" && exit 1
test "${CURRENT_BRANCH}" != "$PATCH_BRANCH" && echo "ERROR: Current branch is not '$PATCH_BRANCH'." && exit 1

# Extract patch files from latest commit
git format-patch -N --output-directory ${PATCH_DIR} ${ORIG_BRANCH}

# Reset branch to original branch
reset_branch 0

# Done. Notice howto
echo ""
echo "Creating your patch is done. Your patch is in ${PATCH_DIR}. Check your patch and add to git."
