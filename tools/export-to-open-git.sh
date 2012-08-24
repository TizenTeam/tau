#!/bin/bash

function err
{
	echo "ERROR: ${1}"
	exit 1
}

account=$1
if test ! -n "$account"; then
	err "No account is given"
fi

# <name>%%<git address>%%<branch>
git_servers=( \
	private%%165.213.149.219:29418/magnolia/framework/web/web-ui-fw%%2.0_beta \
	public%%tizendev.org:29418/framework/web/web-ui-fw%%2.0_beta \
	)

cd `dirname $0`/../
CWD=`pwd`

# clean-up current git head
rm -rf *
git co .

# make temp dir
tmpdir=`mktemp -d`

for server in "${git_servers[@]}"
do
	n=`echo $server | sed -e 's/\(..*\)%%\(..*\)%%\(..*\)/\1/'`
	s=`echo $server | sed -e 's/\(..*\)%%\(..*\)%%\(..*\)/\2/'`
	b=`echo $server | sed -e 's/\(..*\)%%\(..*\)%%\(..*\)/\3/'`
	echo "n: $n, s: $s, b: $b"

	echo "Clone git: $tempdir/$n"
	cd $tmpdir
	git clone ssh://${account}@${s} $n || err "git clone failure"

	cd $tmpdir/$n
	git fetch origin $b:$b
	git checkout $b

	echo "Clean-up current git and add new git: $n"
	
	git rm -r -f *
	cp -a ${CWD}/* ./
	tools/cleanup-src.sh
	git add -f *
	msg="Export `cat packaging/web-ui-fw.spec | grep "Version:" | sed -e 's@Version:[[:space:]]*\([0-9][0-9\.]*\)@\1@'`"
	git commit -m "$msg"

done

echo ""
echo ""
echo "Done."
echo "Go to $tmpdir/ , check each git repos, add tag for build trigger, and push them if they are OK."

