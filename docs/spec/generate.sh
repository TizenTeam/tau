#!/usr/bin/env bash

CWD=`dirname $0`

function generate
{
	local fnIn=""
	local fnOut=""
	local outDir=${CWD}/output

	rm -rf ${outDir}
	mkdir -p ${outDir}

	cp doc.css ${outDir}/

	for fnIn in `ls *.html.in`; do
		fnOut="${outDir}/${fnIn%.in}"
		echo "$fnOut"
		cat header.tpl > ${fnOut}
		cat ${fnIn} >> ${fnOut}
		cat footer.tpl >> ${fnOut}
	done
}

generate

