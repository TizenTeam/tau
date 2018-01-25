#!/bin/sh

if test -f $1; then
	file=$1;
else
	exit 1;
fi

echo "	Trim $file";
sed -i -e ':a;N;$!ba;s/.ui[-a-z\,\ \.]* {\n  \/\*[-a-zA-Z0-9\,\(\)\ \#\_\.\%\!\*\@\:\;\t\n]*\*\/\n\n}//g' $file;
sed -i -e ':a;N;$!ba;s/.LESS[a-zA-Z0-9]*[_[a-zA-Z0-9]*]* {\n[-a-zA-Z0-9\,\(\)\ \#\_\.\%\!\*\@\/\*\:\;\t\n]*}//g' $file;
