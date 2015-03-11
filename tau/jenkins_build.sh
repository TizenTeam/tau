#!/bin/bash
BUILD_URL="http://10.251.22.242:8080/job/build-bot/"$BUILD_NUMBER
comment=""
files=$(git diff-tree --name-only -r $GIT_COMMIT | grep tau/src/js | sed "s/tau\///g")
count=0
result=0
result_build=0
result_test=0
result_jshint=0

# Build
grunt build
result_build=$?

# Unit Test
grunt test
result_test=$?

# JSHint
if [ ! -z "$files" ]; then
	while read -r line; do
		count=$((count+1))
		grunt jshint:single --jshintfile=$line --jshintno=$count
		if [ $? -ne 0 ]; then
			result_jshint=1
		fi
		# Change source file path from relative to absolute
		sed -i "s/<file name=\"..\/../<file name=\"\/var\/lib\/jenkins\/jobs\/build-bot\/workspace\/tau/g" ./report/jshint/"jshint-"$count".xml"
	done <<<"$files"
fi

# Make gerrit comment
if [ $result_build -eq 0 ]; then
	comment="Build : Success <"$BUILD_URL"/console>

"
else
	comment="Build : Fail <"$BUILD_URL"/console>

"
	result=1
fi
if [ $result_test -eq 0 ]; then
	comment=$comment"Unit Test : Success <"$BUILD_URL"/tapResults>

"
else
	comment=$comment"Unit Test : Fail <"$BUILD_URL"/tapResults>

"
	result=1
fi
if [ $result_jshint -eq 0 ]; then
	comment=$comment"JSHint : Success <"$BUILD_URL"/checkstyleResult>

"
else
	comment=$comment"JSHint : Fail <"$BUILD_URL"/checkstyleResult>

"
fi

#comment=$comment"Coverage : <"$BUILD_URL"/cobertura>"

# Publish comment
ssh -p 29418 webuifw.sec@168.219.209.56 gerrit review --message "\"$comment\"" $GERRIT_PATCHSET_REVISION

exit $result
