#!/bin/bash

cd `dirname $0`/../../
CWD=`pwd`
LIB_DIR=${CWD}/libs
PATCH_DIR=$LIB_DIR/patch

CURRENT_BRANCH="`git branch --no-color 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'`"
PATCH_BRANCH=temp-patch
CURRENT_BRANCH_FILE=${CWD}/.current_branch.txt

function reset_branch
{
	echo "Reset git to original git branch..."
	test -f "$CURRENT_BRANCH_FILE" && CURRENT_BRANCH="`cat $CURRENT_BRANCH_FILE`"
	git checkout ${CURRENT_BRANCH}
	test -e ".git/rebase-apply" && git am --abort
	git branch -D ${PATCH_BRANCH}
	rm -f $CURRENT_BRANCH_FILE
	exit 1
}

# If --cancel option is given, just reset git and exit.
test "$1" == "--cancel" && reset_branch

# If current branch file is already exist, reset and exit.
test -f "$CURRENT_BRANCH_FILE" && reset_branch

# Remember current branch name to a file
echo "${CURRENT_BRANCH}" > $CURRENT_BRANCH_FILE

# Make sure if current git is clear.
#test -n "`git status -s`" && echo "ERROR: Current git is not clean. Type 'git status' and clean your git up first." && exit 1

# Reset git 
#git reset --hard HEAD

# Create a temporary branch
git branch ${PATCH_BRANCH}	 || reset_branch
git checkout ${PATCH_BRANCH} || reset_branch

# Apply existing patches into libs/
cd ${LIB_DIR}
#for patch in `find ${PATCH_DIR} -name '*.patch' -type f`; do
#	patch -p0 < ${patch} || reset_branch
#done
git am $PATCH_DIR/*.patch

# Make a temporary commit on $PATCH_BRANCH
#git add -f -u .	|| reset_branch
#git commit -m 'Temporary commit applying existing patches'	|| reset_branch


# Done. Notice howto
echo ""
echo "Set up for patch is done. Current temporary git branch name is '${PATCH_BRANCH}', and a temporary commit is created. (This commit and branch will be removed.)"
echo "Go change your source, add&commit into git, and run create-patch.sh to make your commit to a patch file in $PATCH_DIR."

