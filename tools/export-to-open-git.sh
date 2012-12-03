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
	rsa%%tizendev.org:29418/framework/web/web-ui-fw%%master%%submit/trunk/`date --utc +%Y%m%d.%H%M%S`\
	)

cd `dirname $0`/../
CWD=`pwd`

# clean-up current git head
git reset --hard HEAD

# make temp dir
tmpdir=`mktemp -d`

for server in "${git_servers[@]}"
do
	n=`echo $server | sed -e 's/\(..*\)%%\(..*\)%%\(..*\)%%\(..*\)/\1/'`
	s=`echo $server | sed -e 's/\(..*\)%%\(..*\)%%\(..*\)%%\(..*\)/\2/'`
	b=`echo $server | sed -e 's/\(..*\)%%\(..*\)%%\(..*\)%%\(..*\)/\3/'`
	t=`echo $server | sed -e 's/\(..*\)%%\(..*\)%%\(..*\)%%\(..*\)/\4/'`
	echo "n: $n, s: $s, b: $b, t:$t"

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

	echo "Remove previous tag (even in server), and attach a tag on HEAD"
	git push origin :tags/${t}
	git tag -d ${t}
	git tag -a -m "${msg}" ${t}
done

echo ""
echo ""
echo "Done."
echo "Go to $tmpdir/ , check each git repos, add tag for build trigger, and push them if they are OK."
echo "  >> git push origin HEAD:refs/for/${b} ${t}"

